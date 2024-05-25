import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { Bot, Grid } from "@/app/gridbot/types";
export type BotInfo = {
  bots: Bot[];
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
    deleteGrid: create.reducer(
      (state, action: PayloadAction<{ botID: number; gridID: Grid["id"] }>) => {
        const oldstate = [...state.bots].filter(
          (bot) => bot.id !== action.payload.botID
        );
        const selectedBot = [...state.bots].find(
          (bot) => bot.id === action.payload.botID
        );
        selectedBot &&
          (selectedBot.grids = [
            ...selectedBot.grids.filter(
              (grid) => grid.id !== action.payload.gridID
            ),
          ]);
        if (selectedBot) {
          state.bots = [...oldstate, selectedBot];
        }
      }
    )
    ,
    updateGrid: create.reducer(
      (state, action: PayloadAction<{ botID: number; grid: Grid }>) => {
        const oldstate = [...state.bots].filter(
          (bot) => bot.id !== action.payload.botID
        );
        const selectedBot = [...state.bots].find(
          (bot) => bot.id === action.payload.botID
        );
        selectedBot &&
          (selectedBot.grids = [
            ...selectedBot.grids.filter(
              (grid) => grid.id !== action.payload.grid.id
            ),
            action.payload.grid,
          ]);
        if (selectedBot) {
          state.bots = [...oldstate, selectedBot];
        }
      }
    ),
    addGrids: create.reducer(
      (
        state,
        action: PayloadAction<{ botID: number; grids: Bot["grids"] }>
      ) => {
        const oldstate = [...state.bots].filter(
          (bot) => bot.id !== action.payload.botID
        );
        const selectedBot = [...state.bots].find(
          (bot) => bot.id === action.payload.botID
        );
        selectedBot &&
          (selectedBot.grids = [...selectedBot.grids, ...action.payload.grids]);
        if (selectedBot) {
          state.bots = [...oldstate, selectedBot];
        }
      }
    ),
  }),

  selectors: {
    botInfo: (botInfo) => botInfo,
    bots: (botInfo) => botInfo.bots,
    canAddBot: (botInfo) => botInfo.canCreateBot,
    getBot: (botInfo, id) => botInfo.bots.find((bot) => bot.id === id),
  },
});

export const { addGrids, newBotInfo, updateBot,updateGrid ,deleteGrid } = botSlice.actions;

export const { getBot, bots, canAddBot, botInfo } = botSlice.selectors;
