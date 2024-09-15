import {ReactNode} from "react";

export default function ScenarioIdLayout({
                                             children,
                                         }: {
    children: ReactNode;
}) {
    return (
        <section className="flex flex-col items-center justify-center">
            <div className="w-full inline-block justify-center">{children}</div>
        </section>
    );
}
