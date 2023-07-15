import Sider from "antd/es/layout/Sider";
import Layout, { Content, Header } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import Menu from "./../Menu/Menu";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { ServiceWithId, fetchService } from "../../features/serviceSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";

const PAGE_SIZE = 2; //giới hạn số lượng dữ liệu ở mỗi trang

const Service: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<ServiceWithId | null>(null);
  const [selectedup, setSelectedup] = useState<ServiceWithId | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const data: ServiceWithId[] | undefined = useAppSelector(
    (state) => state.service.serviceArray
  );

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  useEffect(() => {
    dispatch(fetchService());
  }, [dispatch]);

  //tìm kiếm
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const filteredData = data?.filter((service) =>
    service.service?.tenDv?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //phân trang
  const currentData = filteredData?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const totalPageCount = Math.ceil((filteredData?.length ?? 0) / PAGE_SIZE);

  //đọc dữ liệu
  const handleReadIcon = (service: ServiceWithId) => {
    setSelected(service);
    navigate(`/read-service/${service.id}`);
  };
  useEffect(() => {
    if (selected) {
      navigate(`/read-service/${selected.id}`);
    }
  }, [selected, navigate]);

  //nút cập nhật
  const handleEditIcon = (service: ServiceWithId) => {
    setSelectedup(service);
  };
  useEffect(() => {
    if (selectedup) {
      navigate(`/edit-service/${selectedup.id}`);
    }
  }, [selectedup, navigate]);

  const columns = [
    {
      title: "Mã dịch vụ",
      dataIndex: ["service", "maDv"],
      key: "maDv",
    },
    {
      title: "Tên dịch vụ",
      dataIndex: ["service", "tenDv"],
      key: "tenDv",
    },
    {
      title: "Mô Tả",
      dataIndex: ["service", "moTa"],
      key: "moTa",
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (text: string) => {
        const color = text === "Hoạt động" ? "green" : "red";

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
    {
      key: "action",
      width: 50,
      render: (record: ServiceWithId) => (
        <>
          <Button onClick={() => handleReadIcon(record)}>Đọc</Button>
        </>
      ),
    },
    {
      key: "action",
      width: 50,
      render: (record: ServiceWithId) => (
        <>
          <Button onClick={() => handleEditIcon(record)}>Cập nhật</Button>
        </>
      ),
    },
  ];

  const dataSource = currentData?.map((item) => ({
    ...item,
    trangThai: Math.random() < 0.5 ? "Hoạt động" : "Ngưng hoạt động",
  }));

  return (
    <div>
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
                left: 5,
              }}
            >
              <p style={{ fontWeight: 500, color: "black" }}>
                Dịch vụ &gt;
                <Link to="/service" style={{ color: "orange", right: 5 }}>
                  Danh sách dịch vụ
                </Link>
              </p>
            </div>
          </Header>
          <Content style={{ margin: "24px 16px 0" }}>
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
            <Row>
              <Col span={6}>
                <Form.Item label="Trạng thái hoạt động" />
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Tất cả"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
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
              <Col span={9}>
                <Form.Item label="Chọn thời gian " />
                <Space direction="vertical">
                  <DatePicker onChange={onChange} />
                </Space>{" "}
                &gt;{" "}
                <Space direction="vertical">
                  <DatePicker onChange={onChange} />
                </Space>
              </Col>
              <Col span={7}>
                <Form.Item label="Từ khóa" />
                <Input
                  placeholder="Nhập từ khóa"
                  prefix={<SearchOutlined style={{ color: "orange" }} />}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </Col>
            </Row>
            <Row style={{ paddingTop: 20 }}>
              <Col span={22}>
                <Table
                  dataSource={dataSource}
                  columns={columns}
                  pagination={false}
                  rowKey={(record) => record.id}
                />
                <Pagination
                  style={{ marginTop: 16, textAlign: "end" }}
                  current={currentPage}
                  total={totalPageCount * PAGE_SIZE}
                  pageSize={PAGE_SIZE}
                  onChange={(page) => setCurrentPage(page)}
                />
              </Col>
              <Col span={2} style={{ left: 10 }}>
                <Card style={{ width: 70, backgroundColor: "#ffc069" }}>
                  <Link to={"/add-service"}>
                    <Button
                      style={{
                        right: 10,
                        fontSize: 15,
                        backgroundColor: "#fa8c16",
                      }}
                    >
                      <EditOutlined />
                    </Button>
                    <p>Thêm dịch vụ</p>
                  </Link>
                </Card>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Service;
