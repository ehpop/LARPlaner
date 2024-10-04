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
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import React, { FC, useContext, useEffect, useState } from "react";
import { Avatar, Select, SelectItem } from "@nextui-org/react";
import { FormattedMessage } from "react-intl";
import { User } from "@firebase/auth";

import { SiteConfig, siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, Logo } from "@/components/icons";
import { LocaleContext } from "@/context/locale-context";
import { FirebaseContext } from "@/context/firebase-context";
import { locales } from "@/lang/i18n/i18n-config";

interface AccountElementProps {
  user: User | null | undefined;
  handleLogOut: () => void;
}

const AccountElement: FC<AccountElementProps> = ({ user, handleLogOut }) => {
  const buttonClass = "text-sm font-normal text-default-600 bg-default-100";

  if (!user) {
    return (
      <Link href={"/login"}>
        <Button className={buttonClass} variant="flat">
          <FormattedMessage defaultMessage="Log in" id="nav.login" />
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex space-x-3">
      <Button
        className={buttonClass}
        size="md"
        variant="flat"
        onClick={handleLogOut}
      >
        <FormattedMessage defaultMessage="Log out" id="nav.logout" />
      </Button>

      <Link
        aria-label="Profile"
        className="flex justify-center items-center gap-1"
        href={"/profile"}
      >
        <Avatar showFallback src={user.photoURL || undefined} />
      </Link>
    </div>
  );
};

export const Navbar = () => {
  const { user, isAdmin, handleLogOut } = useContext(FirebaseContext);
  const { locale, setLocale } = useContext(LocaleContext);

  const [navItems, setNavItems] = useState<SiteConfig["navItems"]["admin"]>();
  const [navMenuItems, setNavMenuItems] =
    useState<SiteConfig["navMenuItems"]["admin"]>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNavItems(isAdmin ? siteConfig.navItems.admin : siteConfig.navItems.user);
    setNavMenuItems(
      isAdmin ? siteConfig.navMenuItems.admin : siteConfig.navMenuItems.user,
    );
  }, [user, isAdmin]);

  const languageSelect = (
    <Select
      aria-label="Select language"
      className="w-32"
      defaultSelectedKeys={[locale]}
      size="md"
      value={locale}
      onChange={(event) => setLocale(event.target.value)}
    >
      {Object.keys(locales).map((key) => (
        <SelectItem key={key} value={locales[key].name}>
          {locales[key].name}
        </SelectItem>
      ))}
    </Select>
  );

  const accountElement = (
    <AccountElement handleLogOut={handleLogOut} user={user} />
  );

  const localeAndAccount = (
    <>
      <NavbarItem className="hidden sm:flex space-x-1">
        {languageSelect}
      </NavbarItem>
      <NavbarItem className="hidden sm:flex space-x-1">
        {accountElement}
      </NavbarItem>
    </>
  );

  const navbar = (
    <NextUINavbar maxWidth="xl" position="sticky">
      {/* Left-aligned brand */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">{siteConfig.name}</p>
          </NextLink>
        </NavbarBrand>
        {/* Desktop links */}
        <ul className="hidden sm:flex gap-4 justify-start ml-2">
          {navItems &&
            navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {<FormattedMessage id={item.label} />}
                </NextLink>
              </NavbarItem>
            ))}
        </ul>
      </NavbarContent>

      {/* Right-aligned content */}
      <NavbarContent className="basis-1/5 flex  sm:basis-full" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        {localeAndAccount}
      </NavbarContent>

      {/* Mobile menu toggle */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Mobile menu items */}
      <NavbarMenu className="sm:hidden">
        <NavbarMenuItem>{languageSelect}</NavbarMenuItem>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {navMenuItems &&
            navMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link color="primary" href={item.href} size="lg">
                  <FormattedMessage id={item.label} />
                </Link>
              </NavbarMenuItem>
            ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );

  return mounted ? navbar : <div />;
};
