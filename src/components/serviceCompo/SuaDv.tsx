import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

import { toast } from "react-toastify";
import Sider from "antd/es/layout/Sider";

import { Content, Header } from "antd/es/layout/layout";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import Menu from "../../pages/Menu/Menu";
import { ServiceWithId, updateService } from "../../features/serviceSlice";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../Firebase";
import AvataProfile from "../../pages/profile/AvataProfile";

interface EditParams {
  [key: string]: string | undefined;
  id: string;
}

const EditService: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { id } = useParams<EditParams>();
  const [form] = Form.useForm();
  const [service, setService] = useState<ServiceWithId | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const serviceArray: ServiceWithId[] | undefined = useAppSelector(
    (state) => state.service.serviceArray
  );

  useEffect(() => {
    const selectedService = serviceArray?.find((service) => service.id === id);
    setService(selectedService ?? null);
  }, [serviceArray, id]);

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
    if (service) {
      const updatedBook: ServiceWithId = {
        ...service,
        service: {
          ...service.service,
          maDv: values.maDv,
          tenDv: values.tenDv,
          moTa: values.moTa,
        },
      };
      dispatch(updateService(updatedBook)).then(() => {
        setLoading(false);
        toast.success("Update sussces");
        navigate("/service");
      });
      await logUserAction(`Cập nhật dịch vụ ${getCurrentDateTime()}`);
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
                  }}
                >
                  <p style={{ fontWeight: 500, color: "black" }}>
                    Dịch vụ &gt;
                    <Link to="/service" style={{ color: "black" }}>
                      Danh sách dịch vụ &gt;
                    </Link>
                    <Link to={`/read-service/${id}`} style={{ color: "black" }}>
                      Chi tiết &gt;
                    </Link>
                    <Link to="#" style={{ color: "orange" }}>
                      Cập nhật
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
              {service && (
                <Form
                  style={{ marginLeft: 15, marginRight: 15 }}
                  layout="vertical"
                  form={form}
                  initialValues={{
                    maDv: service.service.maDv,
                    tenDv: service.service.tenDv,
                    moTa: service.service.moTa,
                  }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Mã dịch vụ"
                        name="maDv"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập mã dịch vụ!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="Tên dịch vụ"
                        name="tenDv"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên dịch vụ!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
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
                  </Row>
                </Form>
              )}
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  color: "orange",
                  textAlign: "start",
                  marginLeft: 15,
                }}
              >
                Quy tắc cấp số
              </p>
              <Form style={{ marginLeft: 15, marginRight: 15 }}>
                <Form.Item>
                  <Checkbox.Group>
                    <Row>
                      <Col span={24}>
                        <Checkbox value="0001_9999">
                          Tăng tự động: từ 0001 đến 9999
                        </Checkbox>
                      </Col>
                      <Col span={24}>
                        <Checkbox value="prefix_0001">Prefix: 0001</Checkbox>
                      </Col>
                      <Col span={24}>
                        <Checkbox value="surfix_0001">Surfix: 0001</Checkbox>
                      </Col>
                      <Col span={24}>
                        <Checkbox value="reset_daily">
                          Reset mỗi ngày (đặt lại hàng ngày)
                        </Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
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
                  style={{ backgroundColor: "  #FFF2E7", color: "#FF9138" }}
                >
                  <Link to="/service">Hủy bỏ</Link>
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

export default EditService;
