"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface Props {
  orderNumber: string;
}

export function OrderConfirmationActions({ orderNumber }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-medium uppercase tracking-[0.08em] text-black transition-colors hover:border-black cursor-pointer"
        aria-label="Copy Order Number"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-[#2E7D32]" />
            <span className="text-[#2E7D32]">Copied</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5 text-[#6B6B6B]" />
            <span>Copy Ref</span>
          </>
        )}
      </button>
    </div>
  );
}
