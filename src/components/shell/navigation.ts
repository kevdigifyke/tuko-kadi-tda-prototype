export const primaryNavigation = [
  { href: "/", label: "Dashboard", shortLabel: "Dash" },
  { href: "/observatory", label: "Observatory", shortLabel: "Obs" },
  { href: "/analytics", label: "Analytics", shortLabel: "Analytics" },
  { href: "/agents", label: "Agents", shortLabel: "Agents" },
  { href: "/results", label: "Results", shortLabel: "Results" },
  { href: "/evidence", label: "Evidence", shortLabel: "Evidence" },
  { href: "/reports", label: "Reports", shortLabel: "Reports" },
  { href: "/research", label: "Research", shortLabel: "Research" },
  { href: "/presentation", label: "Presentation", shortLabel: "Present" },
  { href: "/public-demo", label: "Public Demo", shortLabel: "Demo" },
  { href: "/settings", label: "Settings", shortLabel: "Settings" },
] as const;

export const secondaryNavigation = [
  { href: "/landing", label: "Landing Page" },
  { href: "/about", label: "About" },
  { href: "/transparency", label: "Transparency" },
] as const;

export const publicDemoNavigation = [
  { href: "/observatory", label: "Observatory", shortLabel: "Obs" },
  { href: "/presentation", label: "Presentation", shortLabel: "Present" },
  { href: "/analytics", label: "Analytics", shortLabel: "Analytics" },
  { href: "/reports", label: "Reports", shortLabel: "Reports" },
] as const;
