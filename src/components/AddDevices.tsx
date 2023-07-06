import { Col, Form, Input, Layout, Row, Select } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useReducer } from "react";
import Menu from "../pages/Menu/Menu";
import { Content, Header } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../hooks/storeHook";
import { addBookToFirestore } from "../features/deviceSlice";
import { toast } from "react-toastify";
interface AddState {
  maTb: string;
  loaiTb: string;
  tenTb: string;
  tenDn: string;
  diaChi: string;
  matKhau: string;
  dvsd: string;
}
type AddAction =
  | { type: "SET_MATB"; payload: string }
  | { type: "SET_LOAITB"; payload: string }
  | { type: "SET_TENTB"; payload: string }
  | { type: "SET_TENDN"; payload: string }
  | { type: "SET_DIACHI"; payload: string }
  | { type: "SET_MATKHAU"; payload: string }
  | { type: "SET_DVSD"; payload: string }
  | { type: "CLEAR_FORM" };

const initialState: AddState = {
  maTb: "",
  loaiTb: "",
  tenTb: "",
  tenDn: "",
  diaChi: "",
  matKhau: "",
  dvsd: "",
};

function addReducer(state: AddState, action: AddAction): AddState {
  switch (action.type) {
    case "SET_MATB":
      return { ...state, maTb: action.payload };
    case "SET_LOAITB":
      return { ...state, loaiTb: action.payload };
    case "SET_TENTB":
      return { ...state, tenTb: action.payload };
    case "SET_TENDN":
      return { ...state, tenDn: action.payload };
    case "SET_DIACHI":
      return { ...state, diaChi: action.payload };
    case "SET_MATKHAU":
      return { ...state, matKhau: action.payload };
    case "SET_DVSD":
      return { ...state, dvsd: action.payload };

    default:
      return state;
  }
}
const AddDevices: React.FC = () => {
  const dispatch = useAppDispatch();
  const [state, dispatchAdd] = useReducer(addReducer, initialState);
  const handleAddBook = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let book = {
      maTb: state.maTb,
      loaiTb: state.loaiTb,
      tenTb: state.tenTb,
      tenDn: state.tenDn,
      diaChi: state.diaChi,
      matKhau: state.matKhau,
      dvsd: state.dvsd,
    };

    dispatch(addBookToFirestore(book));
    toast.success("Add success");
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
                Thiết bị &gt;
                <Link to="/device" style={{ color: "black", left: 5 }}>
                  Danh sách thiết bị &gt;
                </Link>
                <Link to="/add-device" style={{ color: "orange", left: 5 }}>
                  Thêm thiết bị
                </Link>
              </p>
            </div>
          </Header>
          <Content style={{ margin: "24px 16px 0" }}>
            <p
              style={{
                fontSize: 25,
                fontWeight: 500,
                color: "orange",
                textAlign: "start",
              }}
            >
              Quản lý thiết bị
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
                Thêm thiết bị
              </p>
              <form onSubmit={handleAddBook}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Mã thiết bị">
                      <Input
                        placeholder="input placeholder"
                        required
                        onChange={(e) =>
                          dispatchAdd({
                            type: "SET_MATB",
                            payload: e.target.value,
                          })
                        }
                        value={state.maTb}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Loại thiết bị">
                      <Select
                        placeholder="Select a course type"
                        onChange={(value) =>
                          dispatchAdd({ type: "SET_LOAITB", payload: value })
                        }
                        value={state.loaiTb}
                      >
                        <Select.Option value="hard">Hard</Select.Option>
                        <Select.Option value="medium">Medium</Select.Option>
                        <Select.Option value="easy">Easy</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Tên thiết bị">
                      <Input
                        placeholder="input placeholder"
                        required
                        onChange={(e) =>
                          dispatchAdd({
                            type: "SET_TENTB",
                            payload: e.target.value,
                          })
                        }
                        value={state.tenTb}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Tên đăng nhập">
                      <Input
                        placeholder="input placeholder"
                        required
                        onChange={(e) =>
                          dispatchAdd({
                            type: "SET_TENDN",
                            payload: e.target.value,
                          })
                        }
                        value={state.tenDn}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Địa chỉ">
                      <Input
                        placeholder="input placeholder"
                        required
                        onChange={(e) =>
                          dispatchAdd({
                            type: "SET_DIACHI",
                            payload: e.target.value,
                          })
                        }
                        value={state.diaChi}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Mật khẩu">
                      <Input
                        placeholder="input placeholder"
                        required
                        onChange={(e) =>
                          dispatchAdd({
                            type: "SET_MATKHAU",
                            payload: e.target.value,
                          })
                        }
                        value={state.matKhau}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item label="Dịch vụ sử dụng">
                      <Input
                        placeholder="input placeholder"
                        required
                        onChange={(e) =>
                          dispatchAdd({
                            type: "SET_DVSD",
                            payload: e.target.value,
                          })
                        }
                        value={state.dvsd}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <button type="submit">Add</button>
              </form>
            </Content>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default AddDevices;
