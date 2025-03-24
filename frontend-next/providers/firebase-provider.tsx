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
import { useIntl } from "react-intl";

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
  const intl = useIntl();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        user.getIdTokenResult(true).then((idTokenResult) => {
          setIsAdmin(idTokenResult.claims["isAdmin"] === true);
        });
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
          router.push("/user/profile");
        })
        .catch((error) => {
          if (error.code === "auth/account-exists-with-different-credential") {
            throw new Error(
              intl.formatMessage({
                id: "login.error.account-exists-with-different-credential",
                defaultMessage:
                  "You have already signed up with a different method. Log in with that method to link your accounts.",
              }),
            );
          }
        });
    };

    const signInUserWithEmail = (email: string, password: string) => {
      signInWithEmailAndPassword(auth, email, password)
        .then((_userCredential) => {
          router.push("/user/profile");
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

  const handleLogOut = async () => {
    auth.signOut().then(() => {
      // Preferred method should be to use router.push("/login") but it's causing
      // a bug in the app. Bad setState() is called somewhere in the app.
      document.location.href = "/login";
    });
  };

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
