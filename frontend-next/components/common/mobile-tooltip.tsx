import { Tooltip } from "@heroui/react";
import { Button } from "@heroui/button";
import { ReactNode, useState } from "react";

/**
 * A React component that provides a tooltip functionality for mobile-friendly interactions.
 *
 * @param {Object} props - The props object for the MobileTooltip component.
 * @param {string} props.content - The content to display within the tooltip.
 * @param {ReactNode} props.children - The child element that triggers the tooltip on interaction.
 * @return {JSX.Element} A JSX element that renders a tooltip with interactive behavior.
 */
export default function MobileTooltip({
  content,
  children,
}: {
  content: string;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Tooltip content={content} isOpen={isOpen}>
      <Button
        // styling, so it doesn't visually interfere with the children.
        className="cursor-auto appearance-none bg-transparent border-none p-0 m-0 hover:bg-transparent"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onPress={() => setIsOpen((prev) => !prev)}
      >
        {children}
      </Button>
    </Tooltip>
  );
}
