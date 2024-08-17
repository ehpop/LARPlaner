import React from "react";

export default function EventsLayout({children,}: { children: React.ReactNode; }) {
    return (
        <section className="flex flex-col justify-center">
            <div className="w-full">
                {children}
            </div>
        </section>
    );
}
