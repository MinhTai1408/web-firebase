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
import {
  EditOutlined,
  RollbackOutlined,
  SearchOutlined,
} from "@ant-design/icons";

interface RouteParams {
  [key: string]: string | undefined;
  id: string;
}

const ReadService: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [sortedData, setSortedData] = useState<ServiceWithId[]>([]);
  const [service, setService] = useState<ServiceWithId | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 2,
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
  const columns = [
    {
      title: "Mã dịch vụ cấp",
      dataIndex: ["service", "maDvCap"],
      key: "maDvCap",
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (text: string) => {
        const color = text === "Đã hoàn thành" ? "green" : "yellow";

        return (
          <>
            <div
              style={{
                backgroundColor: color,
                borderRadius: "50%",
                display: "inline-block",
                width: 10,
                height: 10,
                marginRight: 10,
              }}
            />
            {text}
          </>
        );
      },
    },
  ];

  const filteredData = sortedData.filter((item) =>
    item.service.maDvCap.toLowerCase().includes(searchText.toLowerCase())
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
                                value: "1",
                                label: "Tất cả",
                              },
                              {
                                value: "2",
                                label: "Hoạt động",
                              },
                              {
                                value: "3",
                                label: "Ngưng hoạt động",
                              },
                            ]}
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
                style={{ width: 70, height: 120, backgroundColor: "#ffc069" }}
              >
                <Link to={`/edit-service/${id}`}>
                  <Button
                    style={{
                      right: 10,
                      fontSize: 15,
                      backgroundColor: "#fa8c16",
                    }}
                  >
                    <EditOutlined />
                  </Button>
                  <p>Cập nhật </p>
                </Link>
              </Card>
              <Card
                bordered={false}
                style={{ width: 70, height: 120, backgroundColor: "#ffc069" }}
              >
                <Link to="/service">
                  <Button
                    style={{
                      right: 10,
                      fontSize: 15,
                      backgroundColor: "#fa8c16",
                    }}
                  >
                    <RollbackOutlined />
                  </Button>
                  <p>Quay lại </p>
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
