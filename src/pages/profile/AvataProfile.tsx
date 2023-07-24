import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "antd";

import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../Firebase";
import { collection, doc } from "firebase/firestore";

import { UserOutlined } from "@ant-design/icons";
import { AccountsWithId, Acounts } from "../../features/accountsSlice";
import Avatar from "antd/es/avatar/avatar";

import NotificationPopover from "./Notifications";

const AvataProfile: React.FC = () => {
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
    <div>
      <Row style={{ backgroundColor: "#f5f5f5" }}>
        <Col span={16}>
          <Row>
            <Col span={2} style={{ left: 240, paddingTop: 5 }}>
              <NotificationPopover />
            </Col>
            <Col span={2}>
              <Avatar
                size={40}
                icon={<UserOutlined />}
                src={avatarURL}
                style={{
                  borderRadius: "80%",
                  backgroundColor: "orange",

                  left: 260,
                }}
              />
            </Col>
            <Col span={10} style={{ left: 290 }}>
              <Form layout="vertical">
                <Form.Item label="xin chào">
                  {accountData && (
                    <>
                      <a style={{ color: "black" }}>
                        {accountData.accounts.hoTen}
                      </a>
                    </>
                  )}
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default AvataProfile;
