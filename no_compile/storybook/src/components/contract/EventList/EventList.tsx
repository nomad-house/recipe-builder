import { FC } from "react";
import { makeStyles } from "@material-ui/styles";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";

import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { EventDetails } from "./EventList.types";

const useStyles = makeStyles({
  container: {
    width: "100%",
    height: "100%",
    paddingLeft: "0.7rem",
    paddingRight: "0.7rem",
    paddingBottom: "0.7rem"
  },
  scrollable: {
    // overflowX: "hidden",
    // overflowY: "scroll"
  },
  listItem: {
    // paddingLeft: ".4rem",
    paddingRight: "1.4rem",
    marginBottom: "0.4rem"
  },
  accordionSummary: {
    minHeight: "2.4rem",
    maxWidth: "18rem",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  eventContainer: {
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  title: {
    marginLeft: "1.2rem",
    marginTop: "1.8rem",
    marginBottom: "0.2rem"
  },
  participantHeading: {
    paddingLeft: ".8rem",
    marginRight: ".3rem"
  },
  counterPartyHeading: {
    // paddingLeft: "0rem",
    marginRight: ".3rem"
  },
  ipfsEventHeading: {}
});

export interface EventListItemProps {
  event: EventDetails;
}

export const EventListItem: FC<EventListItemProps> = ({
  event: { participant, counterParty, ipfs, highlight }
}) => {
  const {
    participantHeading,
    counterPartyHeading,
    listItem,
    accordionSummary,
    eventContainer,
    ipfsEventHeading
  } = useStyles();

  function openAddress(address: string) {
    window.open(`https://rinkeby.etherscan.io/address/${address}`);
  }
  const ipfsLink = `https://infura-ipfs.io/ipfs/${ipfs.cid}`;
  //
  // use dedicated endpoint after demo so they can see that its
  // actually hosted on an independent IPFS node and its for real
  //
  // switch over after we blow their minds
  // window.open(`https://trusted-resources.ipfs.infura-ipfs.io/ipfs/${transaction.cid}`);

  return (
    <div className={listItem}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          style={{ backgroundColor: highlight ? "rgb(255,1,0, 0.1)" : "white" }}
          // color={highlight ? "background" : "primary"}
        >
          <div className={accordionSummary}>
            <div className={eventContainer}>
              <a onClick={() => openAddress(participant)}>
                <Typography noWrap variant="body2">
                  <strong className={participantHeading}>participant:</strong> {participant}
                </Typography>
              </a>
            </div>
            {counterParty && (
              <div>
                <a onClick={() => openAddress(counterParty)}>
                  <Typography noWrap variant="body2">
                    <strong className={counterPartyHeading}>counterParty:</strong> {counterParty}
                  </Typography>
                </a>
              </div>
            )}
          </div>
        </AccordionSummary>
        <AccordionDetails style={{ backgroundColor: highlight ? "rgb(255,1,0, 0.1)" : "white" }}>
          <div className={accordionSummary}>
            <div className={eventContainer}>
              <a
                href={ipfsLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Typography noWrap variant="body2">
                  <strong className={ipfsEventHeading}>ipfs cid:</strong> {ipfs.cid}
                </Typography>
              </a>
            </div>
            <div>{ipfs.body && <pre>{JSON.stringify(ipfs.body, null, 2)}</pre>}</div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export interface EventListProps {
  title?: string;
  events: EventDetails[];
}

export const EventList: FC<EventListProps> = ({ title = "Events", events }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography className={classes.title} variant="h5">
        {title}
      </Typography>
      <div className={classes.scrollable}>
        {!!events.length && events.map((event, key) => <EventListItem key={key} event={event} />)}
      </div>
    </div>
  );
};
