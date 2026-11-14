import React from "react";

const NOTES = [
  "New festive edit",
  "Unstitched 2-piece & 3-piece",
  "Cash on delivery across Pakistan",
] as const;

export const ANNOUNCEMENT_MESSAGES = NOTES;

export default function AnnouncementBar() {
  return (
    <div
      role="region"
      aria-label="Promotions and policies"
      className="relative z-50 w-full border-b border-[#E8D7B0] bg-[#1C1612] text-[#F6E7C1]"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 sm:gap-x-4">
        {NOTES.map((note, index) => (
          <React.Fragment key={note}>
            {index > 0 && (
              <span className="text-[8px] text-[#A6843D]" aria-hidden="true">
                ◆
              </span>
            )}
            <span
              className={`font-sans text-[10px] font-medium uppercase tracking-[0.2em] sm:text-[11px] ${
                index === 2 ? "hidden md:inline" : ""
              }`}
            >
              {note}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
