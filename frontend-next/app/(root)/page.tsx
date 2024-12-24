"use client";

import { FormattedMessage } from "react-intl";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";

const Page = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
      <FormattedMessage defaultMessage="Home page" id="home.message" />
      <Button as={Link} href={"/events"}>
        Go to events
      </Button>
    </div>
  );
};

export default Page;
