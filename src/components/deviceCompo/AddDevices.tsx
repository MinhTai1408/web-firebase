import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Select, Layout, Row, Col, Space } from "antd";
import { useAppDispatch } from "../../hooks/storeHook";
import { addBookToFirestore } from "../../features/deviceSlice";
import { toast } from "react-toastify";
import Sider from "antd/es/layout/Sider";
import Menu from "../../pages/Menu/Menu";
import { Content, Header } from "antd/es/layout/layout";

type DeviceData = {
  maTb: string;
  loaiTb: string;
  tenTb: string;
  tenDn: string;
  diaChi: string;
  matKhau: string;
  dvsd: string[];
};

const AddDevice: React.FC = () => {
  const [size] = useState(12);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deviceData, setDeviceData] = useState<DeviceData>({
    maTb: "",
    loaiTb: "",
    tenTb: "",
    tenDn: "",
    diaChi: "",
    matKhau: "",
    dvsd: [],
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleAddBook = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      let book = {
        maTb: values.maTb,
        loaiTb: values.loaiTb,
        tenTb: values.tenTb,
        tenDn: values.tenDn,
        diaChi: values.diaChi,
        matKhau: values.matKhau,
        dvsd: deviceData.dvsd,
      };
      dispatch(addBookToFirestore(book)).then(() => {
        setLoading(false);
        toast.success("Add success");
        navigate("/device");
      });
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const handleDeviceChange = (value: string[]) => {
    const validValues = value.filter(
      (val) =>
        val === "Khám tim mạch" ||
        val === "Khám sản phụ khoa" ||
        val === "Khám răng hàm mặt" ||
        val === "Khám tai mũi họng" ||
        val === "Khám hô hấp" ||
        val === "Khám tổng quát"
    );
    setDeviceData((prevDeviceData) => {
      return {
        ...prevDeviceData,
        dvsd: validValues,
      };
    });
  };

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
                  Thêm thiết bị
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
                Thêm thiết bị
              </p>
              <Form
                layout="vertical"
                form={form}
                onFinish={handleAddBook}
                style={{ marginLeft: 15, marginRight: 15 }}
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
                      <Select>
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
                          message: "Vui lòng chọn dịch vụ sử dụng!",
                        },
                      ]}
                    >
                      <Select mode="multiple" onChange={handleDeviceChange}>
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
                <Button
                  type="primary"
                  onClick={handleAddBook}
                  loading={loading}
                >
                  Thêm thiết bị
                </Button>
              </Space>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default AddDevice;
