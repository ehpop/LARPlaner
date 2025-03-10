import { Button } from "@heroui/button";
import { FormattedMessage } from "react-intl";

export const ButtonPanel = ({
  isBeingEdited,
  onEditClicked,
  onCancelEditClicked,
  onDeleteClicked,
  onSaveClicked,
}: {
  isBeingEdited: boolean;
  onEditClicked: () => void;
  onCancelEditClicked: () => void;
  onDeleteClicked: () => void;
  onSaveClicked: () => void;
}) => {
  const editButtons = (
    <div className="flex space-x-3">
      <Button color="danger" size="lg" onPress={() => onCancelEditClicked()}>
        <FormattedMessage defaultMessage="Cancel" id="role.display.cancel" />
      </Button>
      <Button color="success" size="lg" onPress={() => onSaveClicked()}>
        <FormattedMessage defaultMessage="Save" id="role.display.save" />
      </Button>
    </div>
  );
  const controlButtons = (
    <div className="space-x-3">
      <Button
        color="danger"
        size="lg"
        onPress={() => {
          onDeleteClicked();
        }}
      >
        <FormattedMessage defaultMessage="Delete" id="role.display.delete" />
      </Button>
      <Button color="warning" size="lg" onPress={() => onEditClicked()}>
        <FormattedMessage defaultMessage="Edit" id="role.display.edit" />
      </Button>
    </div>
  );

  return isBeingEdited ? editButtons : controlButtons;
};
