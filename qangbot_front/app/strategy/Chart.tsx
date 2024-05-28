"use client";
import Image from "next/image";
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
import { Language } from "@/settings";
import { useEffect, useState } from "react";
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

const Chart = (props: { data: any; lang: Language }) => {
  const data = props.data.map((history: any) => {
    return { ...history, date: formatDate(history.date) };
  });
  const lang = props.lang;
  const [elementWidth, setElementWidth] = useState<number>(0);

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
      <div id="chart" className="w-full max-w-5xl mx-auto  py-5">
        <div className="sm:text-lg text-info mb-4 ps-8">
          {dictionary.jan[lang]}
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
            <XAxis dataKey="date" tickMargin={10} />
            <YAxis
              tickMargin={15}
              orientation={"left"}
              yAxisId="date"
              tickCount={3}
            />

            <Tooltip
              animationDuration={100}
              allowEscapeViewBox={{ x: false }}
            />
            <Legend />

            <Line
              yAxisId="date"
              type="monotone"
              dataKey="btcROI"
              stroke="red"
            />
            <Line
              yAxisId="date"
              type="monotone"
              dataKey="usdROI"
              stroke="green"
            />
            <Line
              yAxisId="date"
              type="monotone"
              dataKey="ethROI"
              stroke="blue"
            />
          </LineChart>
        </div>
      </div>
      <div className="w-full px-6 sm:px-11">
        <div className="flex w-full justify-between">
          <div className="flex  flex-col justify-center ">
            <div className="text-accent text-lg font-bold">
              {dictionary.QANGStrategy[lang]}
            </div>
            <div className="flex flex-wrap justify-between gap-y-6 gap-x-10 ps-3 py-3  max-w-2xl">
              <div>
                <h3 className="text-primary">{dictionary.assumptions[lang]}</h3>

                <ul className="ps-2">
                  <li>{dictionary.adoption[lang]}</li>
                  <li>{dictionary.cycle[lang]} </li>
                  <li>{dictionary.volatile[lang]} </li>
                </ul>
              </div>
              <div>
                <h3 className="text-primary">
                  {dictionary.considerations[lang]}
                </h3>

                <ul className="ps-2">
                  <li>{dictionary.averages[lang]}</li>
                  <li>{dictionary.log[lang]} </li>
                  <li>{dictionary.hype[lang]}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-primary">{dictionary.risk[lang]}</h3>

                <ul className="ps-2">
                  <li>{dictionary.exchange[lang]}</li>
                  <li>{dictionary.cryptocurrency[lang]}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex items-center max-[835px]:hidden  justify-center grow">
            <Image
              alt="Risk"
              width={300}
              height={300}
              src={"/risk.png"}
            ></Image>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;
