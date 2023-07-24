import { Button, Col, Form, Input, Layout, Row, Select, Space } from "antd";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { Link, useNavigate } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import Menu from "../../pages/Menu/Menu";
import { Content, Header } from "antd/es/layout/layout";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../Firebase";

import { addAccountsToFirestore } from "../../features/accountsSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { addDoc, collection } from "firebase/firestore";
import AvataProfile from "../../pages/profile/AvataProfile";

const AddAccounts: React.FC = () => {
  const [size] = useState(12);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
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
  const handleAddAccount = async () => {
    try {
      const values = await form.validateFields(); // Validate form fields
      const {
        matKhau: password,
        nhapMatKhau: confirmPassword,
        email: userEmail,
      } = values;

      // Check email format
      if (!userEmail.includes("@gmail.com")) {
        toast.warn("Email phải có định dạng @gmail.com");
        return; // Exit the function early
      }

      // Check password length
      if (password.length < 6 || password.length > 20) {
        toast.warn("Mật khẩu phải từ 6 đến 20 ký tự");
        return; // Exit the function early
      }

      // Check if password and confirm password match
      if (password !== confirmPassword) {
        toast.warn("Mật khẩu không khớp");
        return; // Exit the function early
      }

      setLoading(true);

      // Create an account object from the form values
      const newAccount = {
        tenDn: values.tenDn,
        hoTen: values.hoTen,
        soDt: values.soDt,
        email: values.email,
        vaiTro: values.vaiTro,
        matKhau: values.matKhau,
        nhapMatKhau: values.nhapMatKhau,
        trangThai: values.trangThai,
      };

      // Check password length

      // Add the account to Firestore using the "addAccountsToFirestore" action
      await dispatch(addAccountsToFirestore(newAccount)).unwrap();

      // Create a new user in Firebase Authentication
      const { email, matKhau } = values;
      await createUserWithEmailAndPassword(auth, email, matKhau);

      // Handle success or navigate to a different page
      setLoading(false);
      toast.success("Tạo thành công");
      // Handle success or navigate to a different page
      navigate("/settings/accounts");
      await logUserAction(`Thêm tài khoản ${getCurrentDateTime()}`); // Example: Navigate to the accounts list page
    } catch (error) {
      console.error("Error adding account:", error);
      setLoading(false);
    }
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
                    Cài đặt hệ thống &gt;
                    <Link
                      to="/settings/accounts/add-accounts"
                      style={{ color: "black", left: 5 }}
                    >
                      Quản lý tài khoản &gt;
                    </Link>
                    <Link to="#" style={{ color: "orange", left: 5 }}>
                      Thêm tài khoản
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
              Quản lý tài khoản
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
                Thêm tài khoản
              </p>
              <Form
                layout="vertical"
                form={form}
                onFinish={handleAddAccount}
                style={{ marginLeft: 15, marginRight: 15 }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Họ và tên"
                      name="hoTen"
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
                      label="Số điện thoại"
                      name="soDt"
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
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập địa chỉ!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Vai trò"
                      name="vaiTro"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập địa chỉ!",
                        },
                      ]}
                    >
                      <Select>
                        <Select.Option value="kế toán">Kế toán</Select.Option>
                        <Select.Option value="quản lý">Quản lý</Select.Option>
                        <Select.Option value="admin">Admin</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Tên đăng nhập"
                      name="tenDn"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn loại thiết bị!",
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
                          message: "Vui lòng nhập tên đăng nhập!",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item
                      label="Nhập lại mật khẩu"
                      name="nhapMatKhau"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mật khẩu!",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Form.Item
                      label="Tình trạng"
                      name="trangThai"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập địa chỉ!",
                        },
                      ]}
                    >
                      <Select>
                        <Select.Option value="Hoạt động">
                          Hoạt động
                        </Select.Option>
                        <Select.Option value="Ngưng hoạt động">
                          Ngưng hoạt động
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
                <Button style={{ background: " #FFF2E7", color: "#FF9138" }}>
                  <Link to="/device">Hủy bỏ</Link>
                </Button>
                <Button
                  style={{ background: "#FF9138", color: "white" }}
                  onClick={handleAddAccount}
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

export default AddAccounts;
