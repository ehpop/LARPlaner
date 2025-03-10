import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { FormattedMessage } from "react-intl";

const ConfirmActionModal = ({
  title,
  prompt,
  handleOnConfirm,
  isOpen,
  onOpenChange,
}: {
  title: string;
  prompt: string;
  handleOnConfirm: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) => {
  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              <p>{prompt}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                <FormattedMessage
                  defaultMessage={"Cancel"}
                  id={"general.cancel"}
                />
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  onClose();
                  handleOnConfirm();
                }}
              >
                <FormattedMessage
                  defaultMessage={"Confirm"}
                  id={"general.confirm"}
                />
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmActionModal;
