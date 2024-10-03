"use client";

export type SiteConfig = typeof siteConfig;

import { defineMessages } from "react-intl";

const siteConfigMessages = defineMessages({
  navHome: {
    id: "nav.home",
    defaultMessage: "Home",
  },
  navEvents: {
    id: "nav.events",
    defaultMessage: "Events",
  },
  navScenarios: {
    id: "nav.scenarios",
    defaultMessage: "Scenarios",
  },
  navRoles: {
    id: "nav.roles",
    defaultMessage: "Roles",
  },
  navScan: {
    id: "nav.scan",
    defaultMessage: "Scan",
  },
});

export const siteConfig = {
  name: "LARPlaner",
  description: "LARPlaner - plan and conduct LARP events.",
  navItems: {
    admin: [
      {
        label: siteConfigMessages.navHome,
        href: "/",
      },
      {
        label: siteConfigMessages.navEvents,
        href: "/admin/events",
      },
      {
        label: siteConfigMessages.navScenarios,
        href: "/admin/scenarios",
      },
      {
        label: siteConfigMessages.navRoles,
        href: "/admin/roles",
      },
      {
        label: siteConfigMessages.navScan,
        href: "/admin/scan",
      },
    ],
    user: [
      {
        label: siteConfigMessages.navHome,
        href: "/",
      },
      {
        label: siteConfigMessages.navEvents,
        href: "/events",
      },
    ],
  },
  navMenuItems: {
    admin: [
      {
        label: siteConfigMessages.navHome,
        href: "/",
      },
      {
        label: siteConfigMessages.navEvents,
        href: "/admin/events",
      },
      {
        label: siteConfigMessages.navScenarios,
        href: "/admin/scenarios",
      },
      {
        label: siteConfigMessages.navRoles,
        href: "/admin/roles",
      },
      {
        label: siteConfigMessages.navScan,
        href: "/admin/scan",
      },
    ],
    user: [
      {
        label: siteConfigMessages.navHome,
        href: "/",
      },
      {
        label: siteConfigMessages.navEvents,
        href: "/events",
      },
    ],
  },
  links: {
    github: "https://github.com/ehpop/LARPlaner",
  },
};
