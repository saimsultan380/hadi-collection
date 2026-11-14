"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

// =============================================================================
// NEWSLETTER FORM COMPONENT — Minimal (Aldo Inspired)
// =============================================================================

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="border border-black bg-[#F7F7F7] p-4 text-center rounded-[8px]">
        <p className="font-sans text-[13px] font-semibold text-black">
          Thank you for subscribing.
        </p>
        <p className="text-[#6B6B6B] mt-1 font-sans text-[12px]">
          We’ve recorded {email} for upcoming capsule releases.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2 flex w-full max-w-md flex-col gap-2 sm:flex-row"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        required
        aria-label="Email address for newsletter"
        className="flex-1 border border-[#E5E5E5] bg-white px-4 py-3 font-sans text-[13px] text-black placeholder:text-[#6B6B6B] rounded-[8px] focus:border-black focus:outline-none shadow-none"
      />
      <Button type="submit" variant="primary" size="md">
        Subscribe
      </Button>
    </form>
  );
}
