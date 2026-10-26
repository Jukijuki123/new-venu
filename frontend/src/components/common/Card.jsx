/**
 * Card reusable dengan beberapa varian dasar.
 * Contoh:
 *   <Card>Konten...</Card>
 *   <Card variant="muted" padding="lg">...</Card>
 */
const VARIANT_CLASSES = {
  default: "bg-white ring-1 ring-navy/5 shadow-sm",
  muted: "bg-surface-muted",
  navy: "bg-navy text-white",
};

const PADDING_CLASSES = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  variant = "default",
  padding = "md",
  className = "",
  children,
  ...props
}) {
  return (
    <div
      className={`rounded-xl2 ${VARIANT_CLASSES[variant]} ${PADDING_CLASSES[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
