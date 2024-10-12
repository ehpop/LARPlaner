"use client";

import { useEffect } from "react";
import { Button } from "@nextui-org/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {}, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <Button onPress={() => reset()}>Try again</Button>
    </div>
  );
}
