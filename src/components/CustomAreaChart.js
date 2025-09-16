"use client";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CustomAreaChart = ({ chartName, data, setIncomeYear }) => {
  return (
    <div className="w-full rounded-xl bg-foundation-white-darker p-6 md:w-1/2">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-xl font-medium text-primary-white">
          {chartName} Overview
        </h1>

        <div className="flex-center-start gap-x-4">
          <DatePicker
            onChange={(_date, dateString) => setIncomeYear(dateString)}
            picker="year"
            defaultValue={dayjs()}
            style={{ height: "35px", border: "none" }}
            disabledDate={(current) =>
              current && current > dayjs().endOf("year")
            }
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C8C8C8" stopOpacity={1} />
              <stop
                offset="100%"
                stopColor="rgba(117, 136, 136, 0.10)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>

          <XAxis
            tickMargin={10}
            axisLine={false}
            tickLine={false}
            dataKey="month"
            tick={{ fill: "lightGray" }}
          />

          <YAxis
            tickMargin={20}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "lightGray" }}
          />

          <CartesianGrid opacity={0.08} stroke="#fff" strokeDasharray="3 3" />

          <Tooltip
            formatter={(value) => [`Monthly ${chartName}: ${value}`]}
            contentStyle={{
              color: "var(--primary-black)",
              fontWeight: "500",
              borderRadius: "5px",
              border: "0",
            }}
            itemStyle={{
              color: "var(--primary)",
              fontWeight: "500",
            }}
          />

          <Area
            activeDot={{ fill: "var(--primary)" }}
            type="monotone"
            dataKey="income"
            strokeWidth={0}
            stroke="var(--primary)"
            fill="url(#gradientFill)" // Reference the gradient by id - declared top of the component
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomAreaChart;
