import React, { useEffect, useState } from "react";
import { default as Base_Checkbox } from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import { Controller } from "react-hook-form";
import { FormInputProps } from "../types";

const options = [
  {
    label: "Checkbox Option 1",
    value: "1"
  },
  {
    label: "Checkbox Option 2",
    value: "2"
  }
];

export const Checkbox: React.FC<FormInputProps> = ({ name, control, setValue, label }) => {
  const [selectedItems, setSelectedItems] = useState<any>([]);

  const handleSelect = (value: any) => {
    const isPresent = selectedItems.indexOf(value);
    if (isPresent !== -1) {
      const remaining = selectedItems.filter((item: any) => item !== value);
      setSelectedItems(remaining);
    } else {
      setSelectedItems((prevItems: any) => [...prevItems, value]);
    }
  };

  useEffect(() => {
    setValue(name, selectedItems);
  }, [selectedItems]);

  return (
    <FormControl size={"small"} variant={"outlined"}>
      <FormLabel component="legend">{label}</FormLabel>

      <div>
        {options.map((option: any) => {
          return (
            <FormControlLabel
              label={option.label}
              key={option.value}
              control={
                <Controller
                  name={name}
                  control={control}
                  render={({}) => {
                    return (
                      <Base_Checkbox
                        checked={selectedItems.includes(option.value)}
                        onChange={() => handleSelect(option.value)}
                      />
                    );
                  }}
                />
              }
            />
          );
        })}
      </div>
    </FormControl>
  );
};
