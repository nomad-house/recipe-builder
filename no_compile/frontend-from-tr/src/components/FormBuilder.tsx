import { utils as ethersUtils } from "ethers";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DeepPartial, UnpackNestedValue, useForm } from "react-hook-form";

import Paper from "@material-ui/core/Paper";
import { ContractMeta, EventDetails } from "@trusted-resources/storybook";

import { web3Selectors, web3Actions, TrDispatch, configActions } from "../state";

import { Form } from "./Form";
import { EventList } from "./EventList";
import { makeStyles } from "@material-ui/core";

interface FormProps<T extends object> {
  title?: string;
  form?: T;
}

const defaultValues = {
  textValue: "",
  dropdownValue: "",
  radioValue: "",
  checkbox: [],
  sliderValue: 50
} as UnpackNestedValue<DeepPartial<any>>;

const useStyles = makeStyles({
  container: {
    padding: "3rem",
    width: "calc(100% - 9rem)",
    height: "calc(100% - 3rem)",
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch"
  },
  formContainer: {
    flex: "1 1 auto",
    paddingTop: "2.3rem"
  },
  metaContainer: {
    maxWidth: "24rem",
    width: "24rem"
  }
});

export const FormBuilder = <T extends object>({ title, form }: FormProps<T>): JSX.Element => {
  const { container, formContainer, metaContainer } = useStyles();

  const participantAddress = useSelector(web3Selectors.participantAddress());
  const events = useSelector(web3Selectors.allEvents());
  const transactions = useSelector(web3Selectors.allTransactions());
  const files = useSelector(web3Selectors.allFiles());

  const dispatch = useDispatch<TrDispatch>();

  useEffect(() => {
    dispatch(configActions.configSetup());
  }, []);

  const { handleSubmit, control, setValue, reset } = useForm<T>({
    defaultValues
  });

  function onSubmit(eventData: UnpackNestedValue<any>) {
    function isAddress(input: unknown) {
      try {
        ethersUtils.getAddress(`${input}`);
      } catch {
        return false;
      }
      return true;
    }

    console.log(eventData);
    if (eventData.textValue && isAddress(eventData.textValue)) {
      dispatch(
        web3Actions.dualParticipant({
          counterParty: eventData.textValue,
          eventData
        })
      );
    } else {
      dispatch(
        web3Actions.singleParticipant({
          eventData
        })
      );
    }
  }

  return (
    <div className={container}>
      <div className={formContainer}>
        <Form
          title={title}
          control={control}
          setValue={setValue}
          onClick={handleSubmit(onSubmit)}
          reset={reset}
        />
      </div>
      <div style={{ width: "3rem" }}></div>
      <div className={metaContainer}>
        <Paper>
          <ContractMeta
            events={Object.values(events).map((event) => {
              const highlight = !!event?.counterParty && event.counterParty === participantAddress;
              console.log({ participantAddress, highlight, e: event.counterParty });
              const details: EventDetails = {
                participant: event.participant,
                counterParty: event.counterParty,
                highlight,
                ipfs: {
                  cid: event.cid,
                  body: event?.body
                }
              };
              return details;
            })}
            transactions={Object.values(transactions)}
          />
        </Paper>
      </div>
    </div>
  );
};
