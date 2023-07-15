import { Button, Col, Form, Input, Layout, Row, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import Menu from "../../pages/Menu/Menu";
import { Content, Header } from "antd/es/layout/layout";
import { AccountsWithId, updateAccounts } from "../../features/accountsSlice";
import { toast } from "react-toastify";
import { getAuth, updatePassword } from "firebase/auth";

interface EditAccountParams {
  id: string;
  [key: string]: string | undefined;
}

const EditAccount: React.FC = () => {
  const [size] = useState(12);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams<EditAccountParams>();
  const [account, setAccount] = useState<AccountsWithId | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const accountsArray: AccountsWithId[] | undefined = useAppSelector(
    (state) => state.accounts.accountsArray
  );

  useEffect(() => {
    const selecteAccounts = accountsArray?.find(
      (accounts) => accounts.id === id
    );
    setAccount(selecteAccounts ?? null);
  }, [accountsArray, id]);

  const handleUpdateAccount = async () => {
    try {
      const values = await form.validateFields(); // Validate and get the updated form values

      if (account) {
        const updatedAccount: AccountsWithId = {
          id: account.id,
          accounts: {
            ...account.accounts,
            tenDn: values.tenDn,
            hoTen: values.hoTen,
            soDt: values.soDt,
            email: values.email,
            vaiTro: values.vaiTro,
            matKhau: values.matKhau,
            nhapMatKhau: values.nhapMatKhau,
            trangThai: values.trangThai,
          },
        };

        setLoading(true);

        await dispatch(updateAccounts(updatedAccount)).unwrap();
        // Update the password in Firebase Authentication
        const auth = getAuth();
        const user = auth.currentUser;
        if (user && values.matKhau !== "") {
          await updatePassword(user, values.matKhau);
        }
        setLoading(false);
        toast.success("Cập nhật thành công");
        navigate("/settings/accounts");
      }
    } catch (error) {
      console.error("Error updating account:", error);
      setLoading(false);
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
            <div
              style={{
                fontSize: 15,
                textAlign: "start",
                color: "orange",
              }}
            >
              <p style={{ fontWeight: 500, color: "black" }}>
                Cài đặt hệ thống &gt;
                <Link
                  to="/settings/accounts"
                  style={{ color: "black", left: 5 }}
                >
                  Quản lý tài khoản &gt;
                </Link>
                <Link to="#" style={{ color: "orange", left: 5 }}>
                  Cập nhật tài khoản
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
              Quản lý tài khoản
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
                Thêm tài khoản
              </p>
              {account && (
                <Form
                  layout="vertical"
                  form={form}
                  initialValues={{
                    tenDn: account.accounts.tenDn,
                    hoTen: account.accounts.hoTen,
                    email: account.accounts.email,
                    soDt: account.accounts.soDt,
                    matKhau: account.accounts.matKhau,
                    nhapMatKhau: account.accounts.nhapMatKhau,
                    vaiTro: account.accounts.vaiTro,
                    trangThai: account.accounts.trangThai,
                  }}
                  style={{ marginLeft: 15, marginRight: 15 }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Họ và tên"
                        name="hoTen"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên thiết bị!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="Số điện thoại"
                        name="soDt"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên thiết bị!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập địa chỉ!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="Vai trò"
                        name="vaiTro"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập địa chỉ!",
                          },
                        ]}
                      >
                        <Select>
                          <Select.Option value="kế toán">Kế toán</Select.Option>
                          <Select.Option value="quản lý">Quản lý</Select.Option>
                          <Select.Option value="admin">Admin</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Tên đăng nhập"
                        name="tenDn"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn loại thiết bị!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="Mật khẩu"
                        name="matKhau"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên đăng nhập!",
                          },
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>

                      <Form.Item
                        label="Nhập lại mật khẩu"
                        name="nhapMatKhau"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập mật khẩu!",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("matKhau") === value
                              ) {
                                return Promise.resolve();
                              }

                              toast.error("Mật khẩu không khớp!");
                            },
                          }),
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                      <Form.Item
                        label="Tình trạng"
                        name="trangThai"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập địa chỉ!",
                          },
                        ]}
                      >
                        <Select defaultValue={account?.accounts?.trangThai}>
                          <Select.Option value="Hoạt động">
                            Hoạt động
                          </Select.Option>
                          <Select.Option value="Ngưng hoạt động">
                            Ngưng hoạt động
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              )}
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
                  Hủy
                </Button>
                <Button
                  type="primary"
                  onClick={handleUpdateAccount}
                  loading={loading}
                >
                  Cập nhật
                </Button>
              </Space>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default EditAccount;
