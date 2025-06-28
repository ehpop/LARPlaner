import { Button, Input, Textarea, useDisclosure } from "@heroui/react";
import { useState } from "react";
import { Control, Controller, useFieldArray, useWatch } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { QrModal } from "@/components/general/qr-modal";
import ActionsListForm from "@/components/scenarios/actions-list-form";
import { emptyScenarioItem } from "@/services/mock/mock-data";
import { IScenario } from "@/types/scenario.types";

interface ItemFormProps {
  control: Control<IScenario>;
  index: number;
  remove: (index: number) => void;
  isBeingEdited: boolean;
}

interface ScenarioItemsFormProps {
  control: Control<IScenario>;
  isBeingEdited?: boolean;
}

const ItemForm = ({ control, index, remove, isBeingEdited }: ItemFormProps) => {
  const intl = useIntl();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [showItem, setShowItem] = useState(true);
  const [showItemActions, setShowItemActions] = useState(true);

  const itemData = useWatch({
    control,
    name: `items.${index}`,
  });

  return (
    <div className="w-full flex flex-col border-1 space-y-3 p-3 dark:bg-custom-dark-gradient bg-custom-light-gradient">
      <div className="w-full flex flex-row justify-between items-baseline">
        <Controller
          control={control}
          name={`items.${index}.name`}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              isRequired
              className="w-1/2"
              errorMessage={fieldState.error?.message}
              isDisabled={!isBeingEdited}
              isInvalid={!!fieldState.error}
              label={intl.formatMessage({
                defaultMessage: "Item name",
                id: "scenarios.new.page.itemName",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Enter item name",
                id: "scenarios.new.page.itemNamePlaceholder",
              })}
              size="sm"
              variant="underlined"
            />
          )}
          rules={{
            required: intl.formatMessage({
              defaultMessage: "Name is required",
              id: "scenarios.new.page.itemName.required",
            }),
          }}
        />
        <div className="flex flex-row lg:space-x-2 space-x-1">
          {isBeingEdited && (
            <Button
              color="danger"
              size="sm"
              variant="bordered"
              onPress={() => remove(index)}
            >
              <FormattedMessage
                defaultMessage="Remove"
                id="scenarios.new.page.removeItemButton"
              />
            </Button>
          )}
          <Button
            color="primary"
            isDisabled={!itemData?.name || !itemData?.id}
            size="sm"
            variant="bordered"
            onPress={onOpen}
          >
            <FormattedMessage
              defaultMessage="QR Code"
              id="scenarios.new.page.qrCodeButton"
            />
          </Button>
          <Button
            size="sm"
            variant="bordered"
            onPress={() => setShowItem(!showItem)}
          >
            {showItem ? "-" : "+"}
          </Button>
        </div>
      </div>
      {showItem && (
        <div className="space-y-3">
          <Controller
            control={control}
            name={`items.${index}.description`}
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                isRequired
                className="w-full"
                errorMessage={fieldState.error?.message}
                isDisabled={!isBeingEdited}
                isInvalid={!!fieldState.error}
                label={intl.formatMessage({
                  defaultMessage: "Item description",
                  id: "scenarios.new.page.itemDescription",
                })}
                placeholder={intl.formatMessage({
                  defaultMessage: "Enter item description",
                  id: "scenarios.new.page.insertItemDescription",
                })}
                size="sm"
                variant="underlined"
              />
            )}
            rules={{
              required: intl.formatMessage({
                defaultMessage: "Description is required",
                id: "scenarios.new.page.itemDescription.required",
              }),
            }}
          />
          <div className="w-full border-1 p-3 space-y-3">
            <div className="w-full flex flex-row justify-between">
              <p className="text-xl">
                <FormattedMessage
                  defaultMessage="Actions in item:"
                  id="scenarios.new.page.itemActions"
                />
              </p>
              <Button
                size="sm"
                variant="bordered"
                onPress={() => setShowItemActions(!showItemActions)}
              >
                {showItemActions ? "-" : "+"}
              </Button>
            </div>
            {showItemActions && (
              <ActionsListForm
                basePath={`items.${index}.actions`}
                control={control}
                isBeingEdited={isBeingEdited}
              />
            )}
          </div>
        </div>
      )}
      <QrModal
        isOpen={isOpen}
        modalTitle={
          intl.formatMessage({
            defaultMessage: "QR Code for item: ",
            id: "scenarios.new.page.qrCodeModalTitle",
          }) + itemData?.name
        }
        qrCodeData={itemData?.id || ""}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};

const ScenarioItemsForm = ({
  control,
  isBeingEdited,
}: ScenarioItemsFormProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const addItem = () => {
    append({ ...emptyScenarioItem });
  };

  return (
    <div className="w-full space-y-3 overflow-y-auto">
      {fields.length === 0 ? (
        <div className="w-full flex justify-center">
          <p>
            <FormattedMessage
              defaultMessage={"No items in scenario"}
              id={"scenarios.id.page.noItemsInScenario"}
            />
          </p>
        </div>
      ) : (
        fields.map((field, index) => (
          <ItemForm
            key={field.id}
            control={control}
            index={index}
            isBeingEdited={isBeingEdited || false}
            remove={remove}
          />
        ))
      )}
      {isBeingEdited && (
        <div className="w-full flex justify-center pt-3">
          <Button color="success" variant="solid" onPress={addItem}>
            <FormattedMessage
              defaultMessage={"Add item"}
              id={"scenarios.id.page.addItemButton"}
            />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScenarioItemsForm;
