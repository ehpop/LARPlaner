import React from "react";

export default function EventsLayout({
                                       children
                                     }: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div>{children}</div>
    </section>
  );
}
