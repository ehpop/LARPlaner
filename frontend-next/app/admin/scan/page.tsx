"use client";

import { useZxing } from "react-zxing";
import { useState } from "react";

import { title } from "@/components/primitives";

export default function ScanPage() {
  const [data, setData] = useState("No result");
  const { ref } = useZxing({
    onDecodeResult(result) {
      setData(result.getText());
    }
  });

  return (
    <div className="w-full flex-row space-y-3">
      <h1 className={title()}>Scan</h1>
      <div>
        <h2>QR Code Scanner</h2>
        <video ref={ref}>
          <track kind="captions" />
        </video>

        <p>
          <span>Last result:</span>
          <span>{data}</span>
        </p>
      </div>
    </div>
  );
}
