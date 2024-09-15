import React from "react";

export default function RoleIdPageLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <div>{children}</div>
        </section>
    );
}
