import Link from "next/link";

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "For Customers", href: "/for-customers" },
      { label: "For Providers", href: "/for-providers" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-[hsl(var(--border-hsl))/0.5] bg-[hsl(var(--background-hsl))]">
      <div className="container mx-auto px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3 md:items-start md:justify-items-start">
          <div className="text-left">
            <img src="/privat-logo.png" alt="PRIVAT" className="mb-4 h-28" />
            <p className="max-w-xs text-sm leading-relaxed text-[hsl(var(--muted-foreground-hsl))]">
              PRIVAT is a premium maintenance marketplace connecting discerning customers with verified, professional service providers.
              Premium maintenance services, delivered with discretion and professionalism.
            </p>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="mb-4 text-xs font-heading font-medium tracking-ultra uppercase text-[hsl(var(--foreground-hsl))]">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[hsl(var(--muted-foreground-hsl))] transition-colors hover:text-[hsl(var(--primary-hsl))]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-[hsl(var(--border-hsl))/0.3] pt-8">
          <p className="text-xs text-[hsl(var(--muted-foreground-hsl))] text-center md:text-left">
            © 2025 MIK INTELLIGENCE FZCO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
