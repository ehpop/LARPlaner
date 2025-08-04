"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { ToastProvider } from "@heroui/toast";

import FirebaseProvider from "@/providers/firebase-provider";
import ReactQueryProvider from "@/providers/react-query-provider";
import { LocaleProvider } from "@/providers/locale-provider";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <ToastProvider placement="top-right" />
      <NextThemesProvider {...themeProps}>
        <LocaleProvider>
          <FirebaseProvider>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </FirebaseProvider>
        </LocaleProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
