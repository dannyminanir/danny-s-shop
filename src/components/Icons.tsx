// Small SVG icons used across the app. Pass a className to change size and colour.
import type { ReactNode } from "react";

interface IconProps {
  className?: string;
}

// Shared wrapper so every icon has the same stroke style
function Icon({ className = "h-5 w-5", fill = "none", children }: IconProps & { fill?: string; children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const ShopBagIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </Icon>
);

export const CartIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
  </Icon>
);

export const HeartIcon = ({ className, filled = false }: IconProps & { filled?: boolean }) => (
  <Icon className={className} fill={filled ? "currentColor" : "none"}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8Z" />
  </Icon>
);

export const StarIcon = ({ className, filled = false }: IconProps & { filled?: boolean }) => (
  <Icon className={className} fill={filled ? "currentColor" : "none"}>
    <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21.1 7 14.2 2 9.3l6.9-1L12 2Z" />
  </Icon>
);

export const TrashIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="m19 6-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </Icon>
);

export const PencilIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" />
  </Icon>
);

export const EyeIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

export const EyeOffIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M9.9 4.2A10 10 0 0 1 12 4c6.4 0 10 8 10 8a17 17 0 0 1-3 4.2" />
    <path d="M6.6 6.6A17 17 0 0 0 2 12s3.6 8 10 8a10 10 0 0 0 5.4-1.6" />
    <path d="M14.1 14.1a3 3 0 1 1-4.2-4.2" />
    <path d="m2 2 20 20" />
  </Icon>
);

export const PlusIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Icon>
);

export const MinusIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M5 12h14" />
  </Icon>
);
