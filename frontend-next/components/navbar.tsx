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
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FormattedMessage } from "react-intl";
import { User } from "@firebase/auth";
import { useRouter } from "next/navigation";

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

interface DesktopLinksProps {
  navItems: SiteConfig["navItems"]["admin"] | SiteConfig["navItems"]["user"];
}

interface NavbarMenuContentProps {
  items:
    | SiteConfig["navMenuItems"]["admin"]
    | SiteConfig["navMenuItems"]["user"];
  setIsMenuOpen: (isOpen: boolean) => void;
  languageSelect: React.JSX.Element;
}

const AccountElement: FC<AccountElementProps> = ({ user, handleLogOut }) => {
  const buttonClass = "text-sm font-normal text-default-600 bg-default-100";
  const router = useRouter();

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
    <Dropdown>
      <DropdownTrigger className="cursor-pointer">
        <Avatar showFallback src={user.photoURL || undefined} />
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="profile" textValue="profile">
          <Link color="foreground" href={"/profile"}>
            <FormattedMessage defaultMessage="Profile" id="nav.dashboard" />
          </Link>
        </DropdownItem>
        <DropdownItem
          key="log out"
          textValue="log out"
          onClick={() => {
            handleLogOut();
          }}
        >
          <Link className="text-danger" href="#">
            <FormattedMessage defaultMessage="Log out" id="nav.logout" />
          </Link>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const DesktopLinks = ({ navItems }: DesktopLinksProps) => {
  return (
    <ul className="hidden lg:flex gap-4 justify-start ml-2">
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
  );
};

function NavbarMenuContent({
  items,
  setIsMenuOpen,
  languageSelect,
}: NavbarMenuContentProps) {
  return (
    <div className="mx-4 mt-2 flex flex-col gap-2 w-3/4 justify-center">
      <NavbarMenuItem>{languageSelect}</NavbarMenuItem>
      {items &&
        items.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color="foreground"
              href={item.href}
              size="lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <FormattedMessage id={item.label} />
            </Link>
          </NavbarMenuItem>
        ))}
    </div>
  );
}

export const Navbar = () => {
  const { user, isAdmin, handleLogOut } = useContext(FirebaseContext);
  const { locale, setLocale } = useContext(LocaleContext);

  const [navItems, setNavItems] = useState<SiteConfig["navItems"]["admin"]>();
  const [navMenuItems, setNavMenuItems] =
    useState<SiteConfig["navMenuItems"]["admin"]>();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <div className="hidden lg:flex space-x-1">
      <NavbarItem>{languageSelect}</NavbarItem>
      <NavbarItem>{accountElement}</NavbarItem>
    </div>
  );

  const navbar = (
    <NextUINavbar
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Left-aligned brand */}
      <NavbarContent className="basis-1/5 lg:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">{siteConfig.name}</p>
          </NextLink>
        </NavbarBrand>
        {navItems && <DesktopLinks navItems={navItems} />}
      </NavbarContent>

      {/* Right-aligned content */}
      <NavbarContent className="basis-1/5 flex lg:basis-full" justify="end">
        <NavbarItem className="hidden lg:flex gap-2">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden lg:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        {localeAndAccount}
      </NavbarContent>

      {/* Mobile menu toggle */}
      <NavbarContent className="lg:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        {accountElement}
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Mobile menu items */}
      <NavbarMenu className="lg:hidden">
        {navMenuItems && (
          <NavbarMenuContent
            items={navMenuItems}
            languageSelect={languageSelect}
            setIsMenuOpen={setIsMenuOpen}
          />
        )}
      </NavbarMenu>
    </NextUINavbar>
  );

  return mounted ? navbar : <div />;
};
