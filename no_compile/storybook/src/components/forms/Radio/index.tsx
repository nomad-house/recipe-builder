import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import { default as BaseRadio } from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { Controller } from "react-hook-form";
import { FormInputProps } from "../types";

const options = [
  {
    label: "Radio Option 1",
    value: "1"
  },
  {
    label: "Radio Option 2",
    value: "2"
  }
];

export const Radio: React.FC<FormInputProps> = ({ name, control, label }) => {
  const generateRadioOptions = () => {
    return options.map((singleOption, key) => (
      <FormControlLabel
        key={key}
        value={singleOption.value}
        label={singleOption.label}
        control={<BaseRadio />}
      />
    ));
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
          <RadioGroup value={value} onChange={onChange}>
            {generateRadioOptions()}
          </RadioGroup>
        )}
      />
    </FormControl>
  );
};
