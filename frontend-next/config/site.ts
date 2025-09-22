export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "LARPlaner",
  description: "LARPlaner - plan and conduct LARP events.",
  navItems: {
    admin: [
      { label: "nav.home", href: "/" },
      { label: "nav.events", href: "/admin/events" },
      { label: "nav.scenarios", href: "/admin/scenarios" },
      { label: "nav.roles", href: "/admin/roles" },
      { label: "nav.tags", href: "/admin/tags" },
    ],
    user: [
      { label: "nav.home", href: "/" },
      { label: "nav.events", href: "/user/events" },
    ],
  },
  navMenuItems: {
    admin: [
      { label: "nav.home", href: "/" },
      { label: "nav.events", href: "/admin/events" },
      { label: "nav.scenarios", href: "/admin/scenarios" },
      { label: "nav.roles", href: "/admin/roles" },
      { label: "nav.tags", href: "/admin/tags" },
    ],
    user: [
      { label: "nav.home", href: "/" },
      { label: "nav.events", href: "/user/events" },
    ],
  },
  links: {
    github: "https://github.com/ehpop/LARPlaner",
  },
};
