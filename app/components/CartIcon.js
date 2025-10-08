"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CartIcon() {
  const { getCartItemsCount } = useCart();
  const itemCount = getCartItemsCount();

  return (
    <Link
      href="/cart"
      className="relative inline-block p-2 hover:text-primary transition-colors"
    >
      <div className="relative inline-block">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9"
          />
        </svg>

        {/* Cart Count Badge */}
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] transform -translate-x-0.5 translate-y-0.5">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </div>
    </Link>
  );
}
