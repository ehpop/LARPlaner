"use client";

import { useContext, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Spinner } from "@nextui-org/react";
import { FormattedMessage } from "react-intl";

import { FirebaseContext } from "@/context/firebase-context";

const ProtectedRoute = ({ children, adminOnly }: any) => {
  const { loading, user, isAdmin } = useContext(FirebaseContext);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div />;
  }

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner color="primary" label="Loading..." />
      </div>
    );
  }

  if (!user) {
    redirect("/login");
  } else {
    if (adminOnly && !isAdmin) {
      return (
        <div className="w-full h-96 flex justify-center items-center">
          <h1 className="text-2xl">
            <FormattedMessage
              defaultMessage="You do not have access to this page."
              id="protected-route.no-access"
            />
          </h1>
        </div>
      );
    }
  }

  return <div>{children}</div>;
};

export default ProtectedRoute;
