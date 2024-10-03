import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { Link } from "@nextui-org/link";

interface EventProps {
  event: {
    id: string;
    title: string;
    date: string;
    img: string;
  };
}

export const Event = ({ event }: EventProps) => {
  return (
    <Link aria-label={`Event: ${event.title}`} href={`events/${event.id}`}>
      <Card key={event.id} shadow="sm">
        <CardBody className="overflow-visible p-0">
          <Image
            alt={event.title}
            className="object-cover h-[240px] w-[440px]"
            radius="lg"
            shadow="sm"
            src={event.img}
            width="100%"
          />
        </CardBody>
        <CardFooter className="text-small justify-between">
          <b>{event.title}</b>
          <p className="text-default-500">{event.date}</p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default Event;
