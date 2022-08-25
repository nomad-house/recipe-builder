import { FC } from "react";
import { makeStyles } from "@material-ui/styles";

import { EventList } from "../EventList/EventList";
import { TransactionList } from "../TransactionList/TransactionList";
import { TransactionMeta } from "../TransactionList/TransactionList.types";
import { EventDetails } from "../EventList/EventList.types";

const useStyles = makeStyles({
  container: {
    backgroundColor: "rgb(246,249,252)"
    // height: "100%",
    // paddingRight: "0.7rem",
    // paddingBottom: "0.7rem"
  },
  trasnactionContainer: {
    // width: "100%"
    // maxWidth: "24rem",
    marginBottom: "1rem",
    maxHeight: "20rem"
    // overflowX: "hidden",
    // overflowY: "scroll"
  },
  eventContainer: {
    // width: "100%"
    // maxHeight: "20rem",
    // maxWidth: "26rem"
    // overflowX: "hidden",
    // overflowY: "scroll"
  }
});

export interface ContractMetaProps {
  transactions: TransactionMeta[];
  events: EventDetails[];
}

export const ContractMeta: FC<ContractMetaProps> = ({ events, transactions }) => {
  const { container, trasnactionContainer, eventContainer } = useStyles();
  return (
    <div className={container}>
      <div className={trasnactionContainer}>
        <TransactionList transactions={transactions} />
      </div>
      <div className={eventContainer}>
        <EventList events={events} />
      </div>
    </div>
  );
};
