interface LogoProps {
  width: number;
  height: number;
  className?: string;
}

export default function Logo({ width, height, className } : LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 85 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0 31.4186L21.3333 21L42.2924 31.4186L21.3333 42.2093L64 63.7907V85L0 53V31.4186Z"
        fill="currentColor"
      />
      <path
        d="M63.5412 42.5434L43.2118 53.6416L63.9176 64L85 53.2717V31.4451L21.3765 0L21 21.4566L63.5412 42.5434Z"
        fill="currentColor"
      />
    </svg>
  );
}
