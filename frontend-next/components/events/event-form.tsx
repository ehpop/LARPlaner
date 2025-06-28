"use client";

import { Link } from "@heroui/link";
import {
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import {
  getLocalTimeZone,
  today,
  ZonedDateTime,
} from "@internationalized/date";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { ButtonPanel } from "@/components/buttons/button-pannel";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import EventAssignRolesForm from "@/components/events/event-assign-roles-form";
import LoadingOverlay from "@/components/general/loading-overlay";
import eventsService from "@/services/events.service";
import { emptyEvent } from "@/services/mock/mock-data";
import scenariosService from "@/services/scenarios.service";
import { IEvent } from "@/types/event.types";
import { IScenario } from "@/types/scenario.types";
import { isValidEventDate, setTimeOnDate } from "@/utils/date-time";
import {
  showErrorToastWithTimeout,
  showSuccessToastWithTimeout,
} from "@/utils/toast";

export default function EventForm({ initialEvent }: { initialEvent?: IEvent }) {
  const intl = useIntl();
  const router = useRouter();
  const isNewEvent = !initialEvent;

  const [selectedScenario, setSelectedScenario] = useState<
    IScenario | undefined
  >(undefined);
  const [isBeingEdited, setIsBeingEdited] = useState(isNewEvent);
  const [showAssignRoles, setShowAssignRoles] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allScenarios, setAllScenarios] = useState<IScenario[]>([]);
  const [lastSavedEvent, setLastSavedEvent] = useState(initialEvent);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty },
  } = useForm<IEvent>({
    defaultValues: lastSavedEvent || emptyEvent,
  });

  const watchedName = watch("name");
  const watchedScenarioId = watch("scenarioId");

  useEffect(() => {
    setIsLoading(true);
    scenariosService
      .getAll()
      .then((res) => {
        if (res.success) {
          setAllScenarios(res.data);
          if (watchedScenarioId) {
            const foundScenario = res.data.find(
              (s) => s.id === watchedScenarioId,
            );

            setSelectedScenario(foundScenario);
          }
        }
      })
      .catch((error) => showErrorToastWithTimeout(error))
      .finally(() => setIsLoading(false));
  }, []);

  const onSubmit = (data: IEvent) => {
    setIsSaving(true);
    const serviceCall = isNewEvent
      ? eventsService.save(data)
      : eventsService.update(data.id!, data);

    serviceCall
      .then((res) => {
        if (res.success) {
          showSuccessToastWithTimeout("Event saved successfully");
          if (isNewEvent) {
            router.push("/admin/events");
          } else {
            setIsBeingEdited(false);
            reset(res.data);
            setLastSavedEvent(res.data);
          }
        } else {
          showErrorToastWithTimeout(res.data);
        }
      })
      .catch((error) => showErrorToastWithTimeout(error))
      .finally(() => setIsSaving(false));
  };

  const handleConfirmCancel = () => {
    reset(lastSavedEvent);
    setIsBeingEdited(false);
  };

  const handleConfirmDelete = () => {
    if (!lastSavedEvent?.id) return;
    setIsDeleting(true);
    eventsService
      .delete(lastSavedEvent.id)
      .then((response) => {
        if (response.success) {
          showSuccessToastWithTimeout("Event deleted successfully");
          router.push("/admin/events");
        } else {
          showErrorToastWithTimeout(response.data);
        }
      })
      .catch((error) => showErrorToastWithTimeout(error))
      .finally(() => setIsDeleting(false));
  };

  const {
    onOpen: onOpenDelete,
    isOpen: isOpenDelete,
    onOpenChange: onOpenChangeDelete,
  } = useDisclosure();
  const {
    onOpen: onOpenCancel,
    isOpen: isOpenCancel,
    onOpenChange: onOpenChangeCancel,
  } = useDisclosure();

  const form = (
    <form
      className="w-full flex justify-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="sm:w-4/5 w-full space-y-3 border-1 p-3">
        <div className="w-full flex justify-center">
          <p className="text-3xl" id="view-event-modal">
            {isNewEvent ? (
              <FormattedMessage
                defaultMessage="Add Event"
                id="event.form.title.add.new"
              />
            ) : (
              <FormattedMessage
                defaultMessage='Event "{eventName}"'
                id="event.form.title.edit"
                values={{ eventName: watchedName }}
              />
            )}
          </p>
        </div>

        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              isRequired
              errorMessage={fieldState.error?.message}
              isDisabled={!isBeingEdited}
              isInvalid={!!fieldState.error}
              label={intl.formatMessage({
                defaultMessage: "Name",
                id: "events.page.display.name",
              })}
              size="lg"
              variant="underlined"
            />
          )}
          rules={{ required: "Name cannot be empty" }}
        />

        <Controller
          control={control}
          name="date"
          render={({ field, fieldState }) => {
            const handleDateChange = (datePart: ZonedDateTime | null) => {
              if (!datePart) return;
              const newDateTime = field.value.set({
                year: datePart.year,
                month: datePart.month,
                day: datePart.day,
              });

              field.onChange(newDateTime);
            };

            const handleTimeChange = (
              e: React.ChangeEvent<HTMLInputElement>,
            ) => {
              const newDateTime = setTimeOnDate(field.value, e.target.value);

              field.onChange(newDateTime);
            };

            return (
              <div className="w-full flex justify-between space-x-3">
                <DatePicker
                  className="w-1/2"
                  errorMessage={fieldState.error?.message}
                  granularity="day"
                  isDisabled={!isBeingEdited}
                  isInvalid={!!fieldState.error}
                  label={intl.formatMessage({
                    defaultMessage: "Date of the event",
                    id: "events.page.display.date",
                  })}
                  minValue={today(getLocalTimeZone())}
                  size="lg"
                  value={field.value}
                  variant="underlined"
                  onChange={handleDateChange}
                />
                <Input
                  className="w-1/2"
                  isDisabled={!isBeingEdited}
                  isInvalid={!!fieldState.error}
                  label={intl.formatMessage({
                    defaultMessage: "Time of the event",
                    id: "events.page.display.time",
                  })}
                  size="lg"
                  type="time"
                  value={`${String(field.value.hour).padStart(2, "0")}:${String(field.value.minute).padStart(2, "0")}`}
                  variant="underlined"
                  onChange={handleTimeChange}
                />
              </div>
            );
          }}
          rules={{
            validate: (date) =>
              isValidEventDate(date) || "Date and time must be in the future",
          }}
        />

        <Controller
          control={control}
          name="description"
          render={({ field, fieldState }) => (
            <Textarea
              {...field}
              isRequired
              errorMessage={fieldState.error?.message}
              isDisabled={!isBeingEdited}
              isInvalid={!!fieldState.error}
              label={intl.formatMessage({
                defaultMessage: "Description",
                id: "events.page.display.description",
              })}
              size="lg"
              variant="underlined"
            />
          )}
          rules={{
            required: intl.formatMessage({
              defaultMessage: "Description cannot be empty",
              id: "events.page.display.description.required",
            }),
          }}
        />

        <div className="w-full flex flex-row items-baseline space-x-3">
          <Controller
            control={control}
            name="scenarioId"
            render={({ field, fieldState }) => (
              <Select
                isRequired
                errorMessage={fieldState.error?.message}
                isDisabled={!isBeingEdited}
                isInvalid={!!fieldState.error}
                label={intl.formatMessage({
                  defaultMessage: "Scenario",
                  id: "events.page.display.scenario",
                })}
                placeholder={intl.formatMessage({
                  defaultMessage: "Select scenario",
                  id: "events.page.display.selectScenario",
                })}
                selectedKeys={field.value ? [field.value] : []}
                size="lg"
                variant="underlined"
                onSelectionChange={async (key) => {
                  if (!key) return;
                  const scenarioId = key.anchorKey;

                  field.onChange(scenarioId);

                  const scenario = allScenarios.find(
                    (s) => s.id === scenarioId,
                  );

                  if (scenario) {
                    setSelectedScenario(scenario);
                    setValue(
                      "assignedRoles",
                      scenario.roles.map((role) => ({
                        scenarioRoleId: role.id as string,
                        assignedEmail: "",
                      })),
                      { shouldValidate: true },
                    );
                  }
                }}
              >
                {allScenarios.map((s) => (
                  <SelectItem key={s.id!}>{s.name}</SelectItem>
                ))}
              </Select>
            )}
            rules={{
              required: intl.formatMessage({
                defaultMessage: "Scenario cannot be empty",
                id: "events.page.display.scenario.required",
              }),
            }}
          />
          <div className="flex flex-row sm:space-x-3 space-x-1">
            <Button
              as={Link}
              color="success"
              href={"/admin/scenarios/new"}
              isDisabled={!isBeingEdited}
            >
              New
            </Button>
            <Button
              as={Link}
              color="warning"
              href={`/admin/scenarios/${watchedScenarioId}`}
              isDisabled={!isBeingEdited || !watchedScenarioId}
            >
              Edit
            </Button>
          </div>
        </div>

        <div className="w-full flex flex-col p-3 border-1">
          <div className="w-full flex flex-row justify-between">
            <p className="text-xl">
              {intl.formatMessage({
                defaultMessage: "Assign roles",
                id: "events.page.display.assignRoles",
              })}
            </p>
            <Button
              size="sm"
              variant="bordered"
              onPress={() => setShowAssignRoles(!showAssignRoles)}
            >
              {showAssignRoles ? "-" : "+"}
            </Button>
          </div>
          {showAssignRoles && (
            <EventAssignRolesForm
              control={control}
              isBeingEdited={isBeingEdited}
              scenario={selectedScenario}
            />
          )}
        </div>

        {isNewEvent ? (
          <div className="w-full flex justify-end">
            <Button
              color="success"
              isLoading={isSaving}
              size="lg"
              type="submit"
            >
              {intl.formatMessage({
                defaultMessage: "Save",
                id: "events.page.display.save",
              })}
            </Button>
          </div>
        ) : (
          <div className="w-full flex justify-end">
            <ButtonPanel
              isBeingEdited={isBeingEdited}
              isSaveButtonTypeSubmit={true}
              isSaveDisabled={!isDirty || isSaving}
              onCancelEditClicked={onOpenCancel}
              onDeleteClicked={onOpenDelete}
              onEditClicked={() => setIsBeingEdited(true)}
            />
          </div>
        )}
      </div>
    </form>
  );

  return (
    <LoadingOverlay
      isLoading={isSaving || isDeleting || isLoading}
      label={isSaving ? "Saving event..." : "Deleting event..."}
    >
      {form}
      <ConfirmActionModal
        handleOnConfirm={handleConfirmDelete}
        isOpen={isOpenDelete}
        prompt={intl.formatMessage({
          defaultMessage: "Are you sure you want to delete this event?",
          id: "events.id.page.delete",
        })}
        title={intl.formatMessage({
          defaultMessage: "Delete event",
          id: "events.id.page.deleteTitle",
        })}
        onOpenChange={onOpenChangeDelete}
      />
      <ConfirmActionModal
        handleOnConfirm={handleConfirmCancel}
        isOpen={isOpenCancel}
        prompt={intl.formatMessage({
          defaultMessage: "Are you sure you want to cancel editing this event?",
          id: "events.id.page.cancelEdit",
        })}
        title={intl.formatMessage({
          defaultMessage: "Cancel editing event",
          id: "events.id.page.cancelEditTitle",
        })}
        onOpenChange={onOpenChangeCancel}
      />
    </LoadingOverlay>
  );
}
