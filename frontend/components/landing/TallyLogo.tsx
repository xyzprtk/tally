export default function TallyLogo({
  size = 200,
  variant = "full",
  className = "",
}: {
  size?: number;
  variant?: "full" | "icon";
  className?: string;
}) {
  if (variant === "icon") {
    return (
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Tally logo icon"
      >
        <title>Tally Logo</title>
        <rect x="5" y="5" width="90" height="90" rx="22" fill="#C05C46" />
        <rect x="22" y="30" width="56" height="12" rx="3" fill="#F9F8F6" />
        <rect x="44" y="30" width="12" height="48" rx="3" fill="#F9F8F6" />
        <rect x="60" y="48" width="3" height="14" rx="1.5" fill="#F9F8F6" opacity="0.35" />
        <rect x="67" y="48" width="3" height="14" rx="1.5" fill="#F9F8F6" opacity="0.35" />
        <rect x="74" y="48" width="3" height="14" rx="1.5" fill="#F9F8F6" opacity="0.35" />
        <rect x="81" y="48" width="3" height="14" rx="1.5" fill="#F9F8F6" opacity="0.35" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 300 100"
      width={size}
      height={size * (100 / 300)}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Tally logo"
    >
      <title>Tally Logo</title>
      <g transform="translate(10, 10) scale(0.8)">
        <rect x="5" y="5" width="90" height="90" rx="22" fill="#C05C46" />
        <rect x="22" y="30" width="56" height="12" rx="3" fill="#F9F8F6" />
        <rect x="44" y="30" width="12" height="48" rx="3" fill="#F9F8F6" />
        <rect x="60" y="48" width="3" height="14" rx="1.5" fill="#F9F8F6" opacity="0.35" />
        <rect x="67" y="48" width="3" height="14" rx="1.5" fill="#F9F8F6" opacity="0.35" />
        <rect x="74" y="48" width="3" height="14" rx="1.5" fill="#F9F8F6" opacity="0.35" />
        <rect x="81" y="48" width="3" height="14" rx="1.5" fill="#F9F8F6" opacity="0.35" />
      </g>
      <text
        x="115"
        y="50"
        fontFamily="Geist, Inter, sans-serif"
        fontSize="34"
        fontWeight="700"
        dominantBaseline="central"
        fill="currentColor"
      >
        Tally
      </text>
    </svg>
  );
}
