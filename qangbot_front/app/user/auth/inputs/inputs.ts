import dictionary from "./dictionary.json";
import { Input } from "@/app/UseForm/UseFormTemplate";
import { Language } from "@/settings";
export function usernameInput(lang: Language): Input {
  return {
    type: "text",
    autoFocus: true,
    placeHolder: dictionary["username"][lang],
    name: "username",
    validations: { required: true, minLength: 6 },
    validationsMSG: {
      required: dictionary["required"][lang],
      minLength: dictionary["sixChar"][lang],
    },
  };
}

export function passwordInput(lang: Language): Input {
  return {
    type: "password",
    placeHolder: dictionary["password"][lang],
    name: "password",
    validations: { required: true, minLength: 8 },
    validationsMSG: {
      required: dictionary["required"][lang],
      minLength: dictionary["eightChar"][lang],
    },
  };
}

export function trustedDeviceInput(lang: Language): Input {
  return {
    type: "checkbox",
    placeHolder: dictionary["trustedDevice"][lang],
    name: "trustedDevice",
    validations: { required: false },
    validationsMSG: {
      required: dictionary["required"][lang],
    },
  };
}



export function emailInput(lang: Language): Input {
  return {
    type: "text",
    placeHolder: dictionary["email"][lang],
    name: "email",
    validations: {
      required: true,
      pattern:
        /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/,
    },
    validationsMSG: {
      required: dictionary["required"][lang],
      pattern: dictionary["emailFormatError"][lang],
    },
  };
}
export function verificationCodeInput(lang: Language): Input {
  return {
    autoFocus: true,
    type: "number",
    placeHolder: dictionary["verificationCode"][lang],
    name: "verificationCode",
    validations: { required: true, maxLength: 6, minLength: 6 },
    validationsMSG: {
      required: dictionary["required"][lang],
      maxLength: dictionary["sixDigit"][lang],
      minLength: dictionary["sixDigit"][lang],
    },
  };
}

export function repeatPasswordInput(lang: Language): Input {
  const repeatPasswordInput =passwordInput(lang)
  repeatPasswordInput.name = "repeatPassword"
  repeatPasswordInput.placeHolder =dictionary["repeat"][lang]
  return repeatPasswordInput;
}
export function newPasswordInput(lang: Language): Input {
  return {
    type: "password",
    placeHolder: dictionary["newPassword"][lang],
    name: "newPassword",
    validations: { required: true, minLength: 8 },
    validationsMSG: {
      required: dictionary["required"][lang],
      minLength: dictionary["eightChar"][lang],
    },
  };
}
