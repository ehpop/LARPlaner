import { FormattedMessage, useIntl } from "react-intl";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import QRCode from "react-qr-code";
import React, { useState } from "react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";

import { sanitizeFilename } from "@/utils/sanitize";
import { showErrorToastWithTimeout } from "@/utils/toast";

export const QrModal = ({
  isOpen,
  onOpenChange,
  qrCodeData,
  modalTitle,
  savedFileName,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  qrCodeData: string;
  modalTitle?: string;
  savedFileName?: string;
}) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadPressed = async () => {
    setIsLoading(true);

    try {
      const element = document.getElementById(`generated-qr-code`);

      if (!element) {
        return;
      }

      const pngDataUrl = await toPng(element);
      const base64Data = pngDataUrl.split(",")[1];
      const filename = sanitizeFilename(
        savedFileName || `qr-code-${new Date().getTime()}.png`,
      );

      saveAs(pngDataUrl, filename);
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

  return (
    <Modal
      backdrop="opaque"
      isOpen={isOpen}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {modalTitle || ""}
            </ModalHeader>
            <ModalBody className="dark:bg-white">
              <div className="w-full flex justify-center">
                <QRCode id="generated-qr-code" value={qrCodeData} />
              </div>
            </ModalBody>
            <ModalFooter className="flex flex-row justify-between gap-2">
              <Button color="danger" variant="bordered" onPress={onClose}>
                <FormattedMessage defaultMessage="Close" id="common.close" />
              </Button>

              <Button
                color="default"
                isDisabled={isLoading}
                isLoading={isLoading}
                variant="bordered"
                onPress={() => handleDownloadPressed()}
              >
                <FormattedMessage
                  defaultMessage="Download"
                  id="common.download"
                />
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
