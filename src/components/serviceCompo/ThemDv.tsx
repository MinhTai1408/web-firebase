import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { Link, useNavigate } from "react-router-dom";
import { Service, addServiceToFirestore } from "../../features/serviceSlice";
import { toast } from "react-toastify";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Layout,
  Row,
  Select,
  Space,
} from "antd";
import Sider from "antd/es/layout/Sider";
import Menu from "../../pages/Menu/Menu";
import { Content, Header } from "antd/es/layout/layout";
import TextArea from "antd/es/input/TextArea";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import axios from "axios";
import { db } from "../../Firebase";
import AvataProfile from "../../pages/profile/AvataProfile";

const AddService: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [size] = useState(12);
  const [loading, setLoading] = useState(false);
  const [numberRule, setNumberRule] = useState<string>("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleNumberRuleChange = (e: CheckboxValueType[]) => {
    const prefixSelected = e.includes("prefix_0001");
    const surfixSelected = e.includes("surfix_0001");
    const autoIncrementSelected = e.includes("0001_9999");

    if (prefixSelected && autoIncrementSelected) {
      setNumberRule("prefix_auto_increment");
    } else if (surfixSelected && autoIncrementSelected) {
      setNumberRule("surfix_auto_increment");
    } else if (autoIncrementSelected) {
      setNumberRule("auto_increment");
    } else {
      setNumberRule("");
    }
  };

  const generateNumber = (counter: number) => {
    // Generate a 4-digit number based on the counter value
    return String(counter).padStart(4, "0");
  };

  let previousMaDv = "";
  let surfixMaDv = "";
  let counter = 1;

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

  const randomState = () => {
    const randomValue = Math.random();
    if (randomValue < 1 / 2) {
      return "Hoạt động";
    } else {
      return "Ngưng hoạt động";
    }
  };

  const handleAddService = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Check if the selected number rule is valid
      if (!numberRule) {
        setLoading(false);
        toast.error("Vui lòng chọn ít nhất một quy tắc cấp số tự động!");
        return;
      }

      // Get the list of services from Firestore
      const querySnapshot = await getDocs(
        collection(getFirestore(), "Service")
      );
      const services = querySnapshot.docs.map((doc) => doc.data());

      let newMaDvCap = "";

      // Check if maDv has changed
      if (values.maDv !== previousMaDv) {
        // Reset the counter if maDv has changed
        counter = 1;
      }
      if (values.maDv !== surfixMaDv) {
        // Reset the counter if maDv has changed
        counter = 1;
      }

      // Generate a new unique maDvCap based on the selected number rule
      switch (numberRule) {
        case "prefix_auto_increment":
          newMaDvCap = `${values.maDv}${generateNumber(counter)}`;

          break;
        case "surfix_auto_increment":
          newMaDvCap = `${generateNumber(counter)}${values.maDv}`;
          break;
        case "auto_increment":
          newMaDvCap = `${values.maDv}${generateNumber(counter)}`;
          break;
      }
      // Check if the new maDvCap is unique
      const existingMaDvCap = services.map((service) => service.maDvCap);
      while (existingMaDvCap.includes(newMaDvCap)) {
        counter++;
        switch (numberRule) {
          case "prefix_auto_increment":
            newMaDvCap = `${values.maDv}${generateNumber(counter)}`;

            break;
          case "surfix_auto_increment":
            newMaDvCap = `${generateNumber(counter)}${values.maDv}`;
            break;
          case "auto_increment":
            newMaDvCap = `${values.maDv}${generateNumber(counter)}`;
            break;
        }
      }
      // Save the current maDv for the next submission
      previousMaDv = values.maDv;
      surfixMaDv = values.maDv;

      let service: Service = {
        maDv: values.maDv,
        maDvCap: newMaDvCap,
        tenDv: values.tenDv,
        moTa: values.moTa,
        trangThai: randomState(),
      };

      dispatch(addServiceToFirestore(service)).then(() => {
        setLoading(false);
        toast.success("Thêm dịch vụ thành công");
        navigate("/service");
      });

      // Save the current maDv for the next submission
      previousMaDv = values.maDv;
      await logUserAction(`Thêm dịch vụ ${getCurrentDateTime()}`);
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
              <Col span={8}>
                <div
                  style={{
                    fontSize: 15,
                    textAlign: "start",
                    color: "orange",
                  }}
                >
                  <p style={{ fontWeight: 500, color: "black" }}>
                    Dịch vụ &gt;
                    <Link to="/service" style={{ color: "black", left: 5 }}>
                      Danh sách dịch vụ &gt;
                    </Link>
                    <Link to="#" style={{ color: "orange", left: 5 }}>
                      Thêm dịch vụ
                    </Link>
                  </p>
                </div>
              </Col>
              <Col span={16}>
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
              <Form
                style={{ marginLeft: 15, marginRight: 15 }}
                initialValues={{ numberRule: [] }}
              >
                <Form.Item
                  name="numberRule"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ít nhất một quy tắc!",
                    },
                  ]}
                >
                  <Checkbox.Group onChange={handleNumberRuleChange}>
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
