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
  const [startDate, setSartDate] = useState<string>(props.data[0].date);
  const [ednDate, setEndDate] = useState<string>(
    props?.data?.at(-1)?.date ?? ""
  );

  const rawData = props.data.filter(
    (history) => history.date >= startDate && history.date <= ednDate
  );

  const normalizedData = rawData.map((history) => {
    return {
      ...history,
      btcROI: Math.floor(
        (100 * (100 + history.btcROI)) / (100 + rawData[0].btcROI) - 100
      ),
      ethROI: Math.floor(
        (100 * (100 + history.ethROI)) / (100 + rawData[0].ethROI) - 100
      ),
      usdROI: Math.floor(
        (100 * (100 + history.usdROI)) / (100 + rawData[0].usdROI) - 100
      ),
    };
  });

  const data = normalizedData.map((history: History) => {
    return { ...history, date: formatDate(history.date).substring(0, 6) };
  });

  const lang = useAppSelector(language).lang;
  const [elementWidth, setElementWidth] = useState<number>(0);
  const [maxDrawDownUSD, setMaxDrawDownUSD] = useState(0);
  useEffect(() => {
    let maxUSD = 0;
    let maxDDUSD = 0;
    for (let index = 0; index < data.length; index++) {
      maxUSD = Math.max(maxUSD, Number(data[index]["usdROI"]));

      maxDDUSD = Math.max(
        maxDDUSD,
        Number(
          (
            100 *
            (1 - (Number(data[index]["usdROI"]) + 100) / (maxUSD + 100))
          ).toFixed(0)
        )
      );
    }
    setMaxDrawDownUSD(maxDDUSD);
    return () => {};
  }, []);
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
      <div className="sm:text-lg text-info mb-4 ps-5 flex flex-wrap gap-1">
        <div className="flex items-center text-xs flex-wrap gap-2">
           Date Range :
          <input
            onChange={(event) => setSartDate(event.target.value)}
            value={startDate}
            max={ednDate}
            type="date"
            min={props.data[0].date}
            className="input input-sm input-primary text-primary"
          />
          <input
            onChange={(event) => setEndDate(event.target.value)}
            max={props?.data?.at(-1)?.date}
            min={startDate}
            value={ednDate}
            type="date"
            className="input input-sm input-primary text-primary"
          />
        </div>
      </div>
      <div className="text-primary px-5 flex  flex-col">
        <small> Total selected Days : {data.length}</small>
        <small className="text-rose-600"> Max USD DrawDown : {maxDrawDownUSD}</small>
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
          <Legend />
        </LineChart>
      </div>
      <div className="mt-2 px-2 ps-9"></div>
    </div>
  );
};

export default Chart;
