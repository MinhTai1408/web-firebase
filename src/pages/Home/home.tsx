import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { db } from "../../Firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Layout,
  Select,
  Row,
  Col,
  Form,
  Progress,
  theme,
  Calendar,
} from "antd";
import {
  endOfMonth,
  endOfWeek,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import Sider from "antd/es/layout/Sider";
import Menu from "../Menu/Menu";
import { Content, Header } from "antd/es/layout/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCalendarCheck,
  faComments,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import Card from "antd/es/card/Card";
import Meta from "antd/es/card/Meta";
import type { CalendarMode } from "antd/es/calendar/generateCalendar";
import type { Dayjs } from "dayjs";
import { DeviceWithId } from "../../features/deviceSlice";
import { useAppSelector } from "../../hooks/storeHook";
import { DesktopOutlined } from "@ant-design/icons";
import { ServiceWithId } from "../../features/serviceSlice";
import { CapSoWithId } from "../../features/capSoSlice";
import AvataProfile from "../profile/AvataProfile";

interface CapSoData {
  thuTu: number;
  ngayGioCap: string;
  trangThai: string;

  // Add other properties as needed from the "capSo" collection
}

const onPanelChange = (value: Dayjs, mode: CalendarMode) => {
  console.log(value.format("YYYY-MM-DD"), mode);
};

const formatDate = (dateString: string) => {
  const datePart = dateString.split(" ")[0]; // Extract the date part "YYYY-MM-DD"
  return datePart;
};
const { Option } = Select;

const Dashboard: React.FC = () => {
  const [capSoData, setCapSoData] = useState<CapSoData[]>([]);
  const [chartHeading, setChartHeading] = useState<string>("Ngày");
  const [lineChartData, setLineChartData] = useState<
    { ngayGioCap: string; count: number }[]
  >([]);
  const data: DeviceWithId[] =
    useAppSelector((state) => state.device.deviceArray) ?? [];
  const service: ServiceWithId[] =
    useAppSelector((state) => state.service.serviceArray) ?? [];
  const capso: CapSoWithId[] =
    useAppSelector((state) => state.capso.capSoList) ?? [];
  const [selectedInterval, setSelectedInterval] = useState<
    "day" | "week" | "month"
  >("day");

  const { token } = theme.useToken();

  const wrapperStyle: React.CSSProperties = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  useEffect(() => {
    // Fetch data from Firestore and update the state
    const fetchData = async () => {
      try {
        const capSoRef = collection(db, "capSo");
        const snapshot = await getDocs(capSoRef);
        const newData: CapSoData[] = snapshot.docs.map(
          (doc) => doc.data() as CapSoData
        );

        // Sort the data by "ngayGioCap" in ascending order before setting it to the state
        newData.sort((a, b) => a.ngayGioCap.localeCompare(b.ngayGioCap));

        setCapSoData(newData);

        // Calculate the count of thuTu data for each day
        const countPerDay: { [key: string]: number } = {};
        newData.forEach((item) => {
          const datePart = formatDate(item.ngayGioCap);
          if (countPerDay[datePart]) {
            countPerDay[datePart] += item.thuTu;
          } else {
            countPerDay[datePart] = item.thuTu;
          }
        });

        // Convert the countPerDay object into an array of objects
        const lineChartData = Object.keys(countPerDay).map((ngayGioCap) => ({
          ngayGioCap,
          count: countPerDay[ngayGioCap],
        }));

        // Set the line chart data state
        setLineChartData(lineChartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  // Function to handle interval change
  const handleIntervalChange = (value: "day" | "week" | "month") => {
    setSelectedInterval(value);
    switch (value) {
      case "day":
        setChartHeading("Ngày");
        break;
      case "week":
        setChartHeading("Tuần");
        break;
      case "month":
        setChartHeading("Tháng");
        break;
      default:
        setChartHeading("Ngày");
    }
  };

  // Filter data based on the selected interval
  const filteredData = () => {
    switch (selectedInterval) {
      case "week":
        return filterDataByWeek();
      case "month":
        return filterDataByMonth();
      case "day":
      default:
        return lineChartData;
    }
  };
  // Helper function to filter data by week
  const filterDataByWeek = () => {
    const now = new Date();
    const startOfCurrentWeek = startOfWeek(now);
    const endOfCurrentWeek = endOfWeek(now);

    const filtered = capSoData.filter((item) => {
      const itemDate = parseISO(item.ngayGioCap);
      return isWithinInterval(itemDate, {
        start: startOfCurrentWeek,
        end: endOfCurrentWeek,
      });
    });

    return filtered;
  };

  // Helper function to filter data by month
  const filterDataByMonth = () => {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    const filtered = capSoData.filter((item) => {
      const itemDate = parseISO(item.ngayGioCap);
      return isWithinInterval(itemDate, {
        start: startOfCurrentMonth,
        end: endOfCurrentMonth,
      });
    });

    return filtered;
  };
  const calculateThuTuCount = () => {
    // Create a set to store unique thuTu values
    const uniqueThuTus = new Set<number>();

    // Iterate through the capSoData array and add each thuTu value to the set
    capSoData.forEach((item) => uniqueThuTus.add(item.thuTu));

    // Return the count of unique thuTu values
    return uniqueThuTus.size;
  };
  // Function to calculate the count of used thuTu values
  const calculateUsedThuTuCount = () => {
    // Filter the data to get only the "đã sử dụng" (used) items
    const usedData = capSoData.filter(
      (item) => item.trangThai === "Đã sử dụng"
    );

    // Create a set to store unique thuTu values of used items
    const usedThuTus = new Set<number>();

    // Iterate through the usedData array and add each thuTu value to the set
    usedData.forEach((item) => usedThuTus.add(item.thuTu));

    // Return the count of unique thuTu values that are used
    return usedThuTus.size;
  };
  // Function to calculate the count of pending thuTu values
  const calculatePendingThuTuCount = () => {
    // Filter the data to get only the items with the "đang chờ" status
    const pendingData = capSoData.filter(
      (item) => item.trangThai === "Đang chờ"
    );

    // Return the count of items with "đang chờ" status
    return pendingData.length;
  };
  const calculateSkippedThuTuCount = () => {
    // Filter the data to get only the items with the "bỏ qua" status
    const skippedData = capSoData.filter((item) => item.trangThai === "Bỏ qua");

    // Return the count of items with "bỏ qua" status
    return skippedData.length;
  };

  //Trạng thái "Hoạt động" của Thiết bị
  const filterDataByHoatDong = () => {
    return (
      data?.filter((device) => device.device.trangThaiHd === "Hoạt động") ?? []
    );
  };

  //Trạng thái "Ngưng hoạt động"của Thiết bị
  const filterDataByNgungHoatDong = () => {
    return (
      data?.filter(
        (device) => device.device.trangThaiHd === "Ngưng hoạt động"
      ) ?? []
    );
  };

  //Trạng thái "Hoạt động" của Dịch vụ
  const filterServiceByHoatDong = () => {
    return (
      service?.filter((service) => service.service.trangThai === "Hoạt động") ??
      []
    );
  };

  //Trạng thái "Ngưng hoạt động"của dịch vụ
  const filterServiceByNgungHoatDong = () => {
    return (
      service?.filter(
        (service) => service.service.trangThai === "Ngưng hoạt động"
      ) ?? []
    );
  };

  //Trạng thái "Đang chờ" của cấp số
  const filterCapSoDangCho = () => {
    return capso?.filter((capso) => capso.capSo.trangThai === "Đang chờ") ?? [];
  };

  //Trạng thái "Đã sử dụng"của cấp số
  const filterCapSoDaSuDung = () => {
    return (
      capso?.filter((capso) => capso.capSo.trangThai === "Đã sử dụng") ?? []
    );
  };

  //Trạng thái "Bỏ qua"của cấp số
  const filterBoQua = () => {
    return capso?.filter((capso) => capso.capSo.trangThai === "Bỏ qua") ?? [];
  };

  return (
    <Layout>
      <Sider>
        <Menu />
      </Sider>

      <Layout>
        <Row>
          <Col span={16}>
            <Header style={{ backgroundColor: "#f5f5f5" }}>
              <div
                style={{
                  fontSize: 15,
                  textAlign: "start",
                  color: "orange",
                }}
              >
                <p style={{ fontWeight: 500, color: "orange" }}>Dashboar</p>
              </div>
            </Header>
            <Content
              style={{
                margin: "24px 16px 0",
              }}
            >
              <p
                style={{
                  fontSize: 25,
                  fontWeight: 500,
                  color: "orange",
                  textAlign: "start",
                }}
              >
                Biểu đồ cấp số
              </p>
              <Row gutter={16}>
                <Col span={6}>
                  <Card bordered={false} style={{ height: 177 }}>
                    <Meta
                      avatar={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="38"
                          height="38"
                          viewBox="0 0 49 48"
                          fill="none"
                        >
                          <circle
                            opacity="0.15"
                            cx="24.25"
                            cy="24"
                            r="23.5"
                            fill="#6695FB"
                            stroke="#DADADA"
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            x="12.625"
                            y="12"
                          >
                            <g clip-path="url(#clip0_82034_4514)">
                              <path
                                d="M5.25 0C5.44891 0 5.63968 0.0790176 5.78033 0.21967C5.92098 0.360322 6 0.551088 6 0.75V1.5H18V0.75C18 0.551088 18.079 0.360322 18.2197 0.21967C18.3603 0.0790176 18.5511 0 18.75 0C18.9489 0 19.1397 0.0790176 19.2803 0.21967C19.421 0.360322 19.5 0.551088 19.5 0.75V1.5H21C21.7956 1.5 22.5587 1.81607 23.1213 2.37868C23.6839 2.94129 24 3.70435 24 4.5V21C24 21.7956 23.6839 22.5587 23.1213 23.1213C22.5587 23.6839 21.7956 24 21 24H3C2.20435 24 1.44129 23.6839 0.87868 23.1213C0.316071 22.5587 0 21.7956 0 21V4.5C0 3.70435 0.316071 2.94129 0.87868 2.37868C1.44129 1.81607 2.20435 1.5 3 1.5H4.5V0.75C4.5 0.551088 4.57902 0.360322 4.71967 0.21967C4.86032 0.0790176 5.05109 0 5.25 0V0ZM1.5 6V21C1.5 21.3978 1.65804 21.7794 1.93934 22.0607C2.22064 22.342 2.60218 22.5 3 22.5H21C21.3978 22.5 21.7794 22.342 22.0607 22.0607C22.342 21.7794 22.5 21.3978 22.5 21V6H1.5Z"
                                fill="#6493F9"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_82034_4514">
                                <rect width="24" height="24" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </svg>
                      }
                      description="Số thứ tự đã cấp"
                    />
                    <p>{calculateThuTuCount()}</p>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card bordered={false}>
                    <Meta
                      avatar={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="38"
                          height="38"
                          viewBox="0 0 49 48"
                          fill="none"
                        >
                          <circle
                            opacity="0.15"
                            cx="24.25"
                            cy="24"
                            r="23.5"
                            fill="#35C75A"
                            stroke="#DADADA"
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="24"
                            viewBox="0 0 25 24"
                            fill="none"
                            x="12.625"
                            y="12"
                          >
                            <g clip-path="url(#clip0_82034_4486)">
                              <path
                                d="M17.031 10.7194C17.1008 10.789 17.1562 10.8718 17.194 10.9629C17.2318 11.054 17.2513 11.1517 17.2513 11.2504C17.2513 11.349 17.2318 11.4467 17.194 11.5378C17.1562 11.6289 17.1008 11.7117 17.031 11.7814L12.531 16.2814C12.4613 16.3512 12.3785 16.4066 12.2874 16.4444C12.1963 16.4822 12.0986 16.5017 12 16.5017C11.9013 16.5017 11.8036 16.4822 11.7125 16.4444C11.6214 16.4066 11.5386 16.3512 11.469 16.2814L9.21897 14.0314C9.14924 13.9616 9.09392 13.8788 9.05619 13.7877C9.01845 13.6966 8.99902 13.599 8.99902 13.5004C8.99902 13.4017 9.01845 13.3041 9.05619 13.213C9.09392 13.1219 9.14924 13.0391 9.21897 12.9694C9.3598 12.8285 9.55081 12.7494 9.74997 12.7494C9.84859 12.7494 9.94624 12.7688 10.0373 12.8066C10.1285 12.8443 10.2112 12.8996 10.281 12.9694L12 14.6899L15.969 10.7194C16.0386 10.6495 16.1214 10.5941 16.2125 10.5563C16.3036 10.5185 16.4013 10.499 16.5 10.499C16.5986 10.499 16.6963 10.5185 16.7874 10.5563C16.8785 10.5941 16.9613 10.6495 17.031 10.7194Z"
                                fill="#35C75A"
                              />
                              <path
                                d="M6 0C6.19891 0 6.38968 0.0790176 6.53033 0.21967C6.67098 0.360322 6.75 0.551088 6.75 0.75V1.5H18.75V0.75C18.75 0.551088 18.829 0.360322 18.9697 0.21967C19.1103 0.0790176 19.3011 0 19.5 0C19.6989 0 19.8897 0.0790176 20.0303 0.21967C20.171 0.360322 20.25 0.551088 20.25 0.75V1.5H21.75C22.5456 1.5 23.3087 1.81607 23.8713 2.37868C24.4339 2.94129 24.75 3.70435 24.75 4.5V21C24.75 21.7956 24.4339 22.5587 23.8713 23.1213C23.3087 23.6839 22.5456 24 21.75 24H3.75C2.95435 24 2.19129 23.6839 1.62868 23.1213C1.06607 22.5587 0.75 21.7956 0.75 21V4.5C0.75 3.70435 1.06607 2.94129 1.62868 2.37868C2.19129 1.81607 2.95435 1.5 3.75 1.5H5.25V0.75C5.25 0.551088 5.32902 0.360322 5.46967 0.21967C5.61032 0.0790176 5.80109 0 6 0V0ZM2.25 6V21C2.25 21.3978 2.40804 21.7794 2.68934 22.0607C2.97064 22.342 3.35218 22.5 3.75 22.5H21.75C22.1478 22.5 22.5294 22.342 22.8107 22.0607C23.092 21.7794 23.25 21.3978 23.25 21V6H2.25Z"
                                fill="#35C75A"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_82034_4486">
                                <rect
                                  width="24"
                                  height="24"
                                  fill="white"
                                  transform="translate(0.75)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </svg>
                      }
                      description="Số thứ tự đã sử dụng"
                    />
                    <p>{calculateUsedThuTuCount()}</p>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card bordered={false} style={{ height: 177 }}>
                    <Meta
                      avatar={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="38"
                          height="38"
                          viewBox="0 0 49 48"
                          fill="none"
                        >
                          <circle
                            opacity="0.15"
                            cx="24.25"
                            cy="24"
                            r="23.5"
                            fill="#FFAC6A"
                            stroke="#DADADA"
                          />

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="24"
                            viewBox="0 0 25 24"
                            fill="none"
                            x="12.625"
                            y="12"
                          >
                            <path
                              d="M19.2506 8.9625L20.1551 8.058C20.2769 7.93778 20.4309 7.85549 20.5985 7.82114C20.7662 7.78679 20.9401 7.80185 21.0994 7.8645L22.2019 8.304C22.3629 8.36959 22.5008 8.48137 22.5984 8.62525C22.696 8.76913 22.7488 8.93867 22.7501 9.1125V11.1315C22.7481 11.3637 22.654 11.5856 22.4885 11.7485C22.323 11.9113 22.0996 12.0018 21.8674 12L21.8299 11.9985C14.1079 11.5185 12.5501 4.977 12.2554 2.4735C12.2426 2.35915 12.2526 2.24341 12.2846 2.1329C12.3166 2.02239 12.3701 1.91927 12.442 1.82942C12.5138 1.73958 12.6027 1.66477 12.7035 1.60928C12.8043 1.55379 12.915 1.51869 13.0294 1.506C13.0632 1.50199 13.0973 1.49998 13.1314 1.5H15.0814C15.2553 1.50063 15.425 1.55323 15.5688 1.65106C15.7126 1.74888 15.8239 1.88746 15.8884 2.049L16.3286 3.1515C16.3934 3.31023 16.4099 3.48452 16.3761 3.65259C16.3424 3.82066 16.2599 3.97506 16.1389 4.0965L15.2344 5.001C15.2344 5.001 15.7549 8.526 19.2506 8.9625Z"
                              fill="#FFAC6A"
                            />
                            <path
                              d="M12.25 22.5H10.75V18.75C10.7494 18.1534 10.5122 17.5815 10.0903 17.1597C9.6685 16.7378 9.09655 16.5006 8.5 16.5H5.5C4.90345 16.5006 4.3315 16.7378 3.90967 17.1597C3.48784 17.5815 3.2506 18.1534 3.25 18.75V22.5H1.75V18.75C1.75119 17.7558 2.14666 16.8027 2.84966 16.0997C3.55267 15.3967 4.5058 15.0012 5.5 15H8.5C9.4942 15.0012 10.4473 15.3967 11.1503 16.0997C11.8533 16.8027 12.2488 17.7558 12.25 18.75V22.5Z"
                              fill="#FFAC6A"
                            />
                            <path
                              d="M7 7.5C7.44501 7.5 7.88002 7.63196 8.25004 7.87919C8.62005 8.12643 8.90843 8.47783 9.07873 8.88896C9.24903 9.3001 9.29359 9.7525 9.20677 10.189C9.11995 10.6254 8.90566 11.0263 8.59099 11.341C8.27632 11.6557 7.87541 11.87 7.43896 11.9568C7.0025 12.0436 6.5501 11.999 6.13896 11.8287C5.72783 11.6584 5.37643 11.37 5.1292 11C4.88196 10.63 4.75 10.195 4.75 9.75C4.75 9.15326 4.98705 8.58097 5.40901 8.15901C5.83097 7.73705 6.40326 7.5 7 7.5ZM7 6C6.25832 6 5.5333 6.21993 4.91661 6.63199C4.29993 7.04404 3.81928 7.62971 3.53545 8.31494C3.25162 9.00016 3.17736 9.75416 3.32206 10.4816C3.46675 11.209 3.8239 11.8772 4.34835 12.4017C4.8728 12.9261 5.54098 13.2833 6.26841 13.4279C6.99584 13.5726 7.74984 13.4984 8.43506 13.2145C9.12029 12.9307 9.70596 12.4501 10.118 11.8334C10.5301 11.2167 10.75 10.4917 10.75 9.75C10.75 9.25754 10.653 8.76991 10.4646 8.31494C10.2761 7.85997 9.99987 7.44657 9.65165 7.09835C9.30343 6.75013 8.89004 6.47391 8.43506 6.28545C7.98009 6.097 7.49246 6 7 6Z"
                              fill="#FFAC6A"
                            />
                          </svg>
                        </svg>
                      }
                      description="Số thứ tự đang chờ"
                    />

                    <p>{calculatePendingThuTuCount()}</p>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card bordered={false} style={{ height: 177 }}>
                    <Meta
                      avatar={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="38"
                          height="38"
                          viewBox="0 0 49 48"
                          fill="none"
                        >
                          <circle
                            opacity="0.15"
                            cx="24.25"
                            cy="24"
                            r="23.5"
                            fill="#F86D6D"
                            stroke="#DADADA"
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="24"
                            viewBox="0 0 25 24"
                            fill="none"
                            x="12.625"
                            y="12"
                          >
                            <path
                              d="M12.26 6.15C12.2819 6.10502 12.316 6.06711 12.3584 6.04058C12.4009 6.01406 12.4499 6 12.5 6C12.55 6 12.599 6.01406 12.6415 6.04058C12.6839 6.06711 12.718 6.10502 12.74 6.15L13.691 8.0775C13.71 8.11649 13.7382 8.15025 13.7733 8.17587C13.8083 8.20148 13.849 8.21817 13.892 8.2245L16.022 8.5335C16.2395 8.565 16.328 8.8335 16.169 8.988L14.63 10.4895C14.5989 10.5198 14.5757 10.5572 14.5624 10.5985C14.549 10.6398 14.546 10.6838 14.5535 10.7265L14.9165 12.8475C14.9246 12.8965 14.9189 12.9468 14.9001 12.9927C14.8813 13.0386 14.85 13.0784 14.8098 13.1075C14.7696 13.1367 14.722 13.154 14.6725 13.1576C14.623 13.1613 14.5735 13.151 14.5295 13.128L12.6245 12.126C12.5863 12.106 12.5438 12.0956 12.5007 12.0956C12.4576 12.0956 12.4151 12.106 12.377 12.126L10.472 13.128C10.428 13.1506 10.3786 13.1605 10.3294 13.1567C10.2801 13.1529 10.2328 13.1355 10.1929 13.1064C10.1529 13.0773 10.1218 13.0377 10.103 12.992C10.0842 12.9463 10.0785 12.8963 10.0865 12.8475L10.4495 10.7265C10.4571 10.6839 10.4543 10.64 10.4412 10.5987C10.4282 10.5575 10.4052 10.52 10.3745 10.4895L8.82945 8.988C8.79406 8.95325 8.76905 8.90934 8.75722 8.86117C8.74539 8.81301 8.74721 8.7625 8.76247 8.71531C8.77773 8.66812 8.80584 8.62612 8.84363 8.59401C8.88143 8.56189 8.92742 8.54094 8.97645 8.5335L11.1065 8.2245C11.1494 8.21817 11.1901 8.20148 11.2251 8.17587C11.2602 8.15025 11.2884 8.11649 11.3075 8.0775L12.26 6.15Z"
                              fill="#F86D6D"
                            />
                            <path
                              d="M3.5 3C3.5 2.20435 3.81607 1.44129 4.37868 0.87868C4.94129 0.316071 5.70435 0 6.5 0L18.5 0C19.2956 0 20.0587 0.316071 20.6213 0.87868C21.1839 1.44129 21.5 2.20435 21.5 3V23.25C21.4999 23.3857 21.4631 23.5188 21.3933 23.6351C21.3236 23.7515 21.2236 23.8468 21.104 23.9108C20.9844 23.9748 20.8497 24.0052 20.7142 23.9988C20.5787 23.9923 20.4474 23.9492 20.3345 23.874L12.5 19.6515L4.6655 23.874C4.55256 23.9492 4.42135 23.9923 4.28584 23.9988C4.15033 24.0052 4.0156 23.9748 3.896 23.9108C3.7764 23.8468 3.67641 23.7515 3.60667 23.6351C3.53694 23.5188 3.50007 23.3857 3.5 23.25V3ZM6.5 1.5C6.10218 1.5 5.72064 1.65804 5.43934 1.93934C5.15804 2.22064 5 2.60218 5 3V21.849L12.0845 18.126C12.2076 18.0441 12.3521 18.0004 12.5 18.0004C12.6479 18.0004 12.7924 18.0441 12.9155 18.126L20 21.849V3C20 2.60218 19.842 2.22064 19.5607 1.93934C19.2794 1.65804 18.8978 1.5 18.5 1.5H6.5Z"
                              fill="#F86D6D"
                            />
                          </svg>
                        </svg>
                      }
                      description="Số thứ tự bỏ qua"
                    />
                    <p>{calculateSkippedThuTuCount()}</p>
                  </Card>
                </Col>
              </Row>

              <Card style={{ top: 35 }}>
                <Row>
                  <Col span={16}>
                    <h2>Bảng thông kê theo {chartHeading}</h2>
                  </Col>
                  <Col span={8} style={{ top: 17, left: 90 }}>
                    <Select
                      defaultValue="day"
                      style={{ width: 120 }}
                      onChange={handleIntervalChange}
                    >
                      <Option value="day">Ngày</Option>
                      <Option value="week">Tuần</Option>
                      <Option value="month">Tháng</Option>
                    </Select>
                  </Col>
                </Row>
                <LineChart width={500} height={300} data={filteredData()}>
                  <XAxis dataKey="ngayGioCap" tickFormatter={formatDate} />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  {/* Using the calculated data in the line chart */}
                  <Line dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </Card>
            </Content>
          </Col>

          <Col span={8}>
            <Layout>
              <Header style={{ backgroundColor: "#f5f5f5" }}>
                <div style={{ marginLeft: -250 }}>
                  <AvataProfile />
                </div>
              </Header>
              <Content style={{ backgroundColor: "white" }}>
                <p
                  style={{
                    fontSize: 25,
                    fontWeight: 500,
                    color: "orange",
                    textAlign: "start",
                    marginLeft: 15,
                  }}
                >
                  Tổng quan
                </p>
                <Row>
                  <Col span={24}>
                    <Card bordered={false}>
                      <Row>
                        <Col span={5}>
                          <Progress
                            type="circle"
                            percent={
                              (filterDataByHoatDong().length / data?.length ??
                                0) * 100
                            }
                            size={50}
                            strokeColor={{ "100%": "#ffa940" }}
                          />
                        </Col>
                        <Col span={7}>
                          {filterDataByHoatDong().length +
                            filterDataByNgungHoatDong().length}
                          <br />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M3.75663 1.16699H10.2375C12.3141 1.16699 12.8333 1.68616 12.8333 3.75699V7.44949C12.8333 9.52616 12.3141 10.0395 10.2433 10.0395H3.75663C1.68579 10.0453 1.16663 9.52616 1.16663 7.45533V3.75699C1.16663 1.68616 1.68579 1.16699 3.75663 1.16699Z"
                              stroke="#FF7506"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M7 10.0449V12.8333"
                              stroke="#FF7506"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M1.16663 7.58301H12.8333"
                              stroke="#FF7506"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M4.375 12.833H9.625"
                              stroke="#FF7506"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          <a style={{ marginLeft: 5, color: "orange" }}>
                            Thiết bị
                          </a>
                        </Col>
                        <Col span={12}>
                          <div>
                            <div>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "8px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: "orange",
                                  marginRight: "5px",
                                }}
                              ></span>
                              <a style={{ color: "black" }}>
                                Hoạt động: {filterDataByHoatDong().length}
                              </a>
                            </div>
                            <div>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "8px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: "black",
                                  marginRight: "5px",
                                }}
                              ></span>
                              <a style={{ color: "black" }}>
                                Ngưng hoạt động:
                                {filterDataByNgungHoatDong().length}
                              </a>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
                <Row style={{ paddingTop: 15 }}>
                  <Col span={24}>
                    <Card bordered={false}>
                      <Row>
                        <Col span={5}>
                          <Progress
                            type="circle"
                            percent={
                              (filterServiceByHoatDong().length /
                                data?.length ?? 0) * 100
                            }
                            size={50}
                            strokeColor={{ "100%": "#1677ff" }}
                          />
                        </Col>
                        <Col span={7}>
                          {filterServiceByHoatDong().length +
                            filterServiceByNgungHoatDong().length}
                          <br />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="15"
                            viewBox="0 0 16 15"
                            fill="none"
                          >
                            <path
                              d="M14.7707 5.7304C14.7707 7.04284 14.0594 8.22267 12.9268 9.04368C12.8876 9.07098 12.8661 9.11778 12.8641 9.16459L12.8151 10.4419C12.8092 10.6135 12.6192 10.713 12.4742 10.6213L11.3867 9.94074C11.3867 9.94074 11.3867 9.94074 11.3847 9.94074C11.322 9.89978 11.2456 9.88808 11.175 9.90954C10.5284 10.1104 9.82497 10.2216 9.08821 10.2216C9.07841 10.2216 9.06862 10.2216 9.05882 10.2216C9.07841 10.0928 9.08821 9.96219 9.08821 9.82958C9.08821 7.99841 7.21104 6.51436 4.89496 6.51436C4.41881 6.51436 3.96226 6.57676 3.53509 6.69182C3.44888 6.38175 3.40381 6.05802 3.40381 5.7265C3.40381 3.24398 5.94719 1.2334 9.08625 1.2334C12.2273 1.2373 14.7707 3.24983 14.7707 5.7304Z"
                              stroke="#4277FF"
                              stroke-width="1.10526"
                              stroke-miterlimit="10"
                            />
                            <path
                              d="M3.537 6.69531C1.88909 7.14189 0.703613 8.37828 0.703613 9.83308C0.703613 10.8003 1.22875 11.6721 2.06348 12.2785C2.09287 12.3 2.10855 12.3331 2.11051 12.3682L2.14578 13.3102C2.1497 13.4369 2.29078 13.5091 2.39855 13.4428L3.20193 12.9396C3.20781 12.9357 3.21564 12.9299 3.22152 12.926C3.25091 12.9026 3.2901 12.8948 3.32537 12.9065C3.81132 13.0625 4.34038 13.1483 4.89686 13.1483C7.04443 13.1483 8.81579 11.871 9.06072 10.2251"
                              stroke="#4277FF"
                              stroke-width="1.10526"
                              stroke-miterlimit="10"
                            />
                          </svg>

                          <a style={{ marginLeft: 5, color: "#1677ff" }}>
                            Dịch vụ
                          </a>
                        </Col>
                        <Col span={12}>
                          <div>
                            <div>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "8px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: "blue",
                                  marginRight: "5px",
                                }}
                              ></span>
                              <a style={{ color: "black" }}>
                                Hoạt động: {filterServiceByHoatDong().length}
                              </a>
                            </div>
                            <div>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "8px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: "black",
                                  marginRight: "5px",
                                }}
                              ></span>
                              <a style={{ color: "black" }}>
                                Ngưng hoạt động:
                                {filterServiceByNgungHoatDong().length}
                              </a>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
                <Row style={{ paddingTop: 15 }}>
                  <Col span={24}>
                    <Card bordered={false}>
                      <Row>
                        <Col span={5}>
                          <Progress
                            type="circle"
                            percent={
                              (filterCapSoDangCho().length / data?.length ??
                                0) * 100
                            }
                            size={50}
                            strokeColor={{ "100%": "#87d068" }}
                          />
                        </Col>
                        <Col span={7}>
                          {filterCapSoDangCho().length +
                            filterCapSoDaSuDung().length +
                            filterBoQua().length}
                          <br />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_201_18603)">
                              <path
                                d="M1.16663 9.91699L6.99996 12.8337L12.8333 9.91699"
                                stroke="#35C75A"
                                stroke-width="1.16667"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M1.16663 7L6.99996 9.91667L12.8333 7"
                                stroke="#35C75A"
                                stroke-width="1.16667"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M6.99996 1.16699L1.16663 4.08366L6.99996 7.00033L12.8333 4.08366L6.99996 1.16699Z"
                                stroke="#35C75A"
                                stroke-width="1.16667"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_201_18603">
                                <rect width="14" height="14" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>

                          <a style={{ marginLeft: 5, color: "#87d068" }}>
                            Cấp số
                          </a>
                        </Col>
                        <Col span={12}>
                          <div>
                            <div>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "8px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: "green",
                                  marginRight: "5px",
                                }}
                              ></span>
                              <a style={{ color: "black" }}>
                                Đang chờ: {filterCapSoDangCho().length}
                              </a>
                            </div>
                            <div>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "8px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: "black",
                                  marginRight: "5px",
                                }}
                              ></span>
                              <a style={{ color: "black" }}>
                                Đã sử dụng:
                                {filterCapSoDaSuDung().length}
                              </a>
                            </div>
                            <div>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "8px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: "red",
                                  marginRight: "5px",
                                }}
                              ></span>
                              <a style={{ color: "black" }}>
                                Bỏ qua:
                                {filterBoQua().length}
                              </a>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
                <div style={wrapperStyle}>
                  <Calendar fullscreen={false} onPanelChange={onPanelChange} />
                </div>
              </Content>
            </Layout>
          </Col>
        </Row>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
