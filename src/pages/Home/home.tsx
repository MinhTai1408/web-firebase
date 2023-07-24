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
                  <Card bordered={false} style={{ height: 155 }}>
                    <Meta
                      avatar={
                        <FontAwesomeIcon
                          icon={faCalendar}
                          style={{
                            fontSize: 20,
                            borderRadius: "80%",
                            background: "#69b1ff",
                            color: "white",
                            padding: "5px",
                          }}
                        />
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
                        <FontAwesomeIcon
                          icon={faCalendarCheck}
                          style={{
                            fontSize: 20,
                            borderRadius: "80%",
                            background: "#95de64",
                            color: "white",
                            padding: "5px",
                          }}
                        />
                      }
                      description="Số thứ tự đã sử dụng"
                    />
                    <p>{calculateUsedThuTuCount()}</p>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card bordered={false} style={{ height: 155 }}>
                    <Meta
                      avatar={
                        <FontAwesomeIcon
                          icon={faCalendar}
                          style={{
                            fontSize: 20,
                            borderRadius: "80%",
                            background: "#ffd591",
                            color: "white",
                            padding: "5px",
                          }}
                        />
                      }
                      description="Số thứ tự đang chờ"
                    />
                    <p>{calculatePendingThuTuCount()}</p>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card bordered={false} style={{ height: 155 }}>
                    <Meta
                      avatar={
                        <FontAwesomeIcon
                          icon={faCalendar}
                          style={{
                            fontSize: 20,
                            borderRadius: "80%",
                            background: "#ffa39e",
                            color: "white",
                            padding: "5px",
                          }}
                        />
                      }
                      description="Số thứ tự bỏ qua"
                    />
                    <p>{calculateSkippedThuTuCount()}</p>
                  </Card>
                </Col>
              </Row>

              <Form style={{ backgroundColor: "white" }}>
                <div>
                  <h2>Biểu đồ thông kê gợn sóng</h2>
                  <Select
                    defaultValue="day"
                    style={{ width: 120 }}
                    onChange={handleIntervalChange}
                  >
                    <Option value="day">Ngày</Option>
                    <Option value="week">Tuần</Option>
                    <Option value="month">Tháng</Option>
                  </Select>
                  <LineChart width={500} height={300} data={filteredData()}>
                    <XAxis dataKey="ngayGioCap" tickFormatter={formatDate} />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    {/* Using the calculated data in the line chart */}
                    <Line
                      dataKey="count"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </div>
              </Form>
            </Content>
          </Col>
          <Col span={8}>
            <Layout>
              <Header style={{ backgroundColor: "white" }}></Header>
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
                <Row gutter={16}>
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
                          <DesktopOutlined style={{ color: "orange" }} />
                          <a style={{ marginLeft: 5, color: "orange" }}>
                            Thiết bị
                          </a>
                        </Col>
                        <Col span={11}>
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
                          <FontAwesomeIcon
                            icon={faComments}
                            style={{ color: "#1677ff" }}
                          />

                          <a style={{ marginLeft: 5, color: "#1677ff" }}>
                            Dịch vụ
                          </a>
                        </Col>
                        <Col span={11}>
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
                          <FontAwesomeIcon
                            icon={faLayerGroup}
                            style={{ color: "#87d068" }}
                          />

                          <a style={{ marginLeft: 5, color: "#87d068" }}>
                            Cấp số
                          </a>
                        </Col>
                        <Col span={11}>
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
