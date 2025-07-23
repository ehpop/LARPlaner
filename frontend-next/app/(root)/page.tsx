"use client";

import { FormattedMessage } from "react-intl";
import { Button } from "@heroui/button";

import { useAuth } from "@/providers/firebase-provider";

const Page = () => {
  const auth = useAuth();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
      <FormattedMessage defaultMessage="Home page" id="home.message" />
      <Button
        className="mt-5"
        onPress={() => {
          auth.user?.getIdTokenResult().then((res) => console.log(res));
        }}
      >
        Generate JWT token
      </Button>
    </div>
  );
};

export default Page;
