import { Col, Form, Layout, Row, Image, Input, Button, Space } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [size] = useState(12);
  const [form] = Form.useForm();

  return (
    <Layout>
      <Row>
        <Col flex={2}>
          <Image
            width={170}
            height={136}
            src={`${process.env.PUBLIC_URL}/asset/logo.png`}
            className=""
          />

          <Form
            form={form}
            layout="vertical"
            style={{
              paddingTop: 70,
              bottom: 20,
              marginLeft: "30px",
              marginRight: "20px",
            }}
          >
            <label
              style={{ fontSize: 20, fontWeight: 600, textAlign: "center" }}
            >
              Đặt lại mật khẩu
            </label>
            <Form.Item
              label="Vui lòng nhập email để đặt lại mật khẩu của bạn"
              style={{ textAlign: "center" }}
            >
              <Input />
            </Form.Item>
          </Form>

          <Form.Item style={{ paddingTop: 20 }}>
            <Space size={size}>
              <Button style={{ backgroundColor: " white", color: "#FF9138" }}>
                <Link to="/">Hủy</Link>
              </Button>
              <Button style={{ backgroundColor: "#FF9138", color: "white" }}>
                <Link to="/forgotnew">Tiếp tục</Link>
              </Button>
            </Space>
          </Form.Item>
        </Col>
        <Col flex={3}>
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

export default ForgotPassword;
