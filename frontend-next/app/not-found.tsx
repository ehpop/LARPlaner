"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    isMounted && (
      <div className="flex flex-col w-full space-y-1 items-center">
        <h1>Not found – 404!</h1>
        <div>
          <Link href="/">Go back to Home</Link>
        </div>
      </div>
    )
  );
}
