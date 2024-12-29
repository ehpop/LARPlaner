import React from "react";

import ProtectedRoute from "@/components/security/protected-route";

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
