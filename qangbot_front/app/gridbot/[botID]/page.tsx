"use client";
import React, { useState } from "react";
import Info from "./info/page";
import Grid from "./grids/page";
export default function Page({ params }: { params: { botID: number } }) {
  return (
    <>
      <Info params={{ botID: Number(params.botID) }} />
      <Grid params={{ botID: Number(params.botID) }} />
    </>
  );
}
