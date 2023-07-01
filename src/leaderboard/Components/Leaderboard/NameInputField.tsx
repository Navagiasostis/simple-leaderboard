import { TextField, TextFieldProps } from "@mui/material";
import React from "react";

interface NameInputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    additionalProps?: Omit<TextFieldProps, "variant">;
}

const NameInputField: React.FC<NameInputFieldProps> = ({
    label,
    value,
    onChange,
    additionalProps
}) => {
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
