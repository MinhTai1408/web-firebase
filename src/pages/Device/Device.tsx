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
} from "antd";
import Menu from "../Menu/Menu";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { Link, useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { BookWithId, fetchBooks } from "../../features/deviceSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";

const Device: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const data: BookWithId[] | undefined = useAppSelector(
    (state) => state.books.booksArray
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };
  const [selectedBook, setSelectedBook] = useState<BookWithId | null>(null);
  const [selected, setSelected] = useState<BookWithId | null>(null);
  const handleEditIcon = (book: BookWithId) => {
    setSelectedBook(book);
  };
  const filteredData = data?.filter((book) =>
    book.book?.tenTb?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    if (selectedBook) {
      navigate(`/edit-device/${selectedBook.id}`);
    }
  }, [selectedBook, navigate]);
  const handleReadIcon = (book: BookWithId) => {
    setSelected(book);
    navigate(`/read-book/${book.id}`);
  };
  useEffect(() => {
    if (selected) {
      navigate(`/read-book/${selected.id}`);
    }
  }, [selected, navigate]);
  const columns = [
    {
      title: "Mã thiết bị",
      dataIndex: ["book", "maTb"],
      key: "title",
    },
    {
      title: "Tên thiết bị",
      dataIndex: ["book", "tenTb"],
      key: "author",
    },
    {
      title: "Địa chỉ",
      dataIndex: ["book", "diaChi"],
      key: "author",
    },
    {
      title: "Dịch vụ sử dụng",
      dataIndex: ["book", "dvsd"],
      key: "author",
    },
    {
      key: "action",
      render: (record: BookWithId) => (
        <>
          <Button onClick={() => handleEditIcon(record)}>Cập nhật</Button>
          <Button onClick={() => handleReadIcon(record)}>Đọc</Button>
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
              <div className="view-books">
                {filteredData?.length > 0 ? (
                  <div className="container">
                    <Table
                      columns={columns}
                      dataSource={filteredData}
                      rowKey={(record) => record.id}
                    />
                  </div>
                ) : (
                  <div>There are no books matching your search!</div>
                )}
              </div>
            </Col>
            <Col span={2} style={{ left: 10 }}>
              <Link to={"/add-device"}>
                <Card style={{ backgroundColor: "#FFF2E7" }}>
                  <p>Thêm thiết bị</p>
                </Card>
              </Link>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Device;
