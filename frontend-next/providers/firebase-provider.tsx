"use client";

import { useContext, useEffect, useState } from "react";
import {
  AuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from "@firebase/auth";
import { useRouter } from "next/navigation";

import { FirebaseContext } from "@/context/firebase-context";
import {
  auth,
  emailAuthProvider,
  githubAuthProvider,
  googleAuthProvider,
} from "@/config/firebase";

export default function FirebaseProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        user
          .getIdTokenResult(true)
          .then((idTokenResult) => {
            setIsAdmin(idTokenResult.claims["isAdmin"] === true);
          })
          .catch((_error) => {});
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogIn = (
    authProvider: AuthProvider,
    email?: string,
    password?: string,
  ) => {
    const signInWithAuthProvider = (authProvider: AuthProvider) => {
      signInWithPopup(auth, authProvider)
        .then((_result) => {
          router.push("/profile");
        })
        .catch((error) => {
          if (error.code === "auth/account-exists-with-different-credential") {
            throw new Error(
              "You have already signed up with a different method. Log in with that method to link your accounts.",
            );
          }
        });
    };

    const signInUserWithEmail = (email: string, password: string) => {
      signInWithEmailAndPassword(auth, email, password)
        .then((_userCredential) => {
          router.push("/profile");
        })
        .catch((_error) => {});
    };

    if (authProvider === emailAuthProvider && email && password) {
      signInUserWithEmail(email, password);
    }

    if (
      authProvider === googleAuthProvider ||
      authProvider === githubAuthProvider
    ) {
      signInWithAuthProvider(authProvider);
    }
  };

  function handleLogOut() {
    auth
      .signOut()
      .then(() => {
        setUser(null);
        setIsAdmin(false);
        router.push("/login");
      })
      .catch((_error) => {
        throw new Error("Error signing out");
      });
  }

  return (
    <FirebaseContext.Provider
      value={{
        auth,
        user,
        setUser,
        loading,
        isAdmin,
        setIsAdmin,
        handleLogIn,
        handleLogOut,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useAuth() {
  return useContext(FirebaseContext);
}
