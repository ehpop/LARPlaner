"use client";

import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
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
} from "@heroui/react";
import { FormattedMessage, useIntl } from "react-intl";
import { User } from "@firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { SiteConfig, siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon } from "@/components/icons";
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
  const intl = useIntl();
  const router = useRouter();
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
    <Dropdown>
      <DropdownTrigger className="cursor-pointer">
        <Avatar showFallback src={user.photoURL || undefined} />
      </DropdownTrigger>
      <DropdownMenu
        aria-label={intl.formatMessage({
          id: "components.navbar.static.actions",
          defaultMessage: "Static Actions",
        })}
        onAction={(key) => {
          if (key === "log out") handleLogOut();
          else if (key === "profile") router.push("/user/profile");
        }}
      >
        <DropdownItem key="profile" textValue="profile">
          <FormattedMessage defaultMessage="Profile" id="nav.dashboard" />
        </DropdownItem>
        <DropdownItem
          key="log out"
          className="text-danger"
          color="danger"
          textValue="log out"
        >
          <FormattedMessage defaultMessage="Log out" id="nav.logout" />
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
              onPress={() => setIsMenuOpen(false)}
            >
              <FormattedMessage id={item.label} />
            </Link>
          </NavbarMenuItem>
        ))}
    </div>
  );
}

export const Navbar = () => {
  const intl = useIntl();

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
      disallowEmptySelection
      aria-label={intl.formatMessage({
        id: "components.navbar.select.language",
        defaultMessage: "Select language",
      })}
      className="w-32"
      defaultSelectedKeys={[locale]}
      size="md"
      value={locale}
      variant="bordered"
      onChange={(event) => setLocale(event.target.value)}
    >
      {Object.keys(locales).map((key) => (
        <SelectItem key={key}>{locales[key].name}</SelectItem>
      ))}
    </Select>
  );

  const accountElement = (
    <AccountElement handleLogOut={handleLogOut} user={user} />
  );

  const localeAndAccount = (
    <div className="hidden lg:flex space-x-2">
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
            <Image alt="brand" height={36} src="/favicon.ico" width={36} />
            <p className="font-bold text-inherit">{siteConfig.name}</p>
          </NextLink>
        </NavbarBrand>
        {navItems && <DesktopLinks navItems={navItems} />}
      </NavbarContent>

      {/* Right-aligned content */}
      <NavbarContent className="basis-1/5 flex lg:basis-full" justify="end">
        <NavbarItem className="hidden lg:flex gap-2">
          <Link
            isExternal
            aria-label={intl.formatMessage({
              id: "components.navbar.github",
              defaultMessage: "Github",
            })}
            href={siteConfig.links.github}
          >
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
