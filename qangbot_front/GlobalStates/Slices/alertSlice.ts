import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { TimeAlertProp } from "@/app/components/TimeAlert/TimeAlert";

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
  }),

  selectors: {
    globalalert: (globalalert) => globalalert,
  },
});

export const { newAlert } = GlobalAlertSlice.actions;

export const { globalalert } = GlobalAlertSlice.selectors;
