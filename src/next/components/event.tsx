type EventPublicDisplayProps = {
  event: {
    title: string;
    eventDateString: string;
    eventTimeString: string;
    location?: string | null;
    publicDescription?: string | null;
  };
  index: number;
};

export const EventPublicDisplay: React.FC<EventPublicDisplayProps> = ({ event, index }) => {
  return (
    <div key={`event-public-display-${index}`} className="flex flex-col w-full">
      <div className="flex justify-between space-x-10 items-start mb-4">
        <div className="text-left">
          <p className="text-lg font-bold">{event.title}</p>
          <p>{event.location}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">{event.eventDateString}</p>
          <p className="font-semibold">{event.eventTimeString} Uhr</p>
        </div>
      </div>
      <p className="text-gray-700">{event.publicDescription}</p>
    </div>
  );
};
