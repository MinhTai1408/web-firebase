import Sider from "antd/es/layout/Sider";
import Layout, { Header } from "antd/es/layout/layout";
import React, { useState } from "react";
import Menu from "../../pages/Menu/Menu";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form } from "antd";
import { useAppDispatch } from "../../hooks/storeHook";
interface EditParams {
  [key: string]: string | undefined;
  id: string;
}
const EditService = () => {
  const { id } = useParams<EditParams>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
                Dịch vụ &gt;
                <Link to="/service" style={{ color: "black", left: 5 }}>
                  Danh sách dịch vụ &gt;
                </Link>
                <Link to="#" style={{ color: "black", left: 5 }}>
                  Chi tiết &gt;
                </Link>
              </p>
            </div>
          </Header>
        </Layout>
      </Layout>
    </div>
  );
};

export default EditService;
