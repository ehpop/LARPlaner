import React from "react";

export default function RolesPageLayout({children,}: { children: React.ReactNode; }) {
    return (
        <section>
            <div>
                {children}
            </div>
        </section>
    );
}
