"use client";

import {IntlProvider} from "react-intl";
import React, {useState} from "react";

import {defaultLocale, locales} from "@/lang/i18n/i18n-config";
import {LocaleContext} from "@/context/locale-context";

export default function LocaleProvider({children}: any) {
    const [locale, setLocale] = useState<string>(defaultLocale);

    return (
        <LocaleContext.Provider value={{locale, setLocale}}>
            <IntlProvider
                defaultLocale={defaultLocale}
                locale={locale}
                messages={locales[locale]?.messages}
            >
                {children}
            </IntlProvider>
        </LocaleContext.Provider>
    );
}
