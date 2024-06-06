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
  validationsMSG?: ValidationsMSG<Validations>;
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
  const [responseMessage, setResponseMessage]: [
    undefined | React.JSX.Element | void,
    Function
  ] = useState(undefined);
  const [onSubmitMode, setonSubmitMode] = useState(false);
  const defaultValue = props.defaultValue ?? {};
  const lang = useAppSelector(language).lang;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: defaultValue });
  const action = props.action;
  async function onSubmit(data: object) {
    setonSubmitMode(true);
    setResponseMessage(undefined);
    await action(data).then((result: React.JSX.Element | void | undefined) => {
      setResponseMessage(result);
    });
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
    <div className=" w-full  h-full">
     
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`card-body h-full  justify-between  p-0 w-full pb-14 sm:pb-0`}
      >
          <div className="overflow-auto sm:px-1 px-5">
        {form.inputs.map((input, index) => (
          <div key={index} className="my-2">
            {inputSelector(input)}
          </div>
        ))}
        {responseMessage ? responseMessage : null}
       
        </div>
        <button
          type="submit"
          disabled={onSubmitMode ?? true}
          className="btn grow w-screen  sm:w-full left-0 fixed bottom-0 sm:static shadow-md btn-primary mt-1 sm:rounded rounded-none  "
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
