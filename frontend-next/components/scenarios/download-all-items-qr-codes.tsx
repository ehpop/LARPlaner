import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "@heroui/react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import { IScenario } from "@/types/scenario.types";
import { showErrorToastWithTimeout } from "@/utils/toast";
import { sanitizeFilename } from "@/utils/sanitize";

interface DownloadAllItemsQrCodesProps {
  scenario: IScenario;
}

const DownloadAllItemsQrCodes = ({
  scenario,
}: DownloadAllItemsQrCodesProps) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Main handler to generate QR codes, zip them, and trigger a download.
   */
  const handleDownloadItems = async () => {
    if (scenario.items.some((item) => !item.id)) {
      showErrorToastWithTimeout(
        intl.formatMessage({
          id: "admin.events.id.upcoming.page.download.error.itemHasNoID",
          defaultMessage: "Some items do not have IDs and cannot be processed.",
        }),
      );

      return;
    }

    setIsLoading(true);

    try {
      const zip = new JSZip();

      const qrCodePromises = scenario.items
        .filter((item) => item.id)
        .map(async (item) => {
          const element = document.getElementById(
            `qr-code-for-download-${item.id}`,
          );

          if (!element) {
            return;
          }

          const pngDataUrl = await toPng(element);
          const base64Data = pngDataUrl.split(",")[1];
          const filename = sanitizeFilename(`item-${item.name}`);

          zip.file(`${filename}.png`, base64Data, { base64: true });
        });

      await Promise.all(qrCodePromises);

      const zipBlob = await zip.generateAsync({ type: "blob" });

      saveAs(zipBlob, sanitizeFilename(`scenario-${scenario.name}`));
    } catch (error) {
      showErrorToastWithTimeout(
        intl.formatMessage({
          id: "admin.events.id.upcoming.page.download.error.zipGenerationFailed",
          defaultMessage: "An error occurred while creating the zip file.",
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const hasItemsToDownload = scenario.items && scenario.items.length > 0;

  return (
    <>
      {/*
        This is the container for our QR codes. It's rendered off-screen so the user
        doesn't see it, but it's available in the DOM for our image conversion library.
      */}
      {hasItemsToDownload && (
        <div
          style={{ position: "absolute", left: "-9999px", top: 0, zIndex: -1 }}
        >
          {scenario.items
            .filter((item) => item.id)
            .map((item) => (
              <div
                key={item.id}
                id={`qr-code-for-download-${item.id}`}
                style={{ background: "white", padding: "16px" }}
              >
                <div className="flex flex-col">
                  <p className="text-2xl text-black mb-10">
                    <FormattedMessage
                      defaultMessage="Item: {itemName}"
                      id="admin.events.id.upcoming.page.download.QRTitle"
                      values={{ itemName: item.name }}
                    />
                  </p>
                  <QRCode size={256} value={item.id as string} />
                </div>
              </div>
            ))}
        </div>
      )}

      <Button
        color="primary"
        isDisabled={isLoading || !hasItemsToDownload}
        variant="bordered"
        onPress={handleDownloadItems}
      >
        {isLoading ? (
          <FormattedMessage
            defaultMessage="Generating..."
            id="admin.events.id.upcoming.page.download.loading"
          />
        ) : (
          <FormattedMessage
            defaultMessage="Download QR codes"
            id="admin.events.id.upcoming.page.download.QRcodes"
          />
        )}
      </Button>
    </>
  );
};

export default DownloadAllItemsQrCodes;
