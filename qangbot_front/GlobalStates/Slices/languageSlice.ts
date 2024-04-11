import type { PayloadAction  } from "@reduxjs/toolkit";
import  { createSlice } from "@reduxjs/toolkit";
import { SUPPORTED_LANGUAGES } from "@/settings";

export type LanguageSliceState = typeof SUPPORTED_LANGUAGES[number]

const initialState:  LanguageSliceState = SUPPORTED_LANGUAGES[0]


export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: (create) => ({

    selectedLanguage: create.reducer(
      (state, action: PayloadAction<LanguageSliceState>) =>  action.payload
    ),

    
  }),

  selectors: {
    language: (language) => language
  },
});

export const { selectedLanguage } =
languageSlice.actions;

export const { language } = languageSlice.selectors;
