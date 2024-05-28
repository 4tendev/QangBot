"use client";
import dictionary from "./dictionary.json";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { History } from "./types";
import { useAppSelector } from "@/GlobalStates/hooks";
import { language } from "@/GlobalStates/Slices/languageSlice";
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const formattedDate = `${day} ${month}`;
  return formattedDate;
}

const Chart = (props: { data: History[] }) => {
  const data = props.data.map((history: any) => {
    return { ...history, date: formatDate(history.date).substring(0, 6) };
  });
  const lang = useAppSelector(language).lang;
  const [elementWidth, setElementWidth] = useState<number>(0);

  useEffect(() => {
    const updateElementWidth = () => {
      const element = document.getElementById("chart");
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
    <div id="chart" className="w-full max-w-5xl mx-auto  py-5">
      <div className="sm:text-lg text-info mb-4 ps-8">
        {dictionary.strategyFrom[lang]} {data[0].date}
      </div>
      <div className="ps-2">
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
          <XAxis dataKey="date" tickMargin={3} />
          <YAxis
            tickMargin={15}
            orientation={"left"}
            yAxisId="date"
            tickCount={3}
          />

          <Tooltip animationDuration={100} allowEscapeViewBox={{ x: false }} />
          <Legend />

          <Line
            yAxisId="date"
            type="monotone"
            dataKey="btcROI"
            stroke="orange"
            dot={false}
            strokeWidth={2}
          />
          <Line
            yAxisId="date"
            type="monotone"
            dataKey="usdROI"
            stroke="green"
            strokeWidth={5}
            dot={false}
          />
          <Line
            strokeWidth={2}
            dot={false}
            yAxisId="date"
            type="monotone"
            dataKey="ethROI"
            stroke="red"
          />
        </LineChart>
      </div>
    </div>
  );
};

export default Chart;
