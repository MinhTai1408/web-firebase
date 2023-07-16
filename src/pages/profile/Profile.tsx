import React, { useEffect, useState } from "react";
import { Image, Button, Form, Input, Layout } from "antd";

import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getDoc, setDoc } from "firebase/firestore";
import { db } from "../../Firebase";
import { collection, doc } from "firebase/firestore";

import { logout } from "../../features/authSilce";
import Sider from "antd/es/layout/Sider";
import Menu from "../Menu/Menu";
import { CameraOutlined } from "@ant-design/icons";
import { Acounts } from "../../features/accountsSlice";

const Profile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [avatarURL, setAvatarURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [userData, setUserData] = useState<Acounts | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const storage = getStorage();
  const accountsState = useAppSelector((state) => state.accounts);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      // Fetch user data from Firestore
      const getUserData = async () => {
        try {
          const userDocRef = doc(collection(db, "Account"), user.id); // Fix collection reference here
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data() as Acounts;
            console.log("Fetched user data:", userData); // Debug statement to check fetched data
            setUserData(userData);
            setAvatarURL(userData?.avatarURL || null);
          } else {
            console.log("User data does not exist."); // Debug statement for non-existing user data
          }
        } catch (error) {
          console.log("Error fetching user data: ", error);
        }
      };

      getUserData();
    }
  }, [user, navigate]);
  const handleShowUploadForm = () => {
    setShowUploadForm(true);
  };

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
        const userDocRef = doc(collection(db, "Account"), user?.id); // Fix collection reference here
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

  return (
    <Layout>
      <Sider>
        <Menu />
      </Sider>
      <Layout>
        <div className="profile-avatar">
          {avatarURL ? (
            <Image width={200} src={avatarURL} alt="Avatar" />
          ) : (
            <div className="profile-avatar-placeholder">No avatar</div>
          )}
          <div className="profile-avatar-camera" onClick={handleShowUploadForm}>
            <CameraOutlined />
          </div>
          {userData && (
            <div>
              <h2>{userData.email}</h2>
              <p>Full Name: {userData.hoTen}</p>
              <p>Phone: {userData.soDt}</p>
              <p>Role: {userData.vaiTro}</p>
              <p>Status: {userData.trangThai}</p>
            </div>
          )}
        </div>

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
      </Layout>
    </Layout>
  );
};

export default Profile;
