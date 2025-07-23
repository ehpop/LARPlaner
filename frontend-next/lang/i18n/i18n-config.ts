import enMessages from "../en-US.json";
import plMessages from "../pl.json";

export const defaultLocale = "en-US";

export interface ILocale {
  name: string;
  messages: {
    [key: string]: string;
  };
}

export const locales: { [key: string]: ILocale } = {
  en: {
    name: "English",
    messages: enMessages,
  },
  pl: {
    name: "Polski",
    messages: plMessages,
  },
};
