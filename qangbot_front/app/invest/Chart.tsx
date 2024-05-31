"use client";
import dictionary from "./dictionary.json";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
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
  const [apy, setAPY] = useState(0);

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
  const [maxDrawDownUSD, setMaxDrawDownUSD] = useState<number>(0);

  function setmaxDD() {
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
  }

  useMemo(() => {
    setmaxDD();
    setAPY(
      Number(((365 * (data?.at(-1)?.usdROI ?? 1)) / data.length).toFixed(2))
    );
  }, [ednDate, startDate]);

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
    <div id="chart" className="w-full max-w-5xl mx-auto  pt-3">
      <div dir="ltr" className="sm:text-lg  ps-5 flex flex-wrap gap-1">
        <div className="flex items-center text-xs flex-wrap gap-2 w-full">
          <div className="flex w-full flex-col gap-1 items-center">
            <div className="flex justify-between w-full gap-1 pe-4">
              <input
                onChange={(event) => setSartDate(event.target.value)}
                value={startDate}
                max={ednDate}
                type="date"
                min={props.data[0].date}
                className="input input-xs input-bordered border-4"
              />
              <input
                onChange={(event) => setEndDate(event.target.value)}
                max={props?.data?.at(-1)?.date}
                min={startDate}
                value={ednDate}
                type="date"
                className="input input-xs input-bordered  border-4"
              />
            </div>
            <small className="text-xs">{dictionary.selectedDays[lang]}{data.length}</small>
          </div>
        </div>
      </div>
      <div className="text-primary px-5 flex  flex-col"></div>
      <div dir="ltr" className="">
        <LineChart
          width={elementWidth - 20}
          height={400}
          data={data}
          margin={{
            top: 3,
            right: 15,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis  dataKey="date" tickMargin={3} />
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
      <div className="ps-[6vw] my-2">
        <div className="flex flex-wrap">
          <small className=" flex items-center ">
            {dictionary.maxDDUSD[lang]}
            <div className="text-error inline-block ms-1">
              {maxDrawDownUSD}%
            </div>
          </small>
          <small className=" flex items-center ps-3">
            {dictionary.apy[lang]}
            <div
              className={
                "inline-block ms-1 " + (apy > 0 ? "text-success" : "text-error")
              }
            >
              {apy}%
            </div>
          </small>
        </div>
        <div className="text-sm   font-bold ">{dictionary.roi[lang]}</div>
      </div>

      <div className="mt-2 px-2 ps-9"></div>
    </div>
  );
};

export default Chart;
