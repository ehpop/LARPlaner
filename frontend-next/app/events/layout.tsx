import React from "react";

export default function EventsLayout({children,}: { children: React.ReactNode; }) {
    return (
        <section className="flex flex-col items-center justify-center">
            <div className="inline-block text-center justify-center">
                {children}
            </div>
        </section>
    );
}
