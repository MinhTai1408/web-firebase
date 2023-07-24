import Sider from "antd/es/layout/Sider";
import Layout, { Content, Header } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import Menu from "../Menu/Menu";
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
import { SearchOutlined } from "@ant-design/icons";
import { ServiceWithId, fetchService } from "../../features/serviceSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AvataProfile from "../profile/AvataProfile";
const PAGE_SIZE = 4; //giới hạn số lượng dữ liệu ở mỗi trang

const Service: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<ServiceWithId | null>(null);
  const [selectedup, setSelectedup] = useState<ServiceWithId | null>(null);
  const [selectedHd, setSelectedHd] = useState<string | null>(null);
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

  const filteredData = data
    ?.filter((service) =>
      service.service?.tenDv?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((service) =>
      selectedHd ? service.service?.trangThai === selectedHd : true
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
    {
      key: "action",
      width: 50,
      render: (record: ServiceWithId) => (
        <>
          <a
            style={{ textDecoration: "underline" }}
            onClick={() => handleReadIcon(record)}
          >
            Đọc
          </a>
        </>
      ),
    },
    {
      key: "action",
      width: 50,
      render: (record: ServiceWithId) => (
        <>
          <a
            style={{ textDecoration: "underline" }}
            onClick={() => handleEditIcon(record)}
          >
            Cập nhật
          </a>
        </>
      ),
    },
  ];

  return (
    <div>
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
              </Col>
              <Col span={16}>
                <AvataProfile />
              </Col>
            </Row>
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
                  dataSource={currentData}
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
                <Card
                  style={{ width: 70, height: 130, backgroundColor: "#ffc069" }}
                >
                  <Link to={"/add-service"}>
                    <FontAwesomeIcon
                      icon={faSquarePlus}
                      style={{
                        fontSize: 30,
                        borderRadius: "30%",
                        color: "#fa8c16",
                        padding: "5px",
                      }}
                    />
                    <a>Thêm dịch vụ</a>
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
