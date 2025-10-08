type EventPublicDisplayProps = {
  event: {
    concertTitle?: string | null;
    concertDateString: string;
    concertTimeString: string;
    concertLocation?: string | null;
    concertDescription?: string | null;
  };
  index: number;
};

export const EventPublicDisplay: React.FC<EventPublicDisplayProps> = ({ event, index }) => {
  return (
    <div key={`event-public-display-${index}`} className="flex flex-col w-full">
      <div className="flex justify-between space-x-10 items-start mb-4">
        <div className="text-left">
          <p className="text-lg font-bold">{event.concertTitle}</p>
          <p>{event.concertLocation}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">{event.concertDateString}</p>
          <p className="font-semibold">{event.concertTimeString} Uhr</p>
        </div>
      </div>
      <p className="text-gray-700">{event.concertDescription}</p>
    </div>
  );
};
