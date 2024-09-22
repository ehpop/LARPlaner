"use client";

import {createContext} from "react";
import {auth} from "@/config/firebase";
import {Auth, User} from "@firebase/auth";

export interface IFirebaseContext {
    auth: Auth;
    user?: User | null;
    setUser?: (user: User | null) => void
    loading?: boolean;
    isAdmin?: boolean;
    setIsAdmin?: (isAdmin: boolean) => void
}

export const FirebaseContext = createContext<IFirebaseContext>({auth});
