import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { Link } from "@nextui-org/link";

import { IEvent } from "@/types/event.types";

interface EventProps {
  event: IEvent;
  link?: string;
}

export const Event = ({ event, link }: EventProps) => {
  const card = (
    <Card key={event.id} className="mx-3" shadow="sm">
      <CardBody className="p-0 h-[240px] w-[390px]">
        <Image
          alt={event.name}
          className="object-cover h-[240px] w-[400px]"
          fallbackSrc="/images/event-fallback.png"
          radius="lg"
          shadow="sm"
          src={event.img}
        />
      </CardBody>
      <CardFooter className="text-small justify-between">
        <b>{event.name}</b>
        <p className="text-default-500">{event.date.toDate().toDateString()}</p>
      </CardFooter>
    </Card>
  );

  return (
    <div className="flex w-full justify-center">
      {link ? <Link href={`${link}/${event.id}`}>{card}</Link> : card}
    </div>
  );
};

export default Event;
