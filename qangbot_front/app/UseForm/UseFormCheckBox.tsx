import React from "react";
import { Input, Validations } from "./UseFormTemplate";
const UseFormCheckBox = (props: {
  input: Input;
  register: any;
  errors: any;
}) => {
  const input = props.input;
  const register = props.register;
  const errors = props.errors;
  const validations = { ...input.validations };
  return (
    <>
      <div className="form-control">
        <label className="cursor-pointer label px-4">
          <span className="label-text">{input.placeHolder}</span>
          <input
            {...register(input.name, validations ? validations : null)}
            type="checkbox"
            className="checkbox checkbox-success"
          />
        </label>
        {Object.keys(validations)
          .map((validationKey, vIndex) => validationKey as keyof Validations)
          .map(
            (validationKey, vIndex) =>
              errors[input.name]?.type == validationKey && (
                <p key={vIndex} className="pt-3 px-5 text-red-600 text-sm">
                  {(input.validationsMSG &&input.validationsMSG[validationKey] )}
                </p>
              )
          )}
      </div>
    </>
  );
};

export default UseFormCheckBox;
