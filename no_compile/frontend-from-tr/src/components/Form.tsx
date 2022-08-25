import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import {
  // DeepPartial,
  // useForm,
  UnpackNestedValue
} from "react-hook-form";

import {
  Checkbox,
  // DatePicker,
  Radio,
  Select,
  Slider,
  TextField
} from "@trusted-resources/storybook";

// interface FormProps<T extends object> {
//   title?: string;
//   form?: T;
// }

// const defaultValues = {
//   textValue: "",
//   dropdownValue: "",
//   radioValue: "",
//   checkbox: [],
//   sliderValue: 50
// } as UnpackNestedValue<DeepPartial<any>>;

export const Form = ({
  onClick,
  title,
  control,
  setValue,
  handleSubmit,
  reset,
  service,
  events
}: any) => {
  return (
    <Paper
      style={{
        display: "grid",
        gridRowGap: "20px",
        padding: "20px",
        maxWidth: "40rem"
      }}
    >
      <Typography variant="h6">{title}</Typography>

      <TextField name="textValue" control={control} label="Text Input" />
      <Radio name="radioValue" control={control} label={"Radio Input"} />
      <Select name="dropdownValue" control={control} label="Dropdown Input" />
      <Checkbox
        control={control}
        setValue={setValue}
        name={"checkboxValue"}
        label={"Checkbox Input"}
      />
      <Slider name={"sliderValue"} control={control} setValue={setValue} label={"Slider Input"} />

      <Button variant={"contained"} onClick={onClick}>
        {" "}
        Submit{" "}
      </Button>
      <Button onClick={() => reset()} variant={"outlined"}>
        {" "}
        Reset{" "}
      </Button>
      {!!events?.length && <pre>{JSON.stringify(events, null, 2)}</pre>}
    </Paper>
  );
};
