import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { TimeAlertProp } from "@/app/components/TimeAlert/TimeAlert";
import dictionary from "./dictionary.json"
import { Language } from "@/settings";
const initialState: TimeAlertProp  = {
  message : "",
  mode : "success",
  time : 0  
}




export const GlobalAlertSlice = createSlice({
  name: "globalalert",
  initialState,
  reducers: (create) => ({
    newAlert: create.reducer(
      (state, action: PayloadAction<TimeAlertProp >) =>  action.payload
    ),
    serverErrorAlert: create.reducer(
      (state, action: PayloadAction<Language >) =>  {return{
        message : dictionary.serverError[action.payload],
        mode : "error",
        time : 3 
      }}
    ),
    connectionErrorAlert: create.reducer(
      (state, action: PayloadAction<Language >) =>  {return{
        message : dictionary.connectionError[action.payload],
        mode : "error",
        time : 3 
      }}
    ),
  }),

  selectors: {
    globalalert: (globalalert) => globalalert,
  },
});

export const { newAlert ,serverErrorAlert ,connectionErrorAlert} = GlobalAlertSlice.actions;

export const { globalalert } = GlobalAlertSlice.selectors;
