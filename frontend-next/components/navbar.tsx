"use client";

import {
    Navbar as NextUINavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
} from "@nextui-org/navbar";
import {Button} from "@nextui-org/button";
import {Link} from "@nextui-org/link";
import {link as linkStyles} from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import {useContext, useState} from "react";

import {siteConfig} from "@/config/site";
import {ThemeSwitch} from "@/components/theme-switch";
import {GithubIcon, Logo} from "@/components/icons";
import {Select, SelectItem} from "@nextui-org/react";
import {LocaleContext} from "@/context/locale-context";
import {locales} from "@/lang/i18n/i18n-config";

export const Navbar = () => {
    const [isAdmin, setIsAdmin] = useState(true);
    const [navItems, setNavItems] = useState(
        isAdmin ? siteConfig.navItems.admin : siteConfig.navItems.user,
    );
    const [navMenuItems, setNavMenuItems] = useState(
        isAdmin ? siteConfig.navMenuItems.admin : siteConfig.navMenuItems.user,
    );

    const {locale, setLocale} = useContext(LocaleContext);

    return (
        <NextUINavbar maxWidth="xl" position="sticky">
            {/* Left-aligned brand */}
            <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                <NavbarBrand as="li" className="gap-3 max-w-fit">
                    <NextLink className="flex justify-start items-center gap-1" href="/">
                        <Logo/>
                        <p className="font-bold text-inherit">LARPlaner</p>
                    </NextLink>
                </NavbarBrand>
                {/* Desktop links */}
                <ul className="hidden sm:flex gap-4 justify-start ml-2">
                    {navItems.map((item) => (
                        <NavbarItem key={item.href}>
                            <NextLink
                                className={clsx(
                                    linkStyles({color: "foreground"}),
                                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                                )}
                                color="foreground"
                                href={item.href}
                            >
                                {item.label}
                            </NextLink>
                        </NavbarItem>
                    ))}
                </ul>
            </NavbarContent>

            {/* Right-aligned content */}
            <NavbarContent className="basis-1/5 flex  sm:basis-full" justify="end">
                <NavbarItem className="hidden sm:flex gap-2">
                    <Link isExternal aria-label="Github" href={siteConfig.links.github}>
                        <GithubIcon className="text-default-500"/>
                    </Link>
                    <ThemeSwitch/>
                </NavbarItem>
                <NavbarItem className="hidden sm:flex space-x-1">
                    <Select
                        className="w-32"
                        size="md"
                        value={locale}
                        defaultSelectedKeys={[locale]}
                        onChange={(event) => setLocale(event.target.value)}
                    >
                        {
                            Object.keys(locales).map((key) => (
                                <SelectItem key={key} value={locales[key].name}>
                                    {locales[key].name}
                                </SelectItem>
                            ))
                        }
                    </Select>
                    <Button
                        as={Link}
                        className="text-sm font-normal text-default-600 bg-default-100"
                        href={"/login"}
                        variant="flat"
                    >
                        Log in
                    </Button>
                </NavbarItem>
            </NavbarContent>

            {/* Mobile menu toggle */}
            <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
                <Link isExternal aria-label="Github" href={siteConfig.links.github}>
                    <GithubIcon className="text-default-500"/>
                </Link>
                <ThemeSwitch/>
                <NavbarMenuToggle/>
            </NavbarContent>

            {/* Mobile menu items */}
            <NavbarMenu className="sm:hidden">
                <div className="mx-4 mt-2 flex flex-col gap-2">
                    {navMenuItems.map((item, index) => (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link color="primary" href={item.href} size="lg">
                                {item.label}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </div>
            </NavbarMenu>
        </NextUINavbar>
    );
};
