"use client";

import { useEffect } from "react";
import { Button } from "@nextui-org/button";
import { FormattedMessage } from "react-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {}, [error]);

  return (
    <div className="w-full flex flex-row justify-center">
      <h2>
        <FormattedMessage
          defaultMessage="Something went wrong!"
          id="common.error"
        />
      </h2>
      <Button onPress={() => reset()}>
        <FormattedMessage defaultMessage="Retry" id="common.retry" />
      </Button>
    </div>
  );
}
