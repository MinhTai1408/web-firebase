import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Row, Col, Input, Checkbox, Space, Button } from "antd";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { VaiTrosWithId, updateVaiTro } from "../../features/vaitroSlice";

import { toast } from "react-toastify";
import Layout from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import Menu from "../../pages/Menu/Menu";
import { Header } from "antd/es/layout/layout";
import { Content } from "antd/es/layout/layout";

import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../Firebase";
import Card from "antd/es/card/Card";
import AvataProfile from "../../pages/profile/AvataProfile";

interface EditParams {
  [key: string]: string | undefined;
  id: string;
}
const SuaVaiTro = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { id } = useParams<EditParams>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [vaitro, setVaiTro] = useState<VaiTrosWithId | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const vaitroArray: VaiTrosWithId[] | undefined = useAppSelector(
    (state) => state.vaitro.vaitrosArray
  );
  useEffect(() => {
    const selectedVaiTro = vaitroArray?.find((vaitro) => vaitro.id === id);
    setVaiTro(selectedVaiTro ?? null);
  }, [vaitroArray, id]);
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
    if (vaitro) {
      const updatedVaiTro: VaiTrosWithId = {
        ...vaitro,
        vaitros: {
          ...vaitro.vaitros,

          tenVaiTro: values.tenVaiTro,
          moTa: values.moTa,

          phanQuyenChucNangA: values.phanQuyenChucNangA,

          phanQuyenChucNangB: values.phanQuyenChucNangB,
        },
      };
      dispatch(updateVaiTro(updatedVaiTro)).then(() => {
        setLoading(false);
        toast.success("Update sussces");
        navigate("/settings/roles");
      });
      await logUserAction(`Cập nhật vai trò ${getCurrentDateTime()}`);
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
                      Cập nhật vai trò
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
              {vaitro && (
                <Form
                  style={{ marginLeft: 15, marginRight: 15 }}
                  layout="vertical"
                  form={form}
                  initialValues={{
                    tenVaiTro: vaitro.vaitros.tenVaiTro,
                    moTa: vaitro.vaitros.moTa,

                    phanQuyenChucNangA: vaitro.vaitros.phanQuyenChucNangA,
                    phanQuyenChucNangB: vaitro.vaitros.phanQuyenChucNangB,
                  }}
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
                        <Card style={{ backgroundColor: "orange" }}>
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
                  <Link to="/settings/roles">Hủy bỏ</Link>
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

export default SuaVaiTro;
