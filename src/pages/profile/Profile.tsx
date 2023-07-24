import React, { useEffect, useState } from "react";
import { Form, Input, Layout, Row, Col } from "antd";

import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { Link, useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../Firebase";
import { collection, doc } from "firebase/firestore";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import Sider from "antd/es/layout/Sider";
import Menu from "../Menu/Menu";
import { CameraOutlined, UserOutlined } from "@ant-design/icons";
import { AccountsWithId, Acounts } from "../../features/accountsSlice";
import Avatar from "antd/es/avatar/avatar";
import { Content, Header } from "antd/es/layout/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Meta from "antd/es/card/Meta";
import NotificationPopover from "./Notifications";

const Profile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [avatarURL, setAvatarURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const [accountData, setAccountData] = useState<AccountsWithId | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const storage = getStorage();

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      // Fetch user data from Firestore
      const getUserData = async () => {
        try {
          // Kiểm tra xem email của tài khoản trong Firestore có giống với email trong Authentication hay không
          const accountsRef = collection(db, "Account");
          const querySnapshot = await getDocs(accountsRef);
          const accounts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            accounts: doc.data() as Acounts,
          }));

          const matchedAccount = accounts.find(
            (account) => account.accounts.email === user.email
          );
          const userDocRef = doc(collection(db, "users"), user.id);
          const userDocSnap = await getDoc(userDocRef);
          if (matchedAccount) {
            setAccountData(matchedAccount);
            setAvatarURL(matchedAccount.accounts.avatarURL || null);
          }
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setAvatarURL(userData?.avatarURL || null);
          }
        } catch (error) {
          console.log("Error fetching user data: ", error);
        }
      };

      getUserData();
    }
  }, [user, navigate]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLoading(true);

      const file = e.target.files[0];

      try {
        // Upload avatar image to Firebase Storage
        const storageRef = ref(storage, `avatars/${user?.id}/${file.name}`);
        await uploadBytes(storageRef, file);

        // Get the download URL of the uploaded image
        const avatarDownloadURL = await getDownloadURL(storageRef);

        // Save the download URL to Firestore
        const userDocRef = doc(collection(db, "users"), user?.id);
        await setDoc(
          userDocRef,
          { avatarURL: avatarDownloadURL },
          { merge: true }
        );

        setAvatarURL(avatarDownloadURL);
        setLoading(false);
      } catch (error) {
        console.log("Error uploading avatar: ", error);
        setLoading(false);
      }
    }
  };
  const handleShowUploadForm = () => {
    setShowUploadForm(true);
  };
  return (
    <Layout>
      <Sider style={{ width: 250 }}>
        <Menu />
      </Sider>
      <Layout>
        <Header style={{ backgroundColor: "#f5f5f5" }}>
          <Row gutter={16}>
            <Col span={8}>
              <p style={{ fontWeight: 500, color: "black" }}>Thông tin</p>
            </Col>
            <Col span={16}>
              <Row>
                <Col span={2} style={{ left: 320, paddingTop: 5 }}>
                  <NotificationPopover />
                </Col>
                <Col span={4}>
                  <Avatar
                    size={40}
                    icon={<UserOutlined />}
                    src={avatarURL}
                    style={{
                      borderRadius: "80%",
                      backgroundColor: "orange",
                      left: 320,
                    }}
                  />
                </Col>
                <Col span={8} style={{ left: 290 }}>
                  <Form layout="vertical">
                    <Form.Item label="xin chào">
                      {accountData && (
                        <a style={{ color: "black" }}>
                          {accountData.accounts.hoTen}
                        </a>
                      )}
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            </Col>
          </Row>
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>
          <Content style={{ backgroundColor: "white" }}>
            <Row>
              <Col span={8} style={{ textAlign: "center", paddingTop: 20 }}>
                {avatarURL ? (
                  <Avatar size={150} icon={<UserOutlined />} src={avatarURL} />
                ) : (
                  <div className="profile-avatar-placeholder">No avatar</div>
                )}
                <div
                  onClick={handleShowUploadForm}
                  style={{ marginLeft: 70, top: 10 }}
                >
                  <CameraOutlined />
                </div>
                <br />
                {accountData && (
                  <span style={{ textAlign: "center" }}>
                    {accountData.accounts.hoTen}
                  </span>
                )}
                {showUploadForm && (
                  <div className="avatar-upload">
                    <h3>Change Avatar</h3>
                    <Form>
                      <Form.Item>
                        <Input type="file" onChange={handleAvatarUpload} />
                      </Form.Item>
                    </Form>
                  </div>
                )}
              </Col>
              <Col span={16}>
                {accountData && (
                  <Form style={{ marginLeft: 15 }} layout="vertical">
                    <Row>
                      <Col span={8}>
                        <Form.Item label="Tên người dùng">
                          <Input
                            value={accountData.accounts.hoTen}
                            disabled
                            style={{ width: 250 }}
                          />
                        </Form.Item>
                        <Form.Item label="Số điện thoại">
                          <Input
                            value={accountData.accounts.soDt}
                            disabled
                            style={{ width: 250 }}
                          />
                        </Form.Item>
                        <Form.Item label="Email">
                          <Input
                            value={accountData.accounts.email}
                            disabled
                            style={{ width: 250 }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8} style={{ marginLeft: 120 }}>
                        <Form.Item label="Tên đăng nhập">
                          <Input
                            value={accountData.accounts.tenDn}
                            disabled
                            style={{ width: 250 }}
                          />
                        </Form.Item>
                        <Form.Item label="Mật khẩu">
                          <Input
                            value={accountData.accounts.matKhau}
                            disabled
                            style={{ width: 250 }}
                          />
                        </Form.Item>
                        <Form.Item label="Vai trò">
                          <Input
                            value={accountData.accounts.vaiTro}
                            disabled
                            style={{ width: 250 }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Col>
            </Row>
          </Content>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Profile;
