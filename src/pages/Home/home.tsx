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
import { DatePicker, Select } from "antd";
import moment from "moment";
import Menu from "../Menu/Menu";
import Layout from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface DataPoint {
  date: string;
  devicePercentage: number;
  servicePercentage: number;
  capSoPercentage: number;
}

const generateData = (): DataPoint[] => {
  // Replace this with real API data
  // For demonstration, random percentages are generated for device, service, and capSo data
  const data: DataPoint[] = [];
  const startDate = moment().subtract(30, "days");

  for (let i = 0; i < 30; i++) {
    const date = startDate.clone().add(i, "days").format("YYYY-MM-DD");
    const devicePercentage = Math.floor(Math.random() * 100);
    const servicePercentage = Math.floor(Math.random() * 100);
    const capSoPercentage = Math.floor(Math.random() * 100);

    data.push({
      date,
      devicePercentage,
      servicePercentage,
      capSoPercentage,
    });
  }

  return data;
};

const aggregateDataByPeriod = (
  data: DataPoint[],
  period: "day" | "week" | "month"
): DataPoint[] => {
  const aggregatedData: DataPoint[] = [];
  const groupedData = data.reduce((acc, cur) => {
    const date = moment(cur.date).startOf(period).format("YYYY-MM-DD");
    acc[date] = acc[date] || [];
    acc[date].push(cur);
    return acc;
  }, {} as Record<string, DataPoint[]>);

  for (const date of Object.keys(groupedData)) {
    const dataPoints = groupedData[date];
    const deviceTotal = dataPoints.reduce(
      (sum, point) => sum + point.devicePercentage,
      0
    );
    const serviceTotal = dataPoints.reduce(
      (sum, point) => sum + point.servicePercentage,
      0
    );
    const capSoTotal = dataPoints.reduce(
      (sum, point) => sum + point.capSoPercentage,
      0
    );

    aggregatedData.push({
      date,
      devicePercentage: deviceTotal / dataPoints.length,
      servicePercentage: serviceTotal / dataPoints.length,
      capSoPercentage: capSoTotal / dataPoints.length,
    });
  }

  return aggregatedData;
};

const Dashboards: React.FC = () => {
  const initialData = generateData();
  const [data, setData] = useState(initialData);
  const [aggregationPeriod, setAggregationPeriod] = useState<"day" | "week" | "month">("day");
  const [dailyData, setDailyData] = useState(initialData);

  useEffect(() => {
    // Update the data state when the component mounts or when the data changes
    setData(generateData());
  }, []);

  useEffect(() => {
    // Store the initial daily data separately
    setDailyData(initialData);
  }, [initialData]);

  const handleDateChange = (dates: any) => {
    if (dates && dates.length === 2) {
      const startDate = moment(dates[0]);
      const endDate = moment(dates[1]);
      const filteredData = data.filter((item) =>
        moment(item.date).isBetween(startDate, endDate, undefined, "[]")
      );

      // Aggregate data based on the selected period (day, week, or month)
      const aggregatedData = aggregateDataByPeriod(filteredData, aggregationPeriod);
      setData(aggregatedData);
    }
  };

  const handleAggregationChange = (value: "day" | "week" | "month") => {
    setAggregationPeriod(value);
    // Reset the data to the original daily data when "day" is selected
    if (value === "day") {
      setData(dailyData);
    } else {
      // Re-aggregate data based on the new selected period
      const startDate = moment().subtract(30, value === "week" ? "weeks" : "months");
      const endDate = moment();
      const filteredData = data.filter((item) =>
        moment(item.date).isBetween(startDate, endDate, undefined, "[]")
      );
      const aggregatedData = aggregateDataByPeriod(filteredData, value);
      setData(aggregatedData);
    }
  };

  // Calculate the percentages for deviceSlice, serviceSlice, and capSoSlice
  const totalDataPoints = data.length;
  const totalDevicePercentage = data.reduce((sum, point) => sum + point.devicePercentage, 0);
  const totalServicePercentage = data.reduce((sum, point) => sum + point.servicePercentage, 0);
  const totalCapSoPercentage = data.reduce((sum, point) => sum + point.capSoPercentage, 0);

  const deviceSlicePercentage = (totalDevicePercentage / totalDataPoints).toFixed(2);
  const serviceSlicePercentage = (totalServicePercentage / totalDataPoints).toFixed(2);
  const capSoSlicePercentage = (totalCapSoPercentage / totalDataPoints).toFixed(2);

  return (
    <Layout>
      <Sider>
        <Menu />
      </Sider>
      <Layout>
        <div>
          <div style={{ marginBottom: 20 }}>
            <RangePicker onChange={handleDateChange} />
            <Select defaultValue="day" onChange={handleAggregationChange}>
              <Option value="day">Day</Option>
              <Option value="week">Week</Option>
              <Option value="month">Month</Option>
            </Select>
          </div>
          <LineChart
            width={800}
            height={400}
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="devicePercentage"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="servicePercentage"
              stroke="#82ca9d"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="capSoPercentage"
              stroke="#ffc658"
              activeDot={{ r: 8 }}
            />
          </LineChart>
          <div>
            <p>Device Slice Percentage: {deviceSlicePercentage}%</p>
            <p>Service Slice Percentage: {serviceSlicePercentage}%</p>
            <p>CapSo Slice Percentage: {capSoSlicePercentage}%</p>
          </div>
        </div>
      </Layout>
    </Layout>
  );
};

export default Dashboards;
