import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { BotList, Bot } from "@/app/gridbot/types";
export type BotInfo = {
  bots: BotList;
  canCreateBot: boolean | undefined;
  isLoaded: boolean;
};
const initialState: BotInfo = {
  bots: [],
  canCreateBot: undefined,
  isLoaded: false,
};

export const botSlice = createSlice({
  name: "botInfo",
  initialState,
  reducers: (create) => ({
    newBotInfo: create.reducer((state, action: PayloadAction<BotInfo>) => {
      return action.payload;
    }),

    updateBot: create.reducer((state, action: PayloadAction<Bot>) => {
      const oldstate = [...state.bots].filter(
        (bot) => bot.id !== action.payload.id
      );
      state.bots = [...oldstate, action.payload];
    }),
  }),

  selectors: {
    botInfo: (botInfo) => botInfo,
    bots: (botInfo) => botInfo.bots,
    canAddBot: (botInfo) => botInfo.canCreateBot,
  },
});

export const { newBotInfo, updateBot } = botSlice.actions;

export const { bots, canAddBot, botInfo } = botSlice.selectors;
