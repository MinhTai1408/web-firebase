import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { Link, useNavigate } from "react-router-dom";
import { AccountsWithId, fetchAccounts } from "../../features/accountsSlice";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  Pagination,
  Row,
  Select,
  Table,
} from "antd";
import Sider from "antd/es/layout/Sider";
import Menu from "../Menu/Menu";
import { Content, Header } from "antd/es/layout/layout";
import { SearchOutlined } from "@ant-design/icons";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotificationPopover from "../profile/Notifications";
import AvataProfile from "../profile/AvataProfile";
const PAGE_SIZE = 4; //giới hạn số lượng dữ liệu ở mỗi trang
const Accounts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [accountup, setAccountUp] = useState<AccountsWithId | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const data: AccountsWithId[] | undefined = useAppSelector(
    (state) => state.accounts.accountsArray
  );

  const filteredData = data
    ?.filter((service) =>
      service.accounts?.hoTen?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((service) =>
      selectedStatus ? service.accounts?.trangThai === selectedStatus : true
    );

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  //tìm kiếm
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  //nút cập nhật
  const handleEditIcon = (accounts: AccountsWithId) => {
    setAccountUp(accounts);
  };
  useEffect(() => {
    if (accountup) {
      navigate(`/settings/accounts/edit-accounts/${accountup.id}`);
    }
  }, [accountup, navigate]);

  //phân trang
  const currentData = filteredData?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const totalPageCount = Math.ceil((filteredData?.length ?? 0) / PAGE_SIZE);

  const columns = [
    {
      title: "Tên đăng nhập",
      dataIndex: ["accounts", "tenDn"],
      key: "tenDn",
    },
    {
      title: "Họ và tên",
      dataIndex: ["accounts", "hoTen"],
      key: "hoTen",
    },
    {
      title: "soDt",
      dataIndex: ["accounts", "soDt"],
      key: "soDt",
    },
    {
      title: "Email",
      dataIndex: ["accounts", "email"],
      key: "Email",
    },
    {
      title: "Vai trò",
      dataIndex: ["accounts", "vaiTro"],
      key: "maDv",
    },
    {
      title: "Trang thái hoạt động",
      dataIndex: ["accounts", "trangThai"],
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
      render: (record: AccountsWithId) => (
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
  const dataSource = currentData?.map((item) => ({
    ...item,
    trangThai: Math.random() ? "Hoạt động" : "Ngưng hoạt động",
  }));
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
                      Quản lý tài khoản
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
              Danh sách tài khoản
            </p>
            <Row>
              <Col span={17}>
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
                  onChange={(value) => setSelectedStatus(value)}
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
                <Card
                  style={{ width: 70, height: 130, backgroundColor: "#ffc069" }}
                >
                  <Link to={"/settings/accounts/add-accounts"}>
                    <FontAwesomeIcon
                      icon={faSquarePlus}
                      style={{
                        fontSize: 30,
                        borderRadius: "30%",
                        color: "#fa8c16",
                        padding: "5px",
                      }}
                    />

                    <a>Thêm tài khoản</a>
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

export default Accounts;
