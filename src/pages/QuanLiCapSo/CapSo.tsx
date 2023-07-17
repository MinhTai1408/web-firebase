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
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { addHours } from "date-fns";
const PAGE_SIZE = 2; //giới hạn số lượng dữ liệu ở mỗi trang
const CapSo: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selected, setSelected] = useState<CapSoWithId | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

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
      selectedStatus ? capSo.capSo?.tenDichVu === selectedStatus : true
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

  const isUsed = (ngayGioCap: string, hanSuDung: string) => {
    const currentDate = new Date();
    const capDate = new Date(ngayGioCap);
    const hanSuDungDate = new Date(hanSuDung);

    const timeDifferenceInHours = (date1: Date, date2: Date) =>
      Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60);

    const hoursAfterNgayGioCap = timeDifferenceInHours(currentDate, capDate);
    const hoursAfterHanSuDung = timeDifferenceInHours(
      currentDate,
      hanSuDungDate
    );

    if (hoursAfterNgayGioCap > 5) {
      return "Bỏ qua";
    } else if (hoursAfterHanSuDung > 3) {
      return "Đã sử dụng";
    } else {
      return "Đang chờ";
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
      dataIndex: "tenKhachHang",
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
      dataIndex: "trangThai",
      key: "trangThai",
      render: (record: CapSoWithId) => {
        const ngayGioCap = record.capSo?.ngayGioCap || "";
        const hanSuDung = record.capSo?.hanSuDung || "";

        const trangThai = isUsed(ngayGioCap, hanSuDung);

        const color =
          trangThai === "Đã sử dụng"
            ? "black"
            : trangThai === "Đang chờ"
            ? "blue"
            : "red";

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
            {trangThai}
          </>
        );
      },
    },
    {
      title: "Nguồn cấp",
      dataIndex: "nguonCap",
      key: "nguonCap",
    },
    {
      key: "action",
      width: 50,
      render: (record: CapSoWithId) => (
        <>
          <Button onClick={() => handleReadIcon(record)}>Đọc</Button>
        </>
      ),
    },
  ];
  const dataSource = currentData?.map((item) => ({
    ...item,
    trangThai: isUsed(
      item.capSo?.ngayGioCap || "",
      item.capSo?.hanSuDung || ""
    ),
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
              Cấp số &gt;
              <Link to="#" style={{ color: "orange", right: 5 }}>
                Danh sách cấp số
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
            Quản lý cấp số
          </p>
          <Row>
            <Col span={3}>
              <Form.Item label="Tên dịch vụ" />
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
                    value: "dichVu1",
                    label: "dichVu1",
                  },
                  {
                    value: "dichVu2",
                    label: "dichVu2",
                  },
                ]}
                onChange={(value) => setSelectedStatus(value)}
              />
            </Col>
            <Col span={3}>
              <Form.Item label="Tình trạng " />
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
            <Col span={3}>
              <Form.Item label="Tình trạng " />
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
            <Col span={10}>
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
                dataSource={dataSource}
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

                  backgroundColor: "#ffc069",
                }}
              >
                <Link to={"/add-number"}>
                  <Button
                    style={{
                      right: 10,
                      fontSize: 15,
                      backgroundColor: "#fa8c16",
                    }}
                  >
                    <EditOutlined />
                  </Button>
                  <p>Cấp số</p>
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
