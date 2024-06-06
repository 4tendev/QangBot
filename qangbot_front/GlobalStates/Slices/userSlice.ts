import type { PayloadAction  } from "@reduxjs/toolkit";
import  { createSlice } from "@reduxjs/toolkit";


export interface UserSliceState {
    isKnown: boolean | undefined;
    isVIP : boolean | undefined ; 
    vipExpiration : string | undefined ;
    totpActivated : boolean | undefined ;

}

const initialState: UserSliceState = {
    isKnown: undefined,
    isVIP : undefined,
    totpActivated :undefined,
    vipExpiration : undefined,
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
    totpActivated :  (user) => user.totpActivated,
  },
});

export const { newUserState } =
  userSlice.actions;

export const { isKnown ,isVIP , vipExpiration , totpActivated} = userSlice.selectors;

