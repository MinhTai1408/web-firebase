import React, { useEffect, useState } from "react";
import { Image, Col, Row, Button, Form, Input } from "antd";
import { Link } from "react-router-dom";

import { AuthForm } from "../../model/from";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../Firebase";

import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { login } from "../../features/authSilce";
import { useNavigate } from "react-router-dom";
import { Layout } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { LoginHistory } from "../../model/interfaces";
import { addDoc, collection } from "firebase/firestore";

const Login = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (Boolean(user)) {
      navigate("/profile");
    }
  }, [user, navigate]);

  const logLoginHistory = async (email: string, action: string) => {
    try {
      const response = await fetch("https://api64.ipify.org?format=json");
      const data = await response.json();
      const ip = data.ip;

      const historyData: LoginHistory = {
        email,
        timestamp: Date.now(),
        ip,
        action,
      };

      // Save the login history to Firestore
      await addDoc(collection(db, "loginHistory"), historyData);
    } catch (error) {
      console.error("Error logging login history:", error);
    }
  };
  const handleFormSubmit = async (values: AuthForm) => {
    setErrorMessage(null);
    setLoading(true);

    const { email, password } = values;
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      setLoading(false);
      if (user && user.email) {
        dispatch(
          login({
            email: user.email,
            id: user.uid,
            photoUrl: user.photoURL || null,
          })
        );
        logLoginHistory(user.email, "Login"); // Log the successful login
      }
    } catch (error: any) {
      const errorCode = error.code;
      setErrorMessage(errorCode);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <Layout>
          <Row>
            <Col flex={2}>
              {" "}
              <Image
                width={170}
                height={136}
                src={`${process.env.PUBLIC_URL}/asset/logo.png`}
                className=""
              />
              <div className="auth-container">
                <div className="auth-form-container">
                  {errorMessage && (
                    <p className="error-message">{errorMessage}</p>
                  )}
                  <Form onFinish={handleFormSubmit} className="auth-form">
                    <Form.Item
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your email",
                        },
                        {
                          type: "email",
                          message: "Please enter a valid email",
                        },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Email"
                        className="auth-input"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your password",
                        },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Password"
                        className="auth-input"
                      />
                    </Form.Item>
                    <Link to="/forgot" style={{ marginRight: 220 }}>
                      Quên mật khẩu ?
                    </Link>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="auth-button"
                        loading={loading}
                      >
                        Login
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </Col>
            <Col flex={3}>
              <Image
                width={700}
                height={590}
                src={`${process.env.PUBLIC_URL}/asset/Presentation1.jpg`}
              />
            </Col>
          </Row>
        </Layout>
      </div>
    </div>
  );
};

export default Login;
