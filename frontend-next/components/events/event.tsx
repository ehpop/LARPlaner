import { Card, CardBody, CardFooter, Image } from "@heroui/react";
import { Link } from "@heroui/link";

import { IEvent } from "@/types/event.types";

interface EventProps {
  event: IEvent;
}

export const Event = ({ event }: EventProps) => {
  const card = (
    <div className="w-full max-w-sm mx-auto flex flex-row">
      <Card key={event.id} className="mx-3" shadow="sm">
        <div className="relative w-full aspect-w-16 aspect-h-9">
          <CardBody className="p-0 h-full">
            {event.img && (
              <Image
                alt={event.name}
                className="object-cover h-full w-full"
                fallbackSrc="/images/event-fallback.png"
                radius="lg"
                shadow="sm"
                src={event.img}
              />
            )}
          </CardBody>
        </div>
        <CardFooter className="text-small justify-between">
          <b>{event.name}</b>
          <p className="text-default-500">
            {event.date.toDate().toDateString()}
          </p>
        </CardFooter>
      </Card>
    </div>
  );

  return <Link href={`events/${event.id}/${event.status}`}>{card}</Link>;
};

export default Event;
