import { FilledInputProps, InputProps, OutlinedInputProps, TextField, TextFieldProps } from "@mui/material";
import React, { useState } from "react";

interface NumberInputFieldProps {
  label: string;
  value: number;
  onChange: (value: string) => void;
  additionalProps?:  Omit<TextFieldProps, "variant">
}

const NumberInputField: React.FC<NumberInputFieldProps> = ({ label, value, onChange, additionalProps }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <TextField
      label={label}
      variant="outlined"
      value={value}
      onChange={handleChange}
      {...additionalProps}
    />
  );
};

export default NumberInputField;