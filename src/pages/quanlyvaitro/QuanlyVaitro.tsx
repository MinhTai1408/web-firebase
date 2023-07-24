import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { Link, useNavigate } from "react-router-dom";
import { VaiTrosWithId, fetchVaiTro } from "../../features/vaitroSlice";
import Sider from "antd/es/layout/Sider";
import Menu from "../Menu/Menu";
import { Header } from "antd/es/layout/layout";
import { Content } from "antd/es/layout/layout";
import { Row, Col, Form, Input, Layout, Button, Table, Pagination } from "antd";

import { SearchOutlined, EditOutlined } from "@ant-design/icons";
import Card from "antd/es/card/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import AvataProfile from "../profile/AvataProfile";

const PAGE_SIZE = 4;
const QuanlyVaitro: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [vaitroup, setVaitrotUp] = useState<VaiTrosWithId | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const data: VaiTrosWithId[] | undefined = useAppSelector(
    (state) => state.vaitro.vaitrosArray
  );
  const filteredData = data?.filter((service) =>
    service.vaitros?.tenVaiTro?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    dispatch(fetchVaiTro());
  }, [dispatch]);
  //tìm kiếm
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };
  //phân trang
  const currentData = filteredData?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const totalPageCount = Math.ceil((filteredData?.length ?? 0) / PAGE_SIZE);
  //nút cập nhật
  const handleEditIcon = (vaitros: VaiTrosWithId) => {
    setVaitrotUp(vaitros);
  };
  useEffect(() => {
    if (vaitroup) {
      navigate(`/settings/roles/edit-roles/${vaitroup.id}`);
    }
  }, [vaitroup, navigate]);
  const columns = [
    {
      title: "Tên Vai Trò",
      dataIndex: ["vaitros", "tenVaiTro"],
      key: "tenVaiTro",
    },
    {
      title: "Số người dùng",
      dataIndex: ["vaitros", "soNguoiDung"],
      key: "nguoiDung",
    },
    {
      title: "Mô Tả",
      dataIndex: ["vaitros", "moTa"],
      key: "moTa",
    },
    {
      key: "action",
      width: 50,
      render: (record: VaiTrosWithId) => (
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
                    Cài đặt hệ thống &gt;
                    <Link to="#" style={{ color: "orange", right: 5 }}>
                      Quản lý vai trò
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
            <Row gutter={16}>
              <Col span={17}>
                <p
                  style={{
                    fontSize: 25,
                    fontWeight: 500,
                    color: "orange",
                    textAlign: "start",
                  }}
                >
                  Danh sách vai trò
                </p>
              </Col>
              <Col span={5}>
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
                  <Link to={"/settings/roles/add-roles"}>
                    <FontAwesomeIcon
                      icon={faSquarePlus}
                      style={{
                        fontSize: 30,
                        borderRadius: "30%",
                        color: "#fa8c16",
                        padding: "5px",
                      }}
                    />
                    <a>Thêm vai trò</a>
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

export default QuanlyVaitro;
