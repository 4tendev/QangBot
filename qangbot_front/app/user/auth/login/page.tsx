"use client";
import UseFormTemplate from "@/app/UseForm/UseFormTemplate";

import { passwordInput, usernameInput } from "../inputs/inputs";
import dictionary from "./dictionary.json";
import React from "react";

const Page = () => {
  const lang = "en";
  const form = {
    inputs: [usernameInput(lang), passwordInput(lang)],
    action: dictionary.login[lang],
  };
  async function action(data: any) {
    return <div>test</div>;
  }
  return (
    <div className="mx-auto max-w-md px-3">
      <UseFormTemplate form={form} action={action} />
    </div>
  );
};

export default Page;
