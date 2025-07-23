import React, { useState } from "react";
import { Button } from "@heroui/react";

const HidableSection = ({
  titleElement,
  additionalButtons,
  section,
}: {
  titleElement: React.ReactNode;
  additionalButtons?: React.ReactNode;
  section: React.ReactNode;
}) => {
  const [showSection, setShowSection] = useState(true);

  return (
    <>
      <div className="w-full flex flex-row justify-between items-baseline">
        {titleElement}
        <div className="flex flex-row lg:space-x-2 space-x-1">
          <Button
            color="default"
            size="sm"
            variant="bordered"
            onPress={() => setShowSection(!showSection)}
          >
            {showSection ? "-" : "+"}
          </Button>
          {additionalButtons}
        </div>
      </div>
      <div className={showSection ? "" : "hidden"}>{section}</div>
    </>
  );
};

export default HidableSection;
