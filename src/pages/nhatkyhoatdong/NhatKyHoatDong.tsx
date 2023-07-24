import React, { useEffect, useState } from "react";
import {
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Pagination,
  Row,
  Space,
  Table,
} from "antd";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../Firebase";
import { useAppSelector } from "../../hooks/storeHook";
import Layout, { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import Menu from "../Menu/Menu";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import NotificationPopover from "../profile/Notifications";
import AvataProfile from "../profile/AvataProfile";

interface ActivityLog {
  id: string;
  email: string;
  timestamp: string;
  ip: string;
  action: string;
}

const NhatKyHoatDong: React.FC = () => {
  const PAGE_SIZE = 4; // Number of items to show per page
  const [searchEmail, setSearchEmail] = useState<string>(""); // New state for search keyword
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const { user } = useAppSelector((state) => state.auth);
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };
  // Fetch user's activity log from Firestore
  useEffect(() => {
    const fetchActivityLog = async () => {
      try {
        const activityLogData: ActivityLog[] = [];
        const q = query(
          collection(db, "activityLog"),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          activityLogData.push({
            id: doc.id,
            email: data.email,
            timestamp: data.timestamp,
            ip: data.ip,
            action: data.action,
          });
        });

        // Apply the filter based on the search keyword (email)
        const filteredActivityLog = activityLogData.filter((log) =>
          log.email.includes(searchEmail)
        );

        setActivityLog(filteredActivityLog);
      } catch (error) {
        console.error("Error fetching activity log:", error);
      }
    };
    fetchActivityLog();
  }, [searchEmail]); // Run the effect whenever the searchEmail changes
  const columns = [
    {
      title: "Tên Đăng Nhập (Email)",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Thời Gian",
      dataIndex: "timestamp",
      key: "timestamp",
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: "Thao Tác",
      dataIndex: "action",
      key: "action",
    },
  ];
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentActivityLog = activityLog.slice(startIndex, endIndex);
  return (
    <Layout>
      <Sider>
        <Menu />
      </Sider>
      <Layout>
        <Header style={{ backgroundColor: "#f5f5f5" }}>
          <Row>
            <Col span={8}>
              <div
                style={{
                  fontSize: 15,
                  textAlign: "start",
                  color: "orange",
                }}
              >
                <p style={{ fontWeight: 500, color: "black" }}>
                  Cài đặt hệ thống &gt;
                  <Link to="#" style={{ color: "orange", left: 5 }}>
                    Nhật ký sử dụng
                  </Link>
                </p>
              </div>
            </Col>
            <Col span={16}>
              <AvataProfile />
            </Col>
          </Row>
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>
          <Row>
            <Col span={19}>
              <Form.Item label="Chọn thời gian " />
              <Space direction="vertical">
                <DatePicker onChange={onChange} />
              </Space>{" "}
              &gt;{" "}
              <Space direction="vertical">
                <DatePicker onChange={onChange} />
              </Space>
            </Col>
            <Col span={5}>
              <Form.Item label="Từ khóa" />
              <Input
                placeholder="Nhập từ khóa"
                prefix={<SearchOutlined style={{ color: "orange" }} />}
                value={searchEmail} // Bind the input value to the state variable
                onChange={(e) => setSearchEmail(e.target.value)} // Update the state on input change
              />
            </Col>
          </Row>
          <Row style={{ paddingTop: 20 }}>
            <Col span={24}>
              <Table
                dataSource={currentActivityLog}
                columns={columns}
                rowKey="id"
                pagination={false}
              />
              <Pagination
                style={{ paddingTop: 15, textAlign: "end" }}
                current={currentPage}
                pageSize={PAGE_SIZE}
                total={activityLog.length}
                onChange={(page) => setCurrentPage(page)}
              />
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default NhatKyHoatDong;
