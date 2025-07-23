"use client";

import { createContext } from "react";
import { Auth, AuthProvider, User } from "@firebase/auth";

import { auth } from "@/config/firebase";

export interface IFirebaseContext {
  auth: Auth;
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  handleLogIn: (
    authProvider: AuthProvider,
    email?: string,
    password?: string,
  ) => Promise<void>;
  handleLogOut: () => Promise<void>;
}

export const FirebaseContext = createContext<IFirebaseContext>({
  auth,
  user: null,
  setUser: () => {},
  loading: false,
  isAdmin: false,
  setIsAdmin: () => {},
  handleLogIn: async () => {},
  handleLogOut: async () => {},
});
