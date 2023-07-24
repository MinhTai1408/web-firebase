import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ServiceWithId } from "../../features/serviceSlice";
import { useAppSelector } from "../../hooks/storeHook";
import {
  Button,
  Card,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Layout,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import Sider from "antd/es/layout/Sider";
import Menu from "../../pages/Menu/Menu";
import { Content, Header } from "antd/es/layout/layout";
import { RollbackOutlined, SearchOutlined } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import AvataProfile from "../../pages/profile/AvataProfile";
interface RouteParams {
  [key: string]: string | undefined;
  id: string;
}

const ReadService: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [sortedData, setSortedData] = useState<ServiceWithId[]>([]);
  const [service, setService] = useState<ServiceWithId | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedHd, setSelectedHd] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
  });

  const serviceArray: ServiceWithId[] | undefined = useAppSelector(
    (state) => state.service.serviceArray
  );
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  useEffect(() => {
    const selectedService = serviceArray?.find((service) => service.id === id);
    setService(selectedService ?? null);
    // Sort the data by maDvCap in ascending order
    const sortedArray = [...serviceArray].sort((a, b) =>
      a.service.maDvCap.localeCompare(b.service.maDvCap)
    );
    setSortedData(sortedArray);
  }, [serviceArray, id]);
  const getColorForTrangThai = (trangThai: string | undefined) => {
    switch (trangThai) {
      case "Ngưng hoạt động":
        return "red"; // Chấm màu xanh lá cây
      case "Hoạt động":
        return "green"; // Chấm màu xanh nước biển

      default:
        return "gray"; // Mặc định là chấm màu xám (nếu không có trạng thái hợp lệ)
    }
  };

  const columns = [
    {
      title: "Mã dịch vụ cấp",
      dataIndex: ["service", "maDvCap"],
      key: "maDvCap",
    },
    {
      title: "Trạng thái",
      dataIndex: ["service", "trangThai"],
      key: "trangThai",
      render: (trangThai: string | undefined) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: getColorForTrangThai(trangThai),
              marginRight: 8,
            }}
          />
          {trangThai}
        </div>
      ),
    },
  ];

  const filteredData = sortedData
    .filter((item) =>
      item.service.maDvCap.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((item) =>
      selectedHd ? item.service?.trangThai === selectedHd : true
    );
  const totalItems = filteredData?.length ?? 0;
  const startIndex = (pagination.current - 1) * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;
  const paginatedData = filteredData?.slice(startIndex, endIndex);

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const dataSource = paginatedData?.map((item) => ({
    ...item,
    trangThai: Math.random() < 0.5 ? "Đang thực hiện" : "Đã hoàn thành",
  }));

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
                  Dịch vụ &gt;
                  <Link to="/service" style={{ color: "black", left: 5 }}>
                    Danh sách dịch vụ &gt;
                  </Link>
                  <Link to="#" style={{ color: "orange", left: 5 }}>
                    Chi tiết
                  </Link>
                </p>
              </div>
            </Col>
            <Col span={16}>
              <AvataProfile />
            </Col>
          </Row>
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
            display: "flex",
            flexDirection: "column",
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
            Quản lý dịch vụ
          </p>

          <Row gutter={16}>
            <Col span={6}>
              <Content style={{ backgroundColor: "white" }}>
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 400,
                    color: "orange",
                    textAlign: "start",
                    marginLeft: 15,
                  }}
                >
                  Thông tin dịch vụ
                </p>
                {service && (
                  <div style={{ marginLeft: 15 }}>
                    <p>Mã dịch vụ: {service.service.maDv}</p>
                    <p>Tên dịch vụ: {service.service.tenDv}</p>
                    <p>Mô tả: {service.service.moTa}</p>
                  </div>
                )}
              </Content>
            </Col>
            <Col span={16}>
              <Layout>
                <Content style={{ backgroundColor: "white" }}>
                  <Row>
                    <Col span={24}>
                      <Row gutter={16}>
                        <Col span={4}>
                          <Form.Item label="Trạng thái" />
                          <Select
                            showSearch
                            style={{ width: 120 }}
                            placeholder="Tất cả"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label ?? "").includes(input)
                            }
                            filterSort={(optionA, optionB) =>
                              (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "").toLowerCase()
                                )
                            }
                            options={[
                              {
                                value: null,
                                label: "Tất cả",
                              },
                              {
                                value: "Hoạt động",
                                label: "Hoạt động",
                              },
                              {
                                value: "Ngưng hoạt động",
                                label: "Ngưng hoạt động",
                              },
                            ]}
                            onChange={(value) => setSelectedHd(value)}
                          />
                        </Col>
                        <Col span={11} style={{ marginLeft: 25 }}>
                          <Form.Item label="Chọn thời gian " />
                          <Space direction="vertical">
                            <DatePicker
                              onChange={onChange}
                              style={{ width: 120 }}
                            />
                          </Space>
                          &gt;
                          <Space direction="vertical">
                            <DatePicker
                              onChange={onChange}
                              style={{ width: 120 }}
                            />
                          </Space>
                        </Col>
                        <Col span={7}>
                          <Form.Item label="Từ khóa" />
                          <Input
                            placeholder="Nhập từ khóa"
                            prefix={
                              <SearchOutlined style={{ color: "orange" }} />
                            }
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Table
                    columns={columns}
                    dataSource={dataSource}
                    onChange={handleTableChange}
                    pagination={{ ...pagination, total: totalItems }}
                    style={{ paddingTop: 15 }}
                  />
                </Content>
              </Layout>
            </Col>
            <Col span={2}>
              <Card
                style={{ width: 70, height: 90, backgroundColor: "#ffc069" }}
              >
                <Link to={`/edit-service/${id}`}>
                  <Meta
                    avatar={
                      <FontAwesomeIcon
                        icon={faPen}
                        style={{
                          fontSize: 15,
                          borderRadius: "30%",
                          background: "#fa8c16",
                          color: "white",
                          padding: "5px",
                        }}
                      />
                    }
                  />
                  <a>Cập nhật </a>
                </Link>
              </Card>
              <Card
                bordered={false}
                style={{ width: 70, height: 120, backgroundColor: "#ffc069" }}
              >
                <Link to="/service">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="29"
                    viewBox="0 0 28 29"
                    fill="none"
                  >
                    <path
                      d="M18.8885 2.54004H9.1235C4.86516 2.54004 2.3335 5.07171 2.3335 9.31837V19.0834C2.3335 23.33 4.86516 25.8617 9.11183 25.8617H18.8768C23.1235 25.8617 25.6552 23.33 25.6552 19.0834V9.31837C25.6668 5.07171 23.1352 2.54004 18.8885 2.54004Z"
                      fill="#FF7506"
                    />
                    <path
                      d="M16.2398 10.1H10.2315L10.6165 9.71503C10.9548 9.37669 10.9548 8.81669 10.6165 8.47836C10.2782 8.14003 9.71818 8.14003 9.37985 8.47836L7.54818 10.31C7.20985 10.6484 7.20985 11.2084 7.54818 11.5467L9.37985 13.3784C9.55485 13.5534 9.77652 13.635 9.99818 13.635C10.2198 13.635 10.4415 13.5534 10.6165 13.3784C10.9548 13.04 10.9548 12.48 10.6165 12.1417L10.3132 11.8384H16.2398C17.7332 11.8384 18.9582 13.0517 18.9582 14.5567C18.9582 16.0617 17.7448 17.275 16.2398 17.275H10.4998C10.0215 17.275 9.62485 17.6717 9.62485 18.15C9.62485 18.6284 10.0215 19.025 10.4998 19.025H16.2398C18.7015 19.025 20.7082 17.0184 20.7082 14.5567C20.7082 12.095 18.7015 10.1 16.2398 10.1Z"
                      fill="#FFF2E7"
                    />
                  </svg>

                  <a>Quay lại </a>
                </Link>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ReadService;
