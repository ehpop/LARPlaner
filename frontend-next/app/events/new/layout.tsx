import React from "react";

export default function EventsLayout({children,}: { children: React.ReactNode; }) {
    return (
        <section className="flex flex-col items-center">
            <div className="w-3/4 p-3 border-1">
                {children}
            </div>
        </section>
    );
}
