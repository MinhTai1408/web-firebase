import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, Select, Layout, Row, Col, Space } from "antd";

import { toast } from "react-toastify";
import Sider from "antd/es/layout/Sider";

import { Content, Header } from "antd/es/layout/layout";
import { BookWithId, updateBook } from "../../features/deviceSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import Menu from "../../pages/Menu/Menu";

interface EditParams {
  [key: string]: string | undefined;
  id: string;
}

const EditDevice: React.FC = () => {
  const { id } = useParams<EditParams>();
  const [form] = Form.useForm();
  const [book, setBook] = useState<BookWithId | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const booksArray: BookWithId[] | undefined = useAppSelector(
    (state) => state.books.booksArray
  );

  useEffect(() => {
    const selectedBook = booksArray?.find((book) => book.id === id);
    setBook(selectedBook ?? null);
  }, [booksArray, id]);

  const handleUpdate = () => {
    const values = form.getFieldsValue();
    if (book) {
      const updatedBook: BookWithId = {
        ...book,
        book: {
          ...book.book,
          maTb: values.maTb,
          loaiTb: values.loaiTb,
          tenTb: values.tenTb,
          tenDn: values.tenDn,
          diaChi: values.diaChi,
          matKhau: values.matKhau,
          dvsd: values.dvsd,
        },
      };
      dispatch(updateBook(updatedBook)).then(() => {
        setLoading(false);
        toast.success("Update sussces");
        navigate("/device");
      });
    }
  };
  const [size] = useState(12);
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
              }}
            >
              <p style={{ fontWeight: 500, color: "black" }}>
                Thiết bị &gt;
                <Link to="/device" style={{ color: "black", left: 5 }}>
                  Danh sách thiết bị &gt;
                </Link>
                <Link to="#" style={{ color: "orange", left: 5 }}>
                  Cập nhật thiết bị
                </Link>
              </p>
            </div>
          </Header>
          <Content
            style={{
              margin: "24px 16px 0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p
              style={{
                fontSize: 25,
                fontWeight: 500,
                color: "orange",
                textAlign: "start",
              }}
            >
              Quản lý thiết bị
            </p>
            <Content style={{ backgroundColor: "white" }}>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  color: "orange",
                  textAlign: "start",
                  marginLeft: 15,
                }}
              >
                Thông tin thiết bị
              </p>
              {book && (
                <Form
                  style={{ marginLeft: 15, marginRight: 15 }}
                  layout="vertical"
                  form={form}
                  initialValues={{
                    maTb: book.book.maTb,
                    loaiTb: book.book.loaiTb,
                    tenTb: book.book.tenTb,
                    tenDn: book.book.tenDn,
                    diaChi: book.book.diaChi,
                    matKhau: book.book.matKhau,
                    dvsd: book.book.dvsd,
                  }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Mã thiết bị"
                        name="maTb"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập mã thiết bị!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="Tên thiết bị"
                        name="tenTb"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên thiết bị!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="Địa chỉ"
                        name="diaChi"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập địa chỉ!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Loại thiết bị"
                        name="loaiTb"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn loại thiết bị!",
                          },
                        ]}
                      >
                        <Select placeholder="Select a course type">
                          <Select.Option value="hard">Hard</Select.Option>
                          <Select.Option value="medium">Medium</Select.Option>
                          <Select.Option value="easy">Easy</Select.Option>
                        </Select>
                      </Form.Item>

                      <Form.Item
                        label="Tên đăng nhập"
                        name="tenDn"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên đăng nhập!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="Mật khẩu"
                        name="matKhau"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập mật khẩu!",
                          },
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        label="Dịch vụ sử dụng"
                        name="dvsd"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập dịch vụ sử dụng!",
                          },
                        ]}
                      >
                        <Select
                          mode="multiple"
                          value={book?.book.dvsd}
                          onChange={(value) =>
                            setBook((prevBook) => {
                              if (prevBook) {
                                return {
                                  ...prevBook,
                                  book: {
                                    ...prevBook.book,
                                    dvsd: value,
                                  },
                                };
                              }
                              return null;
                            })
                          }
                          style={{ width: "100%" }}
                        >
                          <Select.Option value="Khám tim mạch">
                            Khám tim mạch
                          </Select.Option>
                          <Select.Option value="Khám sản phụ khoa">
                            Khám sản phụ khoa
                          </Select.Option>
                          <Select.Option value="Khám răng hàm mặt">
                            Khám răng hàm mặt
                          </Select.Option>
                          <Select.Option value="Khám tai mũi họng">
                            Khám tai mũi họng
                          </Select.Option>
                          <Select.Option value="Khám hô hấp">
                            Khám hô hấp
                          </Select.Option>
                          <Select.Option value="Khám tổng quát">
                            Khám tổng quát
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              )}
            </Content>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: 20,
              }}
            >
              <Space size={size}>
                <Button style={{ backgroundColor: " white", color: "#FF9138" }}>
                  <Link to="/device">Hủy</Link>
                </Button>
                <Button type="primary" onClick={handleUpdate} loading={loading}>
                  Cập nhật
                </Button>
              </Space>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default EditDevice;
