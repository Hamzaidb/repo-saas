"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
};

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("cart", JSON.stringify(items));
}

export default function AddToCartButton({
  id,
  name,
  price,
  image_url,
  defaultQuantity = 1,
  onAdded,
  goToCartOnAdd,
}: {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  defaultQuantity?: number;
  onAdded?: (item: CartItem) => void;
  goToCartOnAdd?: boolean;
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdding(true);
    try {
      console.log("[AddToCartButton] Click -> reading cart from localStorage");
      const cart = readCart();
      console.log("[AddToCartButton] Cart read:", cart);
      const idx = cart.findIndex((i) => i.id === id);
      if (idx >= 0) {
        cart[idx].quantity += defaultQuantity;
      } else {
        cart.push({ id, name, price, image_url, quantity: defaultQuantity });
      }
      console.log("[AddToCartButton] Writing cart:", cart);
      writeCart(cart);
      console.log("[AddToCartButton] Write complete, added item:", { id, name, price, image_url, quantity: defaultQuantity });
      setAdded(true);
      onAdded?.({ id, name, price, image_url, quantity: defaultQuantity });
      setTimeout(() => setAdded(false), 1500);
      if (goToCartOnAdd) {
        console.log("[AddToCartButton] Navigating to /cart...");
        router.push("/cart");
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={adding}
      className={`cursor-pointer max-w-xs flex-1 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white sm:w-full ${
        added ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"
      }`}
    >
      {adding ? "Ajout..." : added ? "Ajouté !" : "Ajouter au panier"}
    </button>
  );
}
