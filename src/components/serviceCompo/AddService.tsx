import React, { useState } from "react";
import { useAppDispatch } from "../../hooks/storeHook";
import { Link, useNavigate } from "react-router-dom";
import { addServiceToFirestore } from "../../features/serviceSlice";
import { toast } from "react-toastify";
import { Button, Checkbox, Col, Form, Input, Layout, Row, Space } from "antd";
import Sider from "antd/es/layout/Sider";
import Menu from "../../pages/Menu/Menu";
import { Content, Header } from "antd/es/layout/layout";
import TextArea from "antd/es/input/TextArea";
import { CheckboxValueType } from "antd/es/checkbox/Group";

type ServiceData = {
  maDv: string;
  tenDv: string;
  moTa: string;
  number: CheckboxValueType[];
};

const AddService: React.FC = () => {
  const [form] = Form.useForm();
  const [size] = useState(12);
  const [loading, setLoading] = useState(false);
  const [serviceData, setServiceData] = useState<ServiceData>({
    maDv: "",
    tenDv: "",
    moTa: "",
    number: [],
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleAddService = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      let service = {
        maDv: values.maDv,
        tenDv: values.tenDv,
        moTa: values.moTa,
        number: serviceData.number,
      };
      dispatch(addServiceToFirestore(service)).then(() => {
        setLoading(false);
        toast.success("Add success");
        navigate("/service");
      });
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };
  const handleServiceChange = (value: CheckboxValueType[]) => {
    setServiceData((prevDeviceData) => {
      return {
        ...prevDeviceData,
        number: value,
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
                Dịch vụ &gt; &ensp;
                <Link to="/service" style={{ color: "black", left: 5 }}>
                  Danh sách dịch vụ &gt; &ensp;
                </Link>
                <Link to="#" style={{ color: "orange", left: 5 }}>
                  Thêm dịch vụ
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
              Quản lý dịch vụ
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
                Thêm dịch vụ
              </p>
              <Form
                layout="vertical"
                form={form}
                onFinish={handleAddService}
                style={{ marginLeft: 15, marginRight: 15 }}
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
                <Checkbox.Group onChange={handleServiceChange}>
                  <Checkbox value="tai">Option 1</Checkbox>
                  <Checkbox value="phuc">Option 2</Checkbox>
                </Checkbox.Group>
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
                  <Link to="/service">Hủy bỏ</Link>
                </Button>
                <Button
                  type="primary"
                  onClick={handleAddService}
                  loading={loading}
                >
                  Thêm dịch vụ
                </Button>
              </Space>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default AddService;
