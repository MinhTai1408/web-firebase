import React, { useEffect, useState } from "react";
import { Image, Col, Row, Button, Form, Input } from "antd";
import { Link } from "react-router-dom";

import { AuthForm } from "../../model/from";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../Firebase";

import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { login } from "../../features/authSilce";
import { useNavigate } from "react-router-dom";
import { Layout } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import axios from "axios";

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

  const handleFormSubmit = async (values: AuthForm) => {
    setErrorMessage(null);
    setLoading(true);

    const { email, password } = values;
    try {
      const auth = getAuth(); // Get the Auth instance

      const { user } = await signInWithEmailAndPassword(auth, email, password);

      setLoading(false);
      // Fetch the user's IP address using an external API
      const response = await axios.get("https://api.ipify.org?format=json");
      const userIp = response.data.ip;

      if (user && user.email) {
        dispatch(
          login({
            email: user.email,
            id: user.uid,
            photoUrl: user.photoURL || null,
          })
        );

        const getCurrentDateTime = (): string => {
          const currentDate = new Date();
          return currentDate.toLocaleString();
        };
        // Log the user's activity into Firestore
        const activityLogRef = collection(db, "activityLog");
        // Check if a log for this user already exists
        const querySnapshot = await getDocs(
          query(activityLogRef, where("email", "==", user.email))
        );
        const existingLog = querySnapshot.docs[0];
        if (existingLog) {
          // If a log exists, update the timestamp and IP address
          await updateDoc(existingLog.ref, {
            timestamp: getCurrentDateTime(),
            ip: userIp,
            action: `Đã đăng nhập - ${getCurrentDateTime()}`,
          });
        } else {
          // If no log exists, create a new log
          const activityData = {
            email: user.email,
            timestamp: getCurrentDateTime(),
            ip: userIp,
            action: `Đã đăng nhập - ${getCurrentDateTime()}`,
          };
          await addDoc(activityLogRef, activityData);
        }
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
              <Image
                width={170}
                height={136}
                src={`${process.env.PUBLIC_URL}/asset/logo.png`}
                style={{ marginLeft: 150 }}
              />

              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <Form
                onFinish={handleFormSubmit}
                style={{ marginLeft: 50, marginRight: 50 }}
                layout="vertical"
              >
                <Form.Item
                  label="Tên đăng nhập"
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
                  <Input prefix={<UserOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                  label="Mật khẩu"
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
                  />
                </Form.Item>
                <Link to="/forgot" style={{ color: "red" }}>
                  Quên mật khẩu ?
                </Link>
                <Form.Item
                  style={{
                    paddingTop: 25,
                    textAlign: "center",
                  }}
                >
                  <Button
                    htmlType="submit"
                    loading={loading}
                    style={{ background: "#fa8c16", color: "white" }}
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col flex={0}>
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
