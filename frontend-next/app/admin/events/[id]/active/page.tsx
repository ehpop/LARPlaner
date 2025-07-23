"use client";

import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "@heroui/link";
import { Button, Card, CardFooter, useDisclosure } from "@heroui/react";
import { CardBody, CardHeader } from "@heroui/card";
import React from "react";
import { useRouter } from "next/navigation";

import { IEvent } from "@/types/event.types";
import { IScenario } from "@/types/scenario.types";
import eventsService from "@/services/events.service";
import {
  showErrorToastWithTimeout,
  showSuccessToastWithTimeout,
} from "@/utils/toast";
import ConfirmActionModal from "@/components/buttons/confirm-action-modal";
import EventPageWrapper from "@/components/events/wrapper/event-page-wrapper";

const ActiveEventAdminPage = ({ params }: any) => {
  const intl = useIntl();
  const router = useRouter();

  return (
    <EventPageWrapper expectedStatus="active" params={params}>
      {({ event, scenario }) => {
        const handleArchiveEvent = () => {
          if (!event) {
            return;
          }

          eventsService
            .updateEventStatus(event.id, "historic")
            .then((res) => {
              if (res.success) {
                showSuccessToastWithTimeout(
                  intl.formatMessage({
                    id: "components.events.events-display-admin.successfully-transitioned-to-historic",
                    defaultMessage: "Event status changed to: HISTORIC",
                  }),
                );

                router.push(`/admin/events/${event.id}/historic`);
              } else {
                showErrorToastWithTimeout(res.data);
              }
            })
            .catch((error) => showErrorToastWithTimeout(error));
        };

        return (
          <ActiveEventAdminDisplay
            event={event}
            scenario={scenario}
            onArchiveEvent={handleArchiveEvent}
          />
        );
      }}
    </EventPageWrapper>
  );
};

const ActiveEventAdminDisplay = ({
  event,
  scenario,
  onArchiveEvent,
}: {
  event: IEvent;
  scenario: IScenario;
  onArchiveEvent: () => void;
}) => {
  const intl = useIntl();

  const {
    onOpen: onOpenArchive,
    isOpen: isOpenArchive,
    onOpenChange: onOpenArchiveChange,
  } = useDisclosure();

  return (
    <div className="w-full flex flex-col items-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="w-full flex flex-row justify-between">
            <p>
              <FormattedMessage
                defaultMessage="Event: {eventName}"
                id="admin.events.id.active.page.eventName"
                values={{ eventName: event.name }}
              />
            </p>
            <div className="flex flex-row space-x-1">
              <p>
                <FormattedMessage
                  defaultMessage="Status: "
                  id="events.id.active.status"
                />
              </p>
              <p className="text-success">{event.status}</p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="w-full items-center space-y-5">
          <div className="w-3/5 flex flex-row justify-between items-center">
            <p className="text-xl">{event.name}</p>
            <Link href={`/admin/events/${event.id}`}>
              <Button variant="bordered">
                <FormattedMessage
                  defaultMessage="Display event"
                  id="admin.events.id.active.page.displayEvent"
                />
              </Button>
            </Link>
          </div>
          <div className="w-3/5 flex flex-row justify-between items-center">
            <p className="text-xl">{scenario.name}</p>
            <Link href={`/admin/scenarios/${scenario.id}`}>
              <Button variant="bordered">
                <FormattedMessage
                  defaultMessage="Display scenario"
                  id="admin.events.id.active.page.displayScenario"
                />
              </Button>
            </Link>
          </div>
          <div className="w-3/5 flex flex-row justify-between items-center">
            <p className="text-xl">
              <FormattedMessage
                defaultMessage="Characters in game:"
                id="admin.events.id.active.page.charactersInGame"
              />
            </p>
            <p className="text-xl">{scenario.roles.length}</p>
          </div>
        </CardBody>
        <CardFooter className="mt-5 flex flex-row justify-between">
          <Button
            color="danger"
            variant="bordered"
            onPress={() => onOpenArchive()}
          >
            <FormattedMessage
              defaultMessage="Archive event"
              id="admin.events.id.active.page.archiveEvent"
            />
          </Button>
          <div className="flex flex-row space-x-1">
            <Link href={`/admin/game/${event.gameSessionId}`}>
              <Button color="primary" variant="bordered">
                <FormattedMessage
                  defaultMessage="Go to game page"
                  id="admin.events.id.active.page.goToGame"
                />
              </Button>
            </Link>
            <Link href={`/admin/events/${event.id}/active/chats`}>
              <Button variant="bordered">
                <FormattedMessage
                  defaultMessage="Go to chats"
                  id="admin.events.id.active.page.chats"
                />
              </Button>
            </Link>
          </div>
        </CardFooter>
        <ConfirmActionModal
          handleOnConfirm={() => onArchiveEvent()}
          isOpen={isOpenArchive}
          prompt={intl.formatMessage({
            defaultMessage:
              "Are you sure you want to archive this event? This action will stop the game and it can not be reversed.",
            id: "admin.events.id.active.page.archiveEvent.prompt",
          })}
          title={intl.formatMessage({
            defaultMessage: "Archive active event",
            id: "admin.events.id.active.page.archiveEvent.title",
          })}
          onOpenChange={onOpenArchiveChange}
        />
      </Card>
    </div>
  );
};

export default ActiveEventAdminPage;
