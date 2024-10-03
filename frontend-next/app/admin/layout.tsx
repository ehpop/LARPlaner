import React from "react";

import ProtectedRoute from "@/components/security/protected-route";

export default function EventsLayout({
                                       children
                                     }: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <ProtectedRoute adminOnly={true}>{children}</ProtectedRoute>
    </section>
  );
}
