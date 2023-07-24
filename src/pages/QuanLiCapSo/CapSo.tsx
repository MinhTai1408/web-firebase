import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CapSoWithId, fetchCapSoList } from "../../features/capSoSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Layout,
  Pagination,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import Sider from "antd/es/layout/Sider";
import Menu from "../Menu/Menu";
import { Content, Header } from "antd/es/layout/layout";
import { SearchOutlined } from "@ant-design/icons";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AvataProfile from "../profile/AvataProfile";
const PAGE_SIZE = 4; //giới hạn số lượng dữ liệu ở mỗi trang
const CapSo: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selected, setSelected] = useState<CapSoWithId | null>(null);

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedHd, setSelectedHd] = useState<string | null>(null);
  const [selectedNc, setSelectedNc] = useState<string | null>(null);

  const dataCapSo: CapSoWithId[] | undefined = useAppSelector(
    (state) => state.capso.capSoList
  );

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  useEffect(() => {
    dispatch(fetchCapSoList());
  }, [dispatch]);

  const filteredData = dataCapSo
    ?.filter((capSo) =>
      capSo.capSo?.tenDichVu?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    .filter((capSo) =>
      selectedService ? capSo.capSo?.tenDichVu === selectedService : true
    )
    .filter((capSo) =>
      selectedHd ? capSo.capSo?.trangThai === selectedHd : true
    )
    .filter((capSo) =>
      selectedNc ? capSo.capSo?.nguonCap === selectedNc : true
    );
  //tìm kiếm
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  //sắp xếp thứ tự
  const sortedData: CapSoWithId[] =
    filteredData?.sort((a, b) => {
      const sttA = a.capSo?.thuTu ?? 0;
      const sttB = b.capSo?.thuTu ?? 0;
      return sttA - sttB;
    }) ?? [];

  //phân trang
  const currentData = sortedData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const totalPageCount = Math.ceil((filteredData?.length ?? 0) / PAGE_SIZE);

  //đọc dữ liệu
  const handleReadIcon = (capSo: CapSoWithId) => {
    setSelected(capSo);
    navigate(`/read-capso/${capSo.id}`);
  };
  useEffect(() => {
    if (selected) {
      navigate(`/read-capso/${selected.id}`);
    }
  }, [selected, navigate]);

  const getColorForTrangThai = (trangThai: string | undefined) => {
    switch (trangThai) {
      case "Đã sử dụng":
        return "green"; // Chấm màu xanh lá cây
      case "Đang chờ":
        return "blue"; // Chấm màu xanh nước biển
      case "Bỏ qua":
        return "red"; // Chấm màu đỏ
      default:
        return "gray"; // Mặc định là chấm màu xám (nếu không có trạng thái hợp lệ)
    }
  };
  const colums = [
    {
      title: "Stt",
      dataIndex: ["capSo", "thuTu"],
      key: "stt",
    },
    {
      title: "Tên khách hàng",
      dataIndex: ["capSo", "tenKhachHang"],
      key: "tenKhachHang",
    },
    {
      title: "Tên dịch vụ",
      dataIndex: ["capSo", "tenDichVu"],
      key: "tenDichVu",
    },
    {
      title: "Ngày giờ cấp",
      dataIndex: ["capSo", "ngayGioCap"],
      key: "ngayGioCap",
    },
    {
      title: "Hạn sử dụng",
      dataIndex: ["capSo", "hanSuDung"],
      key: "hanSuDung",
    },
    {
      title: "Trạng thái hoạt động",
      dataIndex: ["capSo", "trangThai"],
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
      title: "Nguồn cấp",
      dataIndex: ["capSo", "nguonCap"],
      key: "nguonCap",
    },
    {
      key: "action",
      width: 50,
      render: (record: CapSoWithId) => (
        <>
          <a
            onClick={() => handleReadIcon(record)}
            style={{ textDecoration: "underline" }}
          >
            Đọc
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
                  Cấp số &gt;
                  <Link to="#" style={{ color: "orange", right: 5 }}>
                    Danh sách cấp số
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
            Quản lý cấp số
          </p>
          <Row>
            <Col span={5}>
              <Form.Item label="Tên dịch vụ" />
              <Select
                showSearch
                placeholder="Tất cả"
                style={{ width: 150 }}
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
                    value: "Khám sản - Phụ khoa",
                    label: "Khám sản - Phụ khoa",
                  },
                  {
                    value: "Khám răng hàm mặt",
                    label: "Khám răng hàm mặt",
                  },
                  {
                    value: "Khám răng tim mạch",
                    label: "Khám răng tim mạch",
                  },
                ]}
                onChange={(value) => setSelectedService(value)}
              />
            </Col>
            <Col span={3}>
              <Form.Item label="Hoạt động " />
              <Select
                showSearch
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
                    value: "Đang chờ",
                    label: "Đang chờ ",
                  },
                  {
                    value: "Bỏ qua",
                    label: "Bỏ qua",
                  },
                  {
                    value: "Đã sử dụng",
                    label: "Đã sử dụng",
                  },
                ]}
                onChange={(value) => setSelectedHd(value)}
              />
            </Col>
            <Col span={3}>
              <Form.Item label="Nguồn cấp " />
              <Select
                showSearch
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
                    value: "Kiosk",
                    label: "Kiosk",
                  },
                  {
                    value: "Hệ thống",
                    label: "Hệ thống",
                  },
                ]}
                onChange={(value) => setSelectedNc(value)}
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
            <Col span={4}>
              <Form.Item label="Từ khóa" />
              <Input
                placeholder="Nhập từ khóa"
                prefix={<SearchOutlined style={{ color: "orange" }} />}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Col>
            <Col span={22} style={{ paddingTop: 20 }}>
              <Table
                dataSource={currentData}
                columns={colums}
                pagination={false}
                rowKey={(record) => record.id}
                onRow={(record) => ({
                  onClick: () => handleReadIcon(record),
                })}
              />
              <Pagination
                style={{ marginTop: 16, textAlign: "end" }}
                current={currentPage}
                total={totalPageCount * PAGE_SIZE}
                pageSize={PAGE_SIZE}
                onChange={(page) => setCurrentPage(page)}
              />
            </Col>
            <Col span={2} style={{ left: 10, paddingTop: 20 }}>
              <Card
                style={{
                  width: 70,
                  height: 110,
                  backgroundColor: "#ffc069",
                }}
              >
                <Link to={"/add-number"}>
                  <FontAwesomeIcon
                    icon={faSquarePlus}
                    style={{
                      fontSize: 30,
                      borderRadius: "30%",
                      color: "#fa8c16",
                      padding: "5px",
                    }}
                  />
                  <a>Cấp số</a>
                </Link>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CapSo;
