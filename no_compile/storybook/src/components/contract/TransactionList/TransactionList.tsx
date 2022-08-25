import { FC } from "react";
import { makeStyles } from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { TransactionMeta } from "./TransactionList.types";

const useStyles = makeStyles({
  root: {
    "& a": {
      "a:link": { textDecoration: "none" },
      "a:visited": { textDecoration: "none" },
      "a:hover": { textDecoration: "none" },
      "a:active": { textDecoration: "none" }
    }
  },
  container: {
    paddingLeft: "0.7rem",
    paddingRight: "0.7rem",
    paddingBottom: "0.7rem"
  },
  scrollable: {
    // overflowX: "hidden",
    // overflowY: "scroll"
  },
  listItem: {
    paddingTop: ".8rem",
    paddingBottom: ".5rem",
    paddingLeft: "1.2rem",
    marginBottom: ".4rem",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  link: {
    marginBottom: ".2rem",
    cursor: "zoom-in",
    maxWidth: "17rem"
  },
  title: {
    marginLeft: "1.2rem",
    marginTop: "2.4rem",
    marginBottom: "0.2rem"
  },
  txIdHeading: {
    paddingLeft: "3.2rem",
    paddingRight: ".3rem",
    fontWeight: "bold"
  },
  cidHeading: {
    paddingRight: ".3rem"
  }
});

export interface TransactionListItemProps {
  transaction: TransactionMeta & { showSender?: boolean };
}

export const TransactionListItem: FC<TransactionListItemProps> = ({ transaction }) => {
  const { link, listItem, txIdHeading, cidHeading } = useStyles();
  console.log(transaction);

  const txLink = `https://rinkeby.etherscan.io/tx/${transaction.hash}`;
  const ipfsLink = `https://infura-ipfs.io/ipfs/${transaction.cid}`;
  //
  // use dedicated endpoint after demo so they can see that its
  // actually hosted on an independent IPFS node and its for real
  //
  // switch over after we blow their minds
  // window.open(`https://trusted-resources.ipfs.infura-ipfs.io/ipfs/${transaction.cid}`);

  return (
    <Paper className={listItem} square elevation={1}>
      <a href={txLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
        <Typography className={link} noWrap variant="body2">
          <span className={txIdHeading}>txId:</span> {transaction.hash}
        </Typography>
      </a>
      {transaction.showSender && (
        <Typography noWrap variant="body2">
          <strong>sent by:</strong> {transaction.from}
        </Typography>
      )}
      <a
        href={ipfsLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        <Typography className={link} noWrap variant="body2">
          <strong className={cidHeading}>file location:</strong> {transaction.cid}
        </Typography>
      </a>
    </Paper>
  );
};

export interface TransactionListProps {
  title?: string;
  transactions: (TransactionMeta & { showSender?: boolean })[];
}

export const TransactionList: FC<TransactionListProps> = ({
  title = "Transactions",
  transactions
}) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography className={classes.title} variant="h5">
        {title}
      </Typography>
      <div className={classes.scrollable}>
        {!!transactions.length &&
          transactions.map((transaction, key) => (
            <TransactionListItem key={key} transaction={transaction} />
          ))}
      </div>
    </div>
  );
};
