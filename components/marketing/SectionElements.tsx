import { ReactNode } from "react";

export const SectionWrapper = ({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) => (
  <section id={id} className={`py-20 lg:py-28 ${className}`}>
    <div className="container mx-auto px-4 lg:px-8">{children}</div>
  </section>
);

export const SectionHeading = ({
  title,
  subtitle,
  centered = true,
}: {
  title: string;
  subtitle?: string;
  centered?: boolean;
}) => (
  <div className={`mb-14 max-w-2xl ${centered ? "mx-auto text-center" : ""}`}>
    <h2 className="text-2xl font-heading font-semibold tracking-widest-marketing uppercase md:text-3xl lg:text-4xl">
      <span className="text-gold-gradient">{title}</span>
    </h2>
    {subtitle && (
      <p className="mt-4 text-base leading-relaxed text-muted-foreground lg:text-lg">
        {subtitle}
      </p>
    )}
  </div>
);

export const GoldDivider = ({ className = "" }: { className?: string }) => (
  <div className={`mx-auto h-px w-24 border-gold-gradient border-t ${className}`} />
);
