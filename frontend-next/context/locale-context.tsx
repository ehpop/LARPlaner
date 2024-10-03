import { createContext, SetStateAction } from "react";

interface ILocaleContext {
  locale: string;
  setLocale: (value: SetStateAction<string>) => void;
}

export const LocaleContext = createContext<ILocaleContext>({
  locale: "",
  setLocale: () => {},
});
