"use client";

import {QrReader} from "react-qr-reader";
import {useState} from "react";

import {title} from "@/components/primitives";

export default function ScanPage() {
    const [data, setData] = useState("No result");
    const [error, setError] = useState(null);

    const handleScan = (result: any) => {
        if (result) {
            setData(result.text);
        }
    };

    const handleError = (err: any) => {
        setError(err.message);
    };

    return (
        <div>
            <h1 className={title()}>Scan</h1>
            <div>
                <h2>QR Code Scanner</h2>
                <QrReader
                    constraints={{facingMode: "environment"}}
                    onResult={(result: any, error: any) => {
                        if (result) {
                            handleScan(result);
                        }

                        if (error) {
                            handleError(error);
                        }
                    }}
                />
                <p>Scanned Data: {data}</p>
                {error && <p style={{color: "red"}}>Error: {error}</p>}
            </div>
        </div>
    );
}
