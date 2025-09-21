// apps/frontend/src/lib/stripe.ts
import { loadStripe } from '@stripe/stripe-js';
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export async function startCheckout(priceId: string, opts?: { successUrl?: string; cancelUrl?: string; customerId?: string; userId?: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/billing/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode: 'subscription',
      priceId,
      successUrl: opts?.successUrl,
      cancelUrl: opts?.cancelUrl,
      customerId: opts?.customerId,
      userId: opts?.userId,
    }),
  });
  if (!res.ok) {
    let details: any = undefined;
    try { details = await res.json(); } catch {}
    console.error('[stripe] startCheckout failed', { status: res.status, details });
    throw new Error(`Failed to create checkout session: ${res.status}`);
  }
  const { url } = await res.json();
  window.location.href = url;
}

export type CartCheckoutItem = { productId: string; quantity: number };

export async function startCartCheckout(items: CartCheckoutItem[], opts?: { successUrl?: string; cancelUrl?: string; customerId?: string; userId?: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/billing/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode: 'payment',
      items,
      successUrl: opts?.successUrl,
      cancelUrl: opts?.cancelUrl,
      customerId: opts?.customerId,
      userId: opts?.userId,
    }),
  });
  if (!res.ok) {
    let details: any = undefined;
    try { details = await res.json(); } catch {}
    console.error('[stripe] startCartCheckout failed', { status: res.status, details });
    throw new Error(`Failed to create checkout session: ${res.status}`);
  }
  const { url } = await res.json();
  window.location.href = url;
}