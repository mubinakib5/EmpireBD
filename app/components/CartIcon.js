"use client";

import Link from "next/link";

export default function CartIcon() {
  return (
    <Link
      href="/cart"
      className="relative p-2 hover:text-primary transition-colors"
    >
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
    </Link>
  );
}
