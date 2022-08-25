import { FC } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import { EventDetails, web3Selectors } from "../state";
import { useSelector } from "react-redux";

interface EventListEventProps {
  event: EventDetails;
}
export const EventListEvent: FC<EventListEventProps> = ({ event }) => {
  const fileMeta = useSelector(web3Selectors.getIpfsFileByCid(event.cid));
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="h6">{event.cid}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="subtitle1">
          Participant: {event.participant}
          {event.counterParty && `Counter Party: ${event.counterParty}`}
        </Typography>
        {fileMeta?.body && <pre>{JSON.stringify(fileMeta, null, 2)}</pre>}
      </AccordionDetails>
    </Accordion>
  );
};

interface EventListProps {
  events: {
    [cid: string]: EventDetails;
  };
}
export const EventList: FC<EventListProps> = ({ events }) => {
  return (
    <div>
      {Object.values(events).map((event) => (
        <EventListEvent event={event} key={event.cid} />
      ))}
    </div>
  );
};
