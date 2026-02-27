"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "For Customers", href: "/for-customers" },
  { label: "For Providers", href: "/for-providers" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[hsl(var(--border-hsl))/0.5] bg-[hsl(var(--background-hsl))/0.9] backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center">
          <img src="/privat-logo.png" alt="PRIVAT" className="h-32" />
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs font-body font-medium tracking-widest-marketing uppercase transition-colors duration-300 hover:text-[hsl(var(--primary-hsl))] ${
                pathname === link.href
                  ? "text-[hsl(var(--primary-hsl))]"
                  : "text-[hsl(var(--muted-foreground-hsl))]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="text-[hsl(var(--foreground-hsl))] lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[hsl(var(--border-hsl))/0.5] bg-[hsl(var(--background-hsl))] lg:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-sm px-3 py-2.5 text-sm font-medium tracking-wide transition-colors hover:bg-[hsl(var(--muted-hsl))] ${
                  pathname === link.href
                    ? "text-[hsl(var(--primary-hsl))]"
                    : "text-[hsl(var(--muted-foreground-hsl))]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
