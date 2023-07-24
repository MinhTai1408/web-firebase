import React, { useState } from "react";
import { Row, Col, Form, Input, Layout, Button, Space, Checkbox } from "antd";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { Link, useNavigate } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import Menu from "../../pages/Menu/Menu";
import { Header } from "antd/es/layout/layout";
import { Content } from "antd/es/layout/layout";
import TextArea from "antd/es/input/TextArea";
import { addVaiTroToFirestore } from "../../features/vaitroSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../Firebase";
import Card from "antd/es/card/Card";
import AvataProfile from "../../pages/profile/AvataProfile";

const ThemVaiTro: React.FC = () => {
  const [form] = Form.useForm();
  const [size] = useState(12);
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
  const handleAddVaiTro = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      let vaiTro = {
        tenVaiTro: values.tenVaiTro,
        moTa: values.moTa,
        soNguoiDung: "6",
        phanQuyenChucNangA: values.phanQuyenChucNangA,
        phanQuyenChucNangB: values.phanQuyenChucNangB,
      };
      dispatch(addVaiTroToFirestore(vaiTro)).then(() => {
        setLoading(false);
        toast.success("Add success");
        navigate("/settings/roles");
      });
      await logUserAction(`Thêm vai trò ${getCurrentDateTime()}`);
    } catch (error) {
      console.log("Validation failed:", error);
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
              <Col span={10}>
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
                    <Link
                      to="/settings/roles"
                      style={{ color: "black", right: 5 }}
                    >
                      Quản lý vai trò &gt;
                    </Link>
                    <Link to="#" style={{ color: "orange", right: 5 }}>
                      Thêm vai trò
                    </Link>
                  </p>
                </div>
              </Col>
              <Col span={14}>
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
              Danh sách vai trò
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
                Thông tin vai trò
              </p>
              <Form
                layout="vertical"
                onFinish={handleAddVaiTro}
                form={form}
                style={{ marginLeft: 15, marginRight: 15 }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Tên vai trò"
                      name="tenVaiTro"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên vai trò!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Mô tả"
                      name="moTa"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mô tả!",
                        },
                      ]}
                    >
                      <TextArea rows={5} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Phân quyền chức năng">
                      <Card style={{ backgroundColor: "#FFC89B" }}>
                        <Form.Item
                          label="Nhóm chức năng A"
                          name="phanQuyenChucNangA"
                        >
                          <Checkbox.Group>
                            <Row style={{ marginLeft: 15 }}>
                              <Col span={24}>
                                <Checkbox value="Tất cả">Tất cả</Checkbox>
                              </Col>
                              <Col span={24}>
                                <Checkbox value="Chức năng x">
                                  Chức năng x
                                </Checkbox>
                              </Col>
                              <Col span={24}>
                                <Checkbox value="Chức năng y">
                                  Chức năng y
                                </Checkbox>
                              </Col>
                              <Col span={24}>
                                <Checkbox value="Chức năng z">
                                  Chức năng z
                                </Checkbox>
                              </Col>
                            </Row>
                          </Checkbox.Group>
                        </Form.Item>
                        <Form.Item
                          label="Nhóm chức năng B"
                          name="phanQuyenChucNangB"
                        >
                          <Checkbox.Group>
                            <Row style={{ marginLeft: 15 }}>
                              <Col span={24}>
                                <Checkbox value="Tất cả">Tất cả</Checkbox>
                              </Col>
                              <Col span={24}>
                                <Checkbox value="Chức năng x">
                                  Chức năng x
                                </Checkbox>
                              </Col>
                              <Col span={24}>
                                <Checkbox value="Chức năng y">
                                  Chức năng y
                                </Checkbox>
                              </Col>
                              <Col span={24}>
                                <Checkbox value="Chức năng z">
                                  Chức năng z
                                </Checkbox>
                              </Col>
                            </Row>
                          </Checkbox.Group>
                        </Form.Item>
                      </Card>
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
                  <Link to="/settings/roles">Hủy bỏ</Link>
                </Button>
                <Button
                  onClick={handleAddVaiTro}
                  loading={loading}
                  style={{ background: "#FF9138", color: "white" }}
                >
                  Thêm
                </Button>
              </Space>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default ThemVaiTro;
