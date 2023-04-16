import { TextField } from "@mui/material";
import React, { useState } from "react";

interface NameInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const NameInputField: React.FC<NameInputFieldProps> = ({ label, value, onChange }) => {
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

export default NameInputField;