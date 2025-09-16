"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const CustomBarChart = ({ chartName, data, setJoinYear }) => {
  return (
    <div className="w-full rounded-xl bg-foundation-white-darker p-6 md:w-1/2">
      <div className="mb-10 flex items-center justify-between gap-2 lg:flex-wrap xl:flex-nowrap">
        <h1 className="text-xl font-medium text-white">{chartName} Overview</h1>

        <div className="space-x-3">
          <DatePicker
            onChange={(date, dateString) => setJoinYear(dateString)}
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
        <BarChart
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
          barSize={20}
        >
          <XAxis
            dataKey="month"
            scale="point"
            padding={{ left: 10, right: 10 }}
            tickMargin={10}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "lightGray" }} // x-axis points/name color
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={20}
            tick={{ fill: "lightGray" }}
          />

          <Tooltip
            formatter={(value) => [`Monthly Users Joined: ${value}`]}
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

          <CartesianGrid
            opacity={0.2}
            horizontal={true}
            vertical={false}
            stroke="#fff"
            strokeDasharray="3 3"
          />

          <Bar
            barSize={18}
            radius={12}
            background={false}
            dataKey="total"
            fill="var(--primary-white)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
