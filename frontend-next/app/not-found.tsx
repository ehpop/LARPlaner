"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { FormattedMessage } from "react-intl";

export default function NotFound() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    isMounted && (
      <div className="flex flex-col w-full space-y-1 items-center">
        <FormattedMessage
          defaultMessage="Page not found"
          id="notfound.message"
          tagName="h1"
        />
        <div>
          <Button onClick={router.back}>
            <FormattedMessage defaultMessage="Go back" id="notfound.back" />
          </Button>
        </div>
      </div>
    )
  );
}
