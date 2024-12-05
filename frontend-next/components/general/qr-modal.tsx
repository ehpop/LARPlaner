import { useIntl } from "react-intl";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import QRCode from "react-qr-code";
import React from "react";

export const QrModal = ({
  isOpen,
  onOpenChange,
  itemName,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  itemName: string;
}) => {
  const intl = useIntl();

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
              {itemName}
            </ModalHeader>
            <ModalBody className="dark:bg-white">
              <div className="w-full flex justify-center">
                <QRCode value={itemName} />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="bordered" onPress={onClose}>
                {intl.formatMessage({
                  id: "common.close",
                  defaultMessage: "Close",
                })}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
