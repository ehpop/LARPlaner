"use client";

import {auth} from "@/config/firebase";
import {FirebaseContext} from "@/context/firebase-context";
import {useContext, useEffect, useState} from "react";
import {onAuthStateChanged, User} from "@firebase/auth";

export default function FirebaseProvider({children}: any) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <FirebaseContext.Provider value={{auth, user, setUser, loading, isAdmin, setIsAdmin}}>
            {children}
        </FirebaseContext.Provider>
    );
}

export function useAuth() {
    return useContext(FirebaseContext);
}
