import { forwardRef } from "react";

const VARIANT_CLASSES = {
    primary: "bg-navy text-white hover:bg-navy-light focus-visible:outline-navy",
    accent: "bg-accent text-navy hover:bg-accent-dark focus-visible:outline-accent-dark",
    outline: "border-2 border-navy text-navy hover:bg-navy hover:text-white focus-visible:outline-navy",
    ghost: "text-navy hover:bg-navy/5 focus-visible:outline-navy",
};

const SIZE_CLASSES = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
};

/**
 * Tombol reusable dipakai di Landing page & Beranda.
 * Contoh:
 *   <Button variant="accent">Temukan Event</Button>
 *   <Button variant="outline" as="a" href="/register">Daftarkan Usahamu</Button>
 */
const Button = forwardRef(
    ({ variant = "primary", size = "md", as: Component = "button", className = "", children, ...props }, ref) => {
        return (
            <Component
                ref={ref}
                className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold
          transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
          ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
                {...props}
            >
                {children}
            </Component>
        );
    }
);

Button.displayName = "Button";

export default Button;