import React from "react";
import { Input, Validations } from "./UseFormTemplate";

const UseFormTextarea = (props: {
  input: Input;
  register: any;
  errors: any;
}) => {
  const input = props.input;
  const register = props.register;
  const errors = props.errors;
  const validations = { ...input.validations };
  const errorClassName = "pt-3 px-5  text-red-600 text-sm";
  return (
    <>
      <textarea
        placeholder={input.placeHolder}
        {...register(input.name, validations ? validations : null)}
        className="textarea textarea-bordered textarea-lg w-full max-w-xs"
      ></textarea>
      {Object.keys(validations)
        .map((validationKey, vIndex) => validationKey as keyof Validations)
        .map(
          (validationKey, vIndex) =>
            errors[input.name]?.type == validationKey && (
              <p key={vIndex} className={errorClassName}>
               {(input.validationsMSG &&input.validationsMSG[validationKey] )}
              </p>
            )
        )}
    </>
  );
};

export default UseFormTextarea;
