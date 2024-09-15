export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    name: "LARPlaner",
    description: "LARPlaner - plan and conduct LARP events.",
    navItems: {
        admin: [
            {
                label: "Home",
                href: "/",
            },
            {
                label: "Events",
                href: "/admin/events",
            },
            {
                label: "Scenarios",
                href: "/admin/scenarios",
            },
            {
                label: "Roles",
                href: "/admin/roles",
            },
            {
                label: "Scan",
                href: "/admin/scan",
            },
        ],
        user: [
            {
                label: "Home",
                href: "/",
            },
            {
                label: "Events",
                href: "/admin/events",
            },
            {
                label: "Scenarios",
                href: "/admin/scenarios",
            },
            {
                label: "Roles",
                href: "/admin/roles",
            },
            {
                label: "Roles",
                href: "/admin/scan",
            },
        ],
    },
    navMenuItems: {
        admin: [
            {
                label: "Home",
                href: "/",
            },
            {
                label: "Events",
                href: "/events",
            },
            {
                label: "Scenarios",
                href: "/scenarios",
            },
            {
                label: "Roles",
                href: "/roles",
            },
            {
                label: "Scan",
                href: "/scan",
            },
        ],
        user: [
            {
                label: "Home",
                href: "/",
            },
            {
                label: "Events",
                href: "/events",
            },
            {
                label: "Scenarios",
                href: "/scenarios",
            },
            {
                label: "Roles",
                href: "/roles",
            },
        ],
    },
    links: {
        github: "https://github.com/ehpop/LARPlaner",
    },
};
