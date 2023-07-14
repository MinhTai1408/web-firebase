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

interface EditParams {
  [key: string]: string | undefined;
  id: string;
}

const EditService: React.FC = () => {
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

  const handleUpdate = () => {
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
                <Button style={{ backgroundColor: " white", color: "#FF9138" }}>
                  <Link to="/service">Hủy</Link>
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

export default EditService;
