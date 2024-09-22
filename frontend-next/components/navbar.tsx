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
import {useContext, useEffect, useState} from "react";

import {siteConfig} from "@/config/site";
import {ThemeSwitch} from "@/components/theme-switch";
import {GithubIcon, Logo} from "@/components/icons";
import {Image, Select, SelectItem} from "@nextui-org/react";
import {LocaleContext} from "@/context/locale-context";
import {locales} from "@/lang/i18n/i18n-config";
import {FormattedMessage} from "react-intl";
import {FirebaseContext} from "@/context/firebase-context";
import {GoogleAuthProvider, signInWithPopup} from "@firebase/auth";

export const Navbar = () => {
    const {auth, user, setUser, isAdmin, setIsAdmin} = useContext(FirebaseContext);
    const [navItems, setNavItems] = useState(
        isAdmin ? siteConfig.navItems.admin : siteConfig.navItems.user,
    );

    const [navMenuItems, setNavMenuItems] = useState(
        isAdmin ? siteConfig.navMenuItems.admin : siteConfig.navMenuItems.user,
    );
    const {locale, setLocale} = useContext(LocaleContext);
    const googleAuthProvider = new GoogleAuthProvider();

    useEffect(() => {
        setNavItems(isAdmin ? siteConfig.navItems.admin : siteConfig.navItems.user);
        setNavMenuItems(isAdmin ? siteConfig.navMenuItems.admin : siteConfig.navMenuItems.user);
    }, [isAdmin]);

    const handleLogIn = () => {
        signInWithPopup(auth, googleAuthProvider)
            .then((result) => {
                result.user.getIdTokenResult(false)
                    .then(idTokenResult => {
                        console.log(idTokenResult.claims);
                        console.log(idTokenResult.claims['isAdmin']);
                        if (setUser && setIsAdmin && result.user) {
                            setUser(result.user);
                            setIsAdmin(idTokenResult.claims['isAdmin'] === true);
                        }
                    })
            })
            .catch((error) => {
                console.error(error);
            });
    };

    function handleLogOut() {
        auth.signOut().then(() => {
            if (setUser) {
                setUser(null);
                if (setIsAdmin) {
                    setIsAdmin(false);
                }
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    const accountElement = user && user.photoURL ? (
            <>
                <NavbarItem className="hidden sm:flex space-x-1">
                    <Button
                        className="text-sm font-normal text-default-600 bg-default-100"
                        variant="flat"
                        onClick={() => handleLogOut()}
                    >
                        Log out
                    </Button>
                </NavbarItem>
                <NavbarItem className="hidden sm:flex space-x-1">
                    <Link
                        href={"/profile"}
                        aria-label="Profile"
                        className="flex justify-center items-center gap-1"
                    >
                        <Image
                            width={32}
                            height={32}
                            src={user.photoURL}
                            alt="User profile picture"
                            className="rounded-full"
                        />
                    </Link>
                </NavbarItem>
            </>
        ) :
        <Button
            className="text-sm font-normal text-default-600 bg-default-100"
            variant="flat"
            onClick={() => handleLogIn()}
        >
            Log in
        </Button>;

    const localeAndAccount = <>
        <NavbarItem className="hidden sm:flex space-x-1">
            <Select
                aria-label="Select language"
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
        </NavbarItem>
        <NavbarItem className="hidden sm:flex space-x-1">
            {
                accountElement
            }
        </NavbarItem>
    </>;

    return (
        <NextUINavbar maxWidth="xl" position="sticky">
            {/* Left-aligned brand */}
            <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                <NavbarBrand as="li" className="gap-3 max-w-fit">
                    <NextLink className="flex justify-start items-center gap-1" href="/">
                        <Logo/>
                        <p className="font-bold text-inherit">
                            {siteConfig.name}
                        </p>
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
                                {
                                    <FormattedMessage id={item.label.id} defaultMessage={item.label.defaultMessage}/>
                                }
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
                {localeAndAccount}
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
                <NavbarMenuItem>
                    <Select
                        aria-label="Select language"
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
                </NavbarMenuItem>
                <div className="mx-4 mt-2 flex flex-col gap-2">
                    {navMenuItems.map((item, index) => (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link color="primary" href={item.href} size="lg">
                                <FormattedMessage id={item.label.id} defaultMessage={item.label.defaultMessage}/>
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </div>
            </NavbarMenu>
        </NextUINavbar>
    );
};
