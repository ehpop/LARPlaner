import React from "react";

export default function RolesPageLayout({children,}: { children: React.ReactNode; }) {
    return (
        <section className="flex flex-col items-center justify-center">
            <div className="w-full inline-block justify-center">
                {children}
            </div>
        </section>
    )
}
