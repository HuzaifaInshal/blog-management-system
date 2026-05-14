import { cn } from "@/lib/utils";
import { ReactDispatch } from "@/types/common";
import React from "react";
import LabelContainer from "./LabelContainer";
import { inputStyles } from "@/styles/ui/inputStyles";

const TextArea = ({
  label,
  error,
  value,
  setValue,
  containerClassName,
  labelClassName,
  rows = 5,
  ...rest
}: React.ComponentProps<"textarea"> & {
  label?: string;
  error?: string;
  value?: string;
  setValue?: ReactDispatch<string>;
  containerClassName?: string;
  labelClassName?: string;
}) => {
  return (
    <LabelContainer
      error={error}
      htmlFor={rest.id}
      label={label}
      className={containerClassName}
      labelClassName={labelClassName}
      required={rest.required}
    >
      <textarea
        {...rest}
        rows={rows}
        className={cn(
          inputStyles,
          "h-auto resize-none py-2 leading-relaxed",
          rest.className
        )}
        value={value}
        onChange={(e) => {
          setValue?.(e.target.value);
          rest.onChange?.(e);
        }}
      />
    </LabelContainer>
  );
};

export default TextArea;
