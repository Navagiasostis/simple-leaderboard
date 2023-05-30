import { FilledInputProps, InputProps, OutlinedInputProps, TextField, TextFieldProps } from "@mui/material";
import React, { useState } from "react";
import '../Styles/Global.css';

interface NameInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  additionalProps?:  Omit<TextFieldProps, "variant">
}

const NameInputField: React.FC<NameInputFieldProps> = ({ label, value, onChange, additionalProps }) => {
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

export default NameInputField;