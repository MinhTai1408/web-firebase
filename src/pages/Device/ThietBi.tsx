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
import { SearchOutlined } from "@ant-design/icons";

import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import "../Device/Device.css";
import { DeviceWithId, fetchDevice } from "../../features/deviceSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import AvataProfile from "../profile/AvataProfile";
const MAX_DISPLAY_ITEMS = 2; ////giới hạn số từ hiển thị trong cột dịch vụ sử dụng
const PAGE_SIZE = 4; //giới hạn số lượng dữ liệu ở mỗi trang

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
  const [selectedHd, setSelectedHd] = useState<string | null>(null);
  const [selectedKn, setselectedKn] = useState<string | null>(null);
  const filteredData = data
    ?.filter((book) =>
      book.device?.tenTb?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((book) =>
      selectedHd ? book.device?.trangThaiHd === selectedHd : true
    )
    .filter((book) =>
      selectedKn ? book.device?.trangThaiKn === selectedKn : true
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

  const getColorForTrangThaiHd = (trangThai: string | undefined) => {
    switch (trangThai) {
      case "Ngưng hoạt động":
        return "red"; // Chấm màu xanh lá cây
      case "Hoạt động":
        return "green"; // Chấm màu xanh nước biển

      default:
        return "gray"; // Mặc định là chấm màu xám (nếu không có trạng thái hợp lệ)
    }
  };

  const getColorForTrangThaiKn = (trangThai: string | undefined) => {
    switch (trangThai) {
      case "Mất kết nối":
        return "red"; // Chấm màu xanh lá cây
      case "Kết nối":
        return "green"; // Chấm màu xanh nước biển

      default:
        return "gray"; // Mặc định là chấm màu xám (nếu không có trạng thái hợp lệ)
    }
  };

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
      dataIndex: ["device", "trangThaiHd"],
      key: "trangThaiHd",
      width: 170,
      render: (trangThai: string | undefined) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: getColorForTrangThaiHd(trangThai),
              marginRight: 8,
            }}
          />
          {trangThai}
        </div>
      ),
    },
    {
      title: "Trạng thái kết nối",
      dataIndex: ["device", "trangThaiKn"],
      width: 150,

      key: "trangThaiKn",
      render: (trangThai: string | undefined) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: getColorForTrangThaiKn(trangThai),
              marginRight: 8,
            }}
          />
          {trangThai}
        </div>
      ),
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
      render: (record: DeviceWithId) => (
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
                  Thiết bị &gt;
                  <Link to="/device" style={{ color: "orange", right: 5 }}>
                    Danh sách thiết bị
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
                    value: null,
                    label: "Tất cả",
                  },
                  {
                    value: "Ngưng hoạt động",
                    label: "Ngưng hoạt động",
                  },
                  {
                    value: "Hoạt động",
                    label: "Hoạt động",
                  },
                ]}
                onChange={(value) => setSelectedHd(value)}
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
                    value: null,
                    label: "Tất cả",
                  },
                  {
                    value: "Kết nối",
                    label: "Kết nối",
                  },
                  {
                    value: "Mất kết nối",
                    label: "Mất kết nối",
                  },
                ]}
                onChange={(value) => setselectedKn(value)}
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
              <Card style={{ width: 70, backgroundColor: "#ffc069" }}>
                <Link to={"/add-device"}>
                  <FontAwesomeIcon
                    icon={faSquarePlus}
                    style={{
                      fontSize: 30,
                      borderRadius: "30%",
                      color: "#fa8c16",
                      padding: "5px",
                    }}
                  />
                  <a>Thêm thiết bị</a>
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
