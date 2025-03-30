"use client";

import * as React from "react";
import { useContext } from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { ToastProvider } from "@heroui/toast";

import { LocaleContext } from "@/context/locale-context";
import LocaleProvider from "@/providers/locale-provider";
import FirebaseProvider from "@/providers/firebase-provider";
import ReactQueryProvider from "@/providers/react-query-provider";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const locale = useContext(LocaleContext);

  return (
    <HeroUIProvider navigate={router.push}>
      <ToastProvider />
      <NextThemesProvider {...themeProps}>
        <LocaleProvider locale={locale}>
          <FirebaseProvider>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </FirebaseProvider>
        </LocaleProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
