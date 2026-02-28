export const PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    credits: 25,
    price: 35,
    perCredit: 1.4,
  },
  {
    id: "small",
    name: "Small",
    credits: 60,
    price: 72,
    perCredit: 1.2,
  },
  {
    id: "medium",
    name: "Medium (Best Value)",
    credits: 150,
    price: 157.5,
    perCredit: 1.05,
  },
  {
    id: "pro",
    name: "Pro",
    credits: 350,
    price: 332.5,
    perCredit: 0.95,
  },
  {
    id: "business",
    name: "Business",
    credits: 900,
    price: 765,
    perCredit: 0.85,
  },
] as const;

export type PackageId = (typeof PACKAGES)[number]["id"];
