import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { default as BaseSelect } from "@material-ui/core/Select";
import { Controller } from "react-hook-form";
import { FormInputProps } from "../types";

const options = [
  {
    label: "Dropdown Option 1",
    value: "1"
  },
  {
    label: "Dropdown Option 2",
    value: "2"
  },
  {
    label: "Dropdown Option 3",
    value: "3"
  }
];

export const Select: React.FC<FormInputProps> = ({ name, control, label }) => {
  const generateSingleOptions = () => {
    return options.map((option: any) => {
      return (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      );
    });
  };

  return (
    <FormControl size={"small"}>
      <InputLabel>{label}</InputLabel>
      <Controller
        render={({ field: { onChange, value } }) => (
          <BaseSelect onChange={onChange} value={value ?? ""}>
            {generateSingleOptions()}
          </BaseSelect>
        )}
        control={control}
        name={name}
      />
    </FormControl>
  );
};
