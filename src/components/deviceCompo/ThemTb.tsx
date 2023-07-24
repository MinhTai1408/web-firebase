import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  Layout,
  Row,
  Col,
  Space,
  Checkbox,
} from "antd";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";

import { toast } from "react-toastify";
import Sider from "antd/es/layout/Sider";
import Menu from "../../pages/Menu/Menu";
import { Content, Header } from "antd/es/layout/layout";
import { addDeviceToFirestore } from "../../features/deviceSlice";
import axios from "axios";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../Firebase";
import AvataProfile from "../../pages/profile/AvataProfile";

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
  const { user } = useAppSelector((state) => state.auth);
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
  const randomHd = () => {
    const randomValues = Math.random();
    if (randomValues < 1 / 2) {
      return "Hoạt động";
    } else {
      return "Ngưng hoạt động";
    }
  };

  const randomKn = () => {
    const randomValue = Math.random();
    if (randomValue < 1 / 2) {
      return "Mất kết nối";
    } else {
      return "Kết nối";
    }
  };
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
        trangThaiHd: randomHd(),
        trangThaiKn: randomKn(),
        dvsd: deviceData.dvsd,
      };
      dispatch(addDeviceToFirestore(book)).then(() => {
        setLoading(false);
        toast.success("Add success");
        navigate("/device");
      });
      await logUserAction(`Thêm thiết bị ${getCurrentDateTime()}`);
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
            <Row>
              <Col span={11}>
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
              </Col>
              <Col span={13}>
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
                <Button
                  style={{ backgroundColor: " #FFF2E7", color: "#FF9138" }}
                >
                  <Link to="/device">Hủy bỏ</Link>
                </Button>
                <Button
                  style={{ background: "#FF9138", color: "white" }}
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
