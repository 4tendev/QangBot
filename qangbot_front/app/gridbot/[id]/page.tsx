"use client";
import React, { useState } from "react";
import { Bot } from "../types";
import { useAppSelector } from "@/GlobalStates/hooks";
import { bots } from "@/GlobalStates/Slices/botSlice";
import Info from "./info/page";
import Grids from "./grids/page";
export default function Page({ params }: { params: { id: string } }) {
  const botID = Number(params.id);
  const botList = useAppSelector(bots);

  const gridbot = botList?.filter((bot: Bot) => bot.id === botID)[0];

  return (
    <>
      <Info params={{ id: gridbot.id }} />
      <Grids params={{ id: gridbot.id }} />
    </>
  );
}
