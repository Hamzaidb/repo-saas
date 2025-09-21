// apps/backend/src/routes/billing.ts
import { FastifyPluginAsync } from 'fastify';
import { stripe } from '../lib/stripe';
import type Stripe from 'stripe';

const billingRoutes: FastifyPluginAsync = async (app) => {
  if (!process.env.APP_URL) {
    app.log.warn('APP_URL is not set. Falling back to http://localhost:3000 for redirect URLs');
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    app.log.warn('STRIPE_WEBHOOK_SECRET is not set. Webhook verification will fail until configured.');
  }
  // Create Checkout Session for cart (one-off payments)
  app.post('/billing/create-checkout-session', async (req, reply) => {
    // Normalize body in case a raw Buffer was received
    let body: any = (req as any).body;
    if (Buffer.isBuffer(body)) {
      try {
        body = JSON.parse(body.toString('utf8'));
      } catch (e) {
        app.log.error({ e }, '[billing] Failed to parse request body buffer as JSON');
        return reply.status(400).send({ error: 'Invalid JSON body' });
      }
    }
    const { mode, lineItems, priceId, successUrl, cancelUrl, customerId, userId, items } = body as any;

    app.log.info({ mode, priceId, customerId, userId, items, lineItems }, '[billing] Incoming create-checkout-session payload');

    const isSubscription = mode === 'subscription';

    let computedLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] | undefined = undefined;

    if (isSubscription) {
      if (!priceId) {
        app.log.warn('[billing] Missing priceId for subscription mode');
        return reply.status(400).send({ error: 'priceId is required for subscription mode' });
      }
      computedLineItems = [{ price: priceId, quantity: 1 }];
    } else {
      // One-off payment from your own product catalog
      if (Array.isArray(lineItems) && lineItems.length > 0) {
        // Allow direct pass-through (e.g., price-based) if provided
        computedLineItems = lineItems;
      } else {
        if (!Array.isArray(items) || items.length === 0) {
          app.log.warn({ body }, '[billing] Invalid items payload for payment mode');
          return reply.status(400).send({ error: 'items is required for payment mode: [{ productId, quantity }]' });
        }
        const ids = items.map((i: any) => i.productId).filter((v: any) => typeof v === 'string' && v.length > 0);
        const qtyMap = new Map<string, number>();
        for (const it of items) qtyMap.set(it.productId, Math.max(1, Number(it.quantity) || 1));

        if (ids.length === 0) {
          app.log.warn({ items }, '[billing] No valid product IDs in items');
          return reply.status(400).send({ error: 'No valid product IDs in items' });
        }

        // Fetch products from DB (Prisma decorated on app)
        const products = await (app as any).prisma.products.findMany({
          where: { id: { in: ids } },
        });

        app.log.info({ requestedIds: ids, foundCount: products?.length }, '[billing] Products lookup result');

        if (!products || products.length === 0) {
          app.log.warn({ ids }, '[billing] No products found for provided ids');
          return reply.status(400).send({ error: 'No products found for provided ids', ids });
        }

        computedLineItems = products.map((p: any) => {
          const quantity = qtyMap.get(p.id) ?? 1;
          const priceNumber = Number(p.price); // Prisma Decimal -> number
          const unit_amount = Math.round(priceNumber * 100);
          const images: string[] = [];
          // Ensure images are valid absolute URLs as required by Stripe
          if (p.image_url && typeof p.image_url === 'string') {
            const raw = p.image_url as string;
            try {
              const base = process.env.APP_URL ?? 'http://localhost:3000';
              const abs = new URL(raw, base).toString();
              if (abs.startsWith('http://') || abs.startsWith('https://')) {
                images.push(abs);
              }
            } catch {
              // ignore invalid URLs
            }
          }
          return {
            price_data: {
              currency: 'eur',
              unit_amount,
              product_data: {
                name: p.name as string,
                ...(images.length ? { images } : {}),
              },
            },
            quantity,
          } as Stripe.Checkout.SessionCreateParams.LineItem;
        });
      }
    }

    if (!computedLineItems || computedLineItems.length === 0) {
      app.log.warn('[billing] No line items computed for checkout');
      return reply.status(400).send({ error: 'No line items provided or computed' });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        mode: isSubscription ? 'subscription' : 'payment',
        customer: customerId, // optional (reuse if you have it)
        client_reference_id: userId, // optional: link to your user
        metadata: userId ? { userId } : undefined,
        line_items: computedLineItems,
        success_url: successUrl ?? `${process.env.APP_URL ?? 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl ?? `${process.env.APP_URL ?? 'http://localhost:3000'}/cancel`,
        allow_promotion_codes: true,
      });
      return reply.send({ url: session.url });
    } catch (err: any) {
      app.log.error({ err }, '[billing] Stripe session creation failed');
      return reply.status(500).send({ error: 'Stripe session creation failed', details: err?.message });
    }
  });

  // Customer Portal
  app.post('/billing/create-portal-session', async (req, reply) => {
    const { customerId, returnUrl } = req.body as any;
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl ?? `${process.env.APP_URL ?? 'http://localhost:3000'}/account/billing`,
    });
    return reply.send({ url: session.url });
  });

  // Webhook
  app.addHook('onRoute', () => {
    // Reminder: raw body parser is configured in app.ts for /webhooks/stripe
  });

  app.post('/webhooks/stripe', { config: { rawBody: true } }, async (req, reply) => {
    const sig = req.headers['stripe-signature'] as string;
    const buf = (req as any).rawBody || (req as any).body; // ensure buffer
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      app.log.error({ err }, 'Webhook signature verification failed');
      return reply.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        // TODO: Link session to your user by client_reference_id / metadata
        // If subscription mode: session.subscription contains subscription id
        // Persist stripe_customer_id on the user if missing
        break;
      }
      case 'invoice.payment_succeeded':
      case 'invoice.payment_failed':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        // TODO: Update your records (payment history, subscription status)
        break;
      default:
        app.log.info(`Unhandled event type ${event.type}`);
    }

    reply.send({ received: true });
  });
};

export default billingRoutes;