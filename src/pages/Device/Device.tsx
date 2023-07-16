import React, { useEffect, useState } from "react";

import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  Row,
  Select,
  Table,
  Tooltip,
  Pagination,
} from "antd";
import Menu from "../Menu/Menu";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { Link, useNavigate } from "react-router-dom";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";

import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import "../Device/Device.css";
import { DeviceWithId, fetchDevice } from "../../features/deviceSlice";

const MAX_DISPLAY_ITEMS = 2; ////giới hạn số từ hiển thị trong cột dịch vụ sử dụng
const PAGE_SIZE = 2; //giới hạn số lượng dữ liệu ở mỗi trang

const Device: React.FC = () => {
  const renderDvsd = (text: string[] | undefined) => {
    const tooltipContent =
      Array.isArray(text) && text.length > MAX_DISPLAY_ITEMS
        ? text.join(", ")
        : "";

    const displayContent =
      Array.isArray(text) && text.length > MAX_DISPLAY_ITEMS ? (
        <>
          {text.slice(0, MAX_DISPLAY_ITEMS).join(", ")} <a>Xem thêm...</a>
        </>
      ) : (
        text
      );

    return <Tooltip title={tooltipContent}>{displayContent}</Tooltip>;
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const data: DeviceWithId[] | undefined = useAppSelector(
    (state) => state.device.deviceArray
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<DeviceWithId | null>(null);
  const [selected, setSelected] = useState<DeviceWithId | null>(null);

  const filteredData = data?.filter((book) =>
    book.device?.tenTb?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //hiển thị bảng dữ liệu
  useEffect(() => {
    dispatch(fetchDevice());
  }, [dispatch]);

  //nút tìm kiếm
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  //nút cập nhật
  const handleEditIcon = (device: DeviceWithId) => {
    setSelectedBook(device);
  };
  useEffect(() => {
    if (selectedBook) {
      navigate(`/edit-device/${selectedBook.id}`);
    }
  }, [selectedBook, navigate]);

  //phân trang
  const currentData = filteredData?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalPageCount = Math.ceil((filteredData?.length ?? 0) / PAGE_SIZE);

  //nút đọc dữ liệu
  const handleReadIcon = (device: DeviceWithId) => {
    setSelected(device);
    navigate(`/read-book/${device.id}`);
  };
  useEffect(() => {
    if (selected) {
      navigate(`/read-book/${selected.id}`);
    }
  }, [selected, navigate]);

  //các cột trong bảng
  const columns = [
    {
      title: "Mã thiết bị",
      dataIndex: ["device", "maTb"],
      key: "title",
      width: 130,
    },
    {
      title: "Tên thiết bị",
      dataIndex: ["device", "tenTb"],
      key: "author",
      width: 130,
    },
    {
      title: "Địa chỉ",
      dataIndex: ["device", "diaChi"],
      width: 150,
      key: "author",
    },
    {
      title: "Trạng thái hoạt động",
      dataIndex: "trangThai",
      width: 150,
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
      title: "Trạng thái kết nối",
      dataIndex: "trangThaiKn",
      width: 150,

      key: "trangThaikn",
      render: (text: string) => {
        const color = text === "Kết nối" ? "green" : "red";

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
      title: "Dịch vụ sử dụng",
      width: 200,
      dataIndex: ["device", "dvsd"],
      key: "author",
      render: (text: string[] | undefined) => renderDvsd(text),
    },
    {
      key: "action",
      width: 50,
      render: (record: DeviceWithId) => (
        <>
          <Button onClick={() => handleReadIcon(record)}>Đọc</Button>
        </>
      ),
    },
    {
      key: "action",
      width: 50,
      render: (record: DeviceWithId) => (
        <>
          <Button onClick={() => handleEditIcon(record)}>Cập nhật</Button>
        </>
      ),
    },
  ];
  const dataSource = currentData?.map((item) => ({
    ...item,
    trangThai: Math.random() < 0.5 ? "Hoạt động" : "Ngưng hoạt động",
    trangThaiKn: Math.random() < 0.5 ? "Kết nối" : "Mất kết nối",
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
              Thiết bị &gt;
              <Link to="/device" style={{ color: "orange", right: 5 }}>
                Danh sách thiết bị
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
            Danh sách thiết bị
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
            <Col span={8}>
              <Form.Item label="Trạng thái kết nối " />

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
                    label: "Kết nối",
                  },
                  {
                    value: "3",
                    label: "Mất kết nối",
                  },
                ]}
              />
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
                <Link to={"/add-device"}>
                  <Button
                    style={{
                      right: 10,
                      fontSize: 15,
                      backgroundColor: "#fa8c16",
                    }}
                  >
                    <EditOutlined />
                  </Button>
                  <p>Thêm thiết bị</p>
                </Link>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Device;
