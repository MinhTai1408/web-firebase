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
import { FileExcelOutlined } from "@ant-design/icons";
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
                <Button
                  style={{
                    right: 10,
                    fontSize: 15,
                    backgroundColor: "#fa8c16",
                  }}
                  onClick={exportToExcel}
                >
                  <FileExcelOutlined />
                </Button>
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
