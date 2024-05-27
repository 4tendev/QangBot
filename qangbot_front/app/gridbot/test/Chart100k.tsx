"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import dictionary from "./dictionary.json";
import { useAppSelector } from "@/GlobalStates/hooks";
import { language } from "@/GlobalStates/Slices/languageSlice";

const Chart = () => {
  const data = [
    {
      grids: 10,
      "BTC-Gain": 0.54,
      "BTC-Max-Lost": 0.14,
      "Gain/Max-Lost": 3.73,
    },
    {
      grids: 25,
      "BTC-Gain": 0.6,
      "BTC-Max-Lost": 0.2,
      "Gain/Max-Lost": 3.0,
    },
    {
      grids: 50,
      "BTC-Gain": 0.621,
      "BTC-Max-Lost": 0.22,
      "Gain/Max-Lost": 2.82,
    },
    {
      grids: 100,
      "BTC-Gain": 0.602,
      "BTC-Max-Lost": 0.25,
      "Gain/Max-Lost": 2.4,
    },
    {
      grids: 200,
      "BTC-Gain": 0.58,
      "BTC-Max-Lost": 0.27,
      "Gain/Max-Lost": 2.09,
    },
    {
      grids: 400,
      "BTC-Gain": 0.558,
      "BTC-Max-Lost": 0.29,
      "Gain/Max-Lost": 1.88,
    },
  ];
  const lang = useAppSelector(language).lang;
  const [elementWidth, setElementWidth] = useState(0);
  useEffect(() => {
    const updateElementWidth = () => {
      const element = document.getElementById("chart"); // Replace with the actual ID of your element
      if (element) {
        const width = element.offsetWidth;
        setElementWidth(width);
      }
    };
    updateElementWidth();
    window.addEventListener("resize", updateElementWidth);
    return () => {
      window.removeEventListener("resize", updateElementWidth);
    };
  }, []);
  return (
    <div className="w-full max-w-6xl mx-auto felx flex-col justify-start">
      <div dir="ltr" id="chart" className="w-full max-w-5xl mx-auto py-5">
        <div className="sm:text-lg text-info  ps-8">
          {dictionary.gridGain[lang]}
        </div>
        <LineChart
          width={elementWidth - 20}
          height={400}
          data={data}
          margin={{
            top: 20,
            right: 5,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 10" />
          <XAxis dataKey="grids" tickMargin={10} />
          <YAxis
            orientation={"left"}
            tickMargin={15}
            yAxisId="BTC-Gain"
            tickCount={3}
          />

          <Tooltip animationDuration={100} allowEscapeViewBox={{ x: false }} />
          <Legend />

          <Line
            yAxisId="BTC-Gain"
            type="monotone"
            dataKey="BTC-Max-Lost"
            stroke="red"
          />
          <Line
            yAxisId="BTC-Gain"
            type="monotone"
            dataKey="BTC-Gain"
            stroke="green"
          />
          <Line
            yAxisId="BTC-Gain"
            type="monotone"
            dataKey="Gain/Max-Lost"
            stroke="blue"
          />
        </LineChart>
      </div>
      <div className="w-full px-6 sm:px-11">
        <div>
          <h3 className="text-primary">{dictionary.considerations[lang]}</h3>

          <ul className="ps-2 flex flex-col gap-2 py-2">
            <li>{dictionary["grid10-7"][lang]}</li>
            <li>{dictionary["gainLose"][lang]}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Chart;
