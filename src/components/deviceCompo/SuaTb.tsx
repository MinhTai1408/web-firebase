import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, Select, Layout, Row, Col, Space } from "antd";

import { toast } from "react-toastify";
import Sider from "antd/es/layout/Sider";

import { Content, Header } from "antd/es/layout/layout";

import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import Menu from "../../pages/Menu/Menu";
import { DeviceWithId, updateDevice } from "../../features/deviceSlice";
import axios from "axios";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../Firebase";
import AvataProfile from "../../pages/profile/AvataProfile";

interface EditParams {
  [key: string]: string | undefined;
  id: string;
}

const EditDevice: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { id } = useParams<EditParams>();
  const [form] = Form.useForm();
  const [book, setBook] = useState<DeviceWithId | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const deviceArray: DeviceWithId[] | undefined = useAppSelector(
    (state) => state.device.deviceArray
  );

  useEffect(() => {
    const selectedBook = deviceArray?.find((book) => book.id === id);
    setBook(selectedBook ?? null);
  }, [deviceArray, id]);
  const getCurrentDateTime = (): string => {
    const currentDate = new Date();
    return currentDate.toLocaleString();
  };
  const logUserAction = async (action: string) => {
    // Fetch the user's IP address using an external API
    const response = await axios.get("https://api.ipify.org?format=json");
    const userIp = response.data.ip;
    if (user) {
      const logData = {
        email: user.email,
        timestamp: getCurrentDateTime(),
        ip: userIp,
        action,
      };

      await addDoc(collection(db, "activityLog"), logData);
    }
  };
  const handleUpdate = async () => {
    const values = form.getFieldsValue();
    if (book) {
      const updatedBook: DeviceWithId = {
        ...book,
        device: {
          ...book.device,
          maTb: values.maTb,
          loaiTb: values.loaiTb,
          tenTb: values.tenTb,
          tenDn: values.tenDn,
          diaChi: values.diaChi,
          matKhau: values.matKhau,
          dvsd: values.dvsd,
        },
      };
      dispatch(updateDevice(updatedBook)).then(() => {
        setLoading(false);
        toast.success("Update sussces");
        navigate("/device");
      });
      await logUserAction(`Cập nhất thiết bị ${getCurrentDateTime()}`);
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
            <Row>
              <Col span={9}>
                <div
                  style={{
                    fontSize: 15,
                    textAlign: "start",
                    color: "orange",
                  }}
                >
                  <p style={{ fontWeight: 500, color: "black" }}>
                    Thiết bị &gt;
                    <Link to="/device" style={{ color: "black" }}>
                      Danh sách thiết bị &gt;
                    </Link>
                    <Link to="#" style={{ color: "orange" }}>
                      Cập nhật thiết bị
                    </Link>
                  </p>
                </div>
              </Col>
              <Col span={15}>
                <AvataProfile />
              </Col>
            </Row>
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
                    maTb: book.device.maTb,
                    loaiTb: book.device.loaiTb,
                    tenTb: book.device.tenTb,
                    tenDn: book.device.tenDn,
                    diaChi: book.device.diaChi,
                    matKhau: book.device.matKhau,
                    dvsd: book.device.dvsd,
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
                          <Select.Option value="Kiosk">Kiosk</Select.Option>
                          <Select.Option value="Display counter">
                            Display counter
                          </Select.Option>
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
                          value={book?.device.dvsd}
                          onChange={(value) =>
                            setBook((prevBook) => {
                              if (prevBook) {
                                return {
                                  ...prevBook,
                                  book: {
                                    ...prevBook.device,
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
                <Button
                  style={{ backgroundColor: "  #FFF2E7", color: "#FF9138" }}
                >
                  <Link to="/device">Hủy bỏ</Link>
                </Button>
                <Button
                  style={{ background: "#FF9138", color: "white" }}
                  onClick={handleUpdate}
                  loading={loading}
                >
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
