"use client";

import { FormattedMessage } from "react-intl";

const Page = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <FormattedMessage defaultMessage="Home page" id="home.message" />
    </div>
  );
};

export default Page;
