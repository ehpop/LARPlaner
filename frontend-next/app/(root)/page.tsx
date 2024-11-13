"use client";

import { FormattedMessage } from "react-intl";
import { Button } from "@nextui-org/button";
import { toast } from "react-toastify";

const Page = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
      <FormattedMessage defaultMessage="Home page" id="home.message" />
      <Button
        onPress={() =>
          toast("Testowa wiadomosc", {
            type: "default",
          })
        }
      >
        Test toast
      </Button>
    </div>
  );
};

export default Page;
