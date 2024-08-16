"use client";

import { title } from "@/components/primitives";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function ScanPage() {
  return (
    <div>
      <h1 className={title()}>Scan</h1>
      <div style={{ width: "400px" }}>
        <Scanner onScan={(result) => console.log(result)} />
      </div>
    </div>
  );
}
