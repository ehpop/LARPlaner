export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "LARPlaner",
  description: "LARPlaner - plan and conduct LARP events.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Events",
      href: "/events",
    },
    {
      label: "Scan",
      href: "/scan",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Events",
      href: "/events",
    },
    {
      label: "Scan",
      href: "/scan",
    },
  ],
  links: {
    github: "https://github.com/ehpop/LARPlaner",
  },
};
