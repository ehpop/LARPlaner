import { ReactNode, useEffect, useState } from "react";
import { IntlProvider } from "react-intl";

import { locales } from "@/lang/i18n/i18n-config";
import { LocaleContext } from "@/context/locale-context"; // Your existing context file

const defaultLocale = "en";
const supportedLocales = new Set(Object.keys(locales));

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState(defaultLocale);

  useEffect(() => {
    const storedLocale = localStorage.getItem("locale");

    if (storedLocale && supportedLocales.has(storedLocale)) {
      setLocale(storedLocale);
    } else {
      const browserLocale = navigator.language.split("-")[0]; // 'en-US' -> 'en'

      if (supportedLocales.has(browserLocale)) {
        setLocale(browserLocale);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <IntlProvider
        defaultLocale={defaultLocale}
        locale={locale}
        messages={locales[locale]?.messages}
      >
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
};
