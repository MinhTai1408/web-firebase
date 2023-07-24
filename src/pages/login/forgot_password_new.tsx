import React from "react";
import { Image, Col, Row, Button, Form, Input, Layout } from "antd";
import { Link } from "react-router-dom";
const ForgotPasswordNew = () => {
  const [form] = Form.useForm();
  return (
    <Layout>
      <Row>
        <Col flex={2}>
          <Image
            width={170}
            height={136}
            src={`${process.env.PUBLIC_URL}/asset/logo.png`}
            style={{ marginLeft: 150 }}
          />
          <Form
            form={form}
            layout="vertical"
            style={{
              paddingTop: 50,
              bottom: 20,
              marginLeft: 30,
              marginRight: 20,
              textAlign: "center",
            }}
          >
            <label style={{ fontSize: 20, fontWeight: 600 }}>
              Đặt lại mật khẩu
            </label>
            <Form.Item label="Mật khẩu" name="password">
              <Input.Password />
            </Form.Item>
            <Form.Item label="Nhập lại mật khẩu" name="password">
              <Input.Password />
            </Form.Item>
          </Form>

          <Form.Item style={{ paddingTop: 20, textAlign: "center" }}>
            <Button style={{ backgroundColor: "#FF9138", color: "white" }}>
              <Link to="/">Xác nhận</Link>
            </Button>
          </Form.Item>
        </Col>
        <Col flex={0}>
          <Image
            width={700}
            height={590}
            src={`${process.env.PUBLIC_URL}/asset/poster.png`}
          />
        </Col>
      </Row>
    </Layout>
  );
};

export default ForgotPasswordNew;
