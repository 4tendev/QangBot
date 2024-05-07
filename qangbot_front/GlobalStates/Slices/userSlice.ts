import type { PayloadAction  } from "@reduxjs/toolkit";
import  { createSlice } from "@reduxjs/toolkit";


export interface UserSliceState {
    isKnown: boolean | undefined;
    isVIP : boolean | undefined ; 
    vipExpiration : number | undefined

}

const initialState: UserSliceState = {
    isKnown: undefined,
    isVIP : undefined,
    vipExpiration : undefined
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: (create) => ({

    newUserState: create.reducer(
      (state, action: PayloadAction<UserSliceState>) => {
        return action.payload
      },
    ),

    
  }),

  selectors: {
    isKnown: (user) => user.isKnown,
    isVIP : (user) => user.isVIP,
    vipExpiration : (user) => user.vipExpiration,

  },
});

export const { newUserState } =
  userSlice.actions;

export const { isKnown ,isVIP , vipExpiration} = userSlice.selectors;

