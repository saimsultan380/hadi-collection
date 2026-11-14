import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  linked?: boolean;
  showText?: boolean;
  theme?: "light" | "dark";
  className?: string;
}

const sizeConfig = {
  sm: { width: 120, height: 72 },
  md: { width: 168, height: 100 },
  lg: { width: 220, height: 130 },
};

export default function Logo({
  size = "md",
  linked = true,
  showText = false,
  theme = "light",
  className = "",
}: LogoProps) {
  const config = sizeConfig[size] || sizeConfig.md;
  const textColor = theme === "dark" ? "text-white" : "text-[#2C2118]";

  const mark = (
    <span
      className={`inline-flex items-center gap-2.5 group select-none ${className}`}
      aria-label="Hadi Collection"
    >
      <Image
        data-no-radius
        src="/hadi-logo.png"
        alt="Hadi Collection"
        width={config.width}
        height={config.height}
        className="h-auto w-auto max-h-[72px] object-contain object-left shrink-0 bg-transparent"
        priority
      />
      {showText && (
        <span className={`font-display leading-none ${textColor} text-xl`}>
          Hadi Collection
        </span>
      )}
    </span>
  );

  if (!linked) return mark;

  return (
    <Link href="/" aria-label="Hadi Collection — Home" className="inline-flex items-center">
      {mark}
    </Link>
  );
}
