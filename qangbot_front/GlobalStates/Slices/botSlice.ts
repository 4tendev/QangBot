import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { BotList , Bot} from "@/app/gridbot/types";
export type BotInfo = {bots:BotList,canCreateBot:boolean | undefined}
const initialState: BotInfo = {bots: [] ,canCreateBot:undefined}

export const botSlice = createSlice({
  name: "botInfo",
  initialState,
  reducers: (create) => ({
    setBotList: create.reducer((state, action: PayloadAction<BotList>) => {
      state.bots = action.payload;
    }),
    newBotInfo: create.reducer((state, action: PayloadAction<BotInfo>) => {
        return action.payload;
      }),
    addBot: create.reducer((state, action: PayloadAction<Bot>) => {
         state.bots = [ ...state.bots,action.payload];
      }),
  }),

  selectors: {
    bots: (botInfo) => botInfo.bots,
    canAddBot : (botInfo) => botInfo.canCreateBot
  },
});

export const { setBotList ,newBotInfo ,addBot} = botSlice.actions;

export const { bots ,canAddBot} = botSlice.selectors;