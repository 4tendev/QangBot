"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from "./UseFormTextInput";
import CheckBox from "./UseFormCheckBox";
import Textarea from "./UseFormTextarea";
import dictionary from "./dictionary.json";
import { language } from "@/GlobalStates/Slices/languageSlice";
import { useAppSelector } from "@/GlobalStates/hooks";

export type Validations = {
  required?: boolean;
  maxLength?: number;
  pattern?: RegExp;
  minLength?: number;
};

export type ValidationsMSG<T extends Validations> = {
  [P in keyof T]?: string;
};

export type Input = {
  type: "text" | "password" | "number" | "checkbox" | "textarea";
  name: string;
  validations?: Validations;
  validationsMSG: ValidationsMSG<Validations>;
  autoFocus?: boolean;
  autoComplete?: "on" | "off";
  placeHolder: string;
};

export type Form = {
  inputs: Input[];
  action: string;
};

export type DefaultValue<T extends Input> = {
  [P in T["name"]]?: boolean | number | string;
};

const UseFormTemplate = (props: {
  action: Function;
  form: Form;
  defaultValue?: DefaultValue<Input>;
}) => {
  const [onSubmitMode, setonSubmitMode] = useState(false);
  const defaultValue = props.defaultValue ?? {};
  const lang = useAppSelector(language).lang;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: defaultValue });
  const action = props.action;
async  function onSubmit(data: object) {
    setonSubmitMode(true);
    await action(data).then();
    setonSubmitMode(false);
  }

  const form = props.form;

  function inputSelector(input: Input) {
    switch (input.type) {
      case "checkbox":
        return <CheckBox input={input} register={register} errors={errors} />;
      case "textarea":
        return <Textarea input={input} register={register} errors={errors} />;
      default:
        return <TextInput input={input} register={register} errors={errors} />;
    }
  }

  return (
    <div className=" w-full ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`card-body  p-0 w-full`}
      >
        {form.inputs.map((input, index) => (
          <div key={index} className="my-1">
            {inputSelector(input)}
          </div>
        ))}
        <button
          type="submit"
          disabled={onSubmitMode ?? true}
          className="btn shadow-md btn-primary my-1  "
        >
          {onSubmitMode ? (
            <>
              {dictionary["wait"][lang]}
              <span className="loading loading-bars loading-md"></span>
            </>
          ) : (
            form.action
          )}
        </button>
      </form>
    </div>
  );
};

export default UseFormTemplate;
