import { TextField } from "@mui/material";
import React, { useState } from "react";

interface NumberInputFieldProps {
  label: string;
  value: number;
  onChange: (value: string) => void;
}

const NumberInputField: React.FC<NumberInputFieldProps> = ({ label, value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <TextField
      label={label}
      variant="outlined"
      value={value}
      onChange={handleChange}
    />
  );
};

export default NumberInputField;