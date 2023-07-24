// LapBaoCao.tsx
import React, { useEffect, useState } from "react";
import { CapSoWithId, fetchCapSoList } from "../../features/capSoSlice";
import { Link } from "react-router-dom";
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Layout,
  Pagination,
  Row,
  Space,
  Table,
} from "antd";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";

import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import Sider from "antd/es/layout/Sider";
import Menu from "../Menu/Menu";
import { Content, Header } from "antd/es/layout/layout";
import Card from "antd/es/card/Card";

import AvataProfile from "../profile/AvataProfile";

const PAGE_SIZE = 4;

const LapBaoCao: React.FC = () => {
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };
  const [selected, setSelected] = useState<CapSoWithId | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const dataCapSo: CapSoWithId[] | undefined = useAppSelector(
    (state) => state.capso.capSoList
  );
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

  const sortedData: CapSoWithId[] =
    filteredData?.sort((a, b) => {
      const sttA = a.capSo?.thuTu ?? 0;
      const sttB = b.capSo?.thuTu ?? 0;
      return sttA - sttB;
    }) ?? [];

  const currentData = sortedData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const totalPageCount = Math.ceil((filteredData?.length ?? 0) / PAGE_SIZE);

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
  const columns = [
    {
      title: "Stt",
      dataIndex: ["capSo", "thuTu"],
      key: "stt",
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
  ];
  const exportToExcel = () => {
    // Prepare data for Excel export
    const exportData = sortedData.map((item) => ({
      Stt: item.capSo?.thuTu,
      "Tên dịch vụ": item.capSo?.tenDichVu,
      "Thời gian cấp": item.capSo?.ngayGioCap,
      "Tình trạng": item.capSo?.trangThai,
      "Nguồn cấp": item.capSo?.nguonCap,
    }));

    // Convert the data to a worksheet
    const worksheet = utils.json_to_sheet(exportData);

    // Create a new workbook
    const workbook = {
      Sheets: { "Báo cáo": worksheet },
      SheetNames: ["Báo cáo"],
    };

    // Convert the workbook to an Excel file
    const excelFile = write(workbook, { bookType: "xlsx", type: "array" });

    // Save the Excel file with the desired filename
    const blob = new Blob([excelFile], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "bao_cao.xlsx");
  };

  // Render the table with dataSource and columns
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
                  Báo cáo &gt;
                  <Link to="#" style={{ color: "orange", right: 5 }}>
                    Lập báo cáo
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
          </Row>
          <Row style={{ paddingTop: 20 }}>
            <Col span={22}>
              <Table
                dataSource={currentData}
                columns={columns}
                pagination={false}
                rowKey="key" // Use the unique key specified in dataSource
              />
              <Pagination
                style={{ marginTop: 16, textAlign: "end" }}
                current={currentPage}
                total={(filteredData?.length ?? 0) || 0}
                pageSize={PAGE_SIZE}
                onChange={(page) => setCurrentPage(page)}
              />
            </Col>
            <Col span={2} style={{ left: 10 }}>
              <Card style={{ width: 70, backgroundColor: "#ffc069" }}>
                <p onClick={exportToExcel}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                  >
                    <path
                      d="M23.9166 11.888H20.545C17.78 11.888 15.5283 9.63634 15.5283 6.87134V3.49967C15.5283 2.85801 15.0033 2.33301 14.3616 2.33301H9.41496C5.82163 2.33301 2.91663 4.66634 2.91663 8.83134V19.168C2.91663 23.333 5.82163 25.6663 9.41496 25.6663H18.585C22.1783 25.6663 25.0833 23.333 25.0833 19.168V13.0547C25.0833 12.413 24.5583 11.888 23.9166 11.888ZM14.3266 18.4097L11.9933 20.743C11.9116 20.8247 11.8066 20.8947 11.7016 20.9297C11.5966 20.9763 11.4916 20.9997 11.375 20.9997C11.2583 20.9997 11.1533 20.9763 11.0483 20.9297C10.955 20.8947 10.8616 20.8247 10.7916 20.7547C10.78 20.743 10.7683 20.743 10.7683 20.7313L8.43496 18.398C8.09663 18.0597 8.09663 17.4997 8.43496 17.1613C8.77329 16.823 9.33329 16.823 9.67163 17.1613L10.5 18.013V13.1247C10.5 12.6463 10.8966 12.2497 11.375 12.2497C11.8533 12.2497 12.25 12.6463 12.25 13.1247V18.013L13.09 17.173C13.4283 16.8347 13.9883 16.8347 14.3266 17.173C14.665 17.5113 14.665 18.0713 14.3266 18.4097Z"
                      fill="#FF7506"
                    />
                    <path
                      d="M20.335 10.2779C21.4434 10.2896 22.9834 10.2896 24.3017 10.2896C24.9667 10.2896 25.3167 9.50792 24.85 9.04125C23.17 7.34958 20.16 4.30458 18.4334 2.57792C17.955 2.09958 17.1267 2.42625 17.1267 3.09125V7.16292C17.1267 8.86625 18.5734 10.2779 20.335 10.2779Z"
                      fill="#FF7506"
                    />
                  </svg>
                </p>
                <p>Tải xuống</p>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LapBaoCao;
