import type { PayloadAction  } from "@reduxjs/toolkit";
import  { createSlice } from "@reduxjs/toolkit";


export interface UserSliceState {
    isKnown: boolean | undefined;
}

const initialState: UserSliceState = {
    isKnown: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: (create) => ({

    newUserState: create.reducer(
      (state, action: PayloadAction<boolean>) => {
        state.isKnown = action.payload;
      },
    ),

    
  }),

  selectors: {
    isKnown: (user) => user.isKnown,
  },
});

export const { newUserState } =
  userSlice.actions;

export const { isKnown } = userSlice.selectors;
