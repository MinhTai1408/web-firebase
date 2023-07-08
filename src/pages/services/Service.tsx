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
  Row,
  Select,
  Space,
  Table,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ServiceWithId, fetchService } from "../../features/serviceSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";

const Service: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const data: ServiceWithId[] | undefined = useAppSelector(
    (state) => state.service.serviceArray
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };
  //hiển thị bảng dữ liệu
  useEffect(() => {
    dispatch(fetchService());
  }, [dispatch]);
  const filteredData = data?.filter((service) =>
  service.service?.tenDv?.toLowerCase().includes(searchTerm.toLowerCase())
);
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
      key: "action",
      render: (record: ServiceWithId) => (
        <>
          <Button >Cập nhật</Button>
          <Button >Đọc</Button>
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
                  //onChange={(e) => handleSearch(e.target.value)}
                />
              </Col>
            </Row>
            <Row style={{ paddingTop: 20 }}>
            <Col span={22}>
              <div className="view-books">
                {filteredData?.length > 0 ? (
                  <Table
                    columns={columns}
                    dataSource={filteredData}
                    scroll={{ x: "max-content" }}
                  />
                ) : (
                  <div>There are no books matching your search!</div>
                )}
              </div>
            </Col>
            <Col span={2} style={{ left: 10 }}>
              <Link to={"#"}>
                <Card style={{ backgroundColor: "#FFF2E7" }}>
                  <p>Thêm thiết bị</p>
                </Card>
              </Link>
            </Col>
          </Row>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Service;
