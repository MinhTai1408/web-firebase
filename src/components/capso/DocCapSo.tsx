import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CapSoWithId } from "../../features/capSoSlice";
import { useAppSelector } from "../../hooks/storeHook";
import { Col, Form, Layout, Row } from "antd";
import Sider from "antd/es/layout/Sider";
import Menu from "../../pages/Menu/Menu";
import { Content, Header } from "antd/es/layout/layout";
import AvataProfile from "../../pages/profile/AvataProfile";

interface RouteParams {
  [key: string]: string | undefined;
  id: string;
}

const ReadCapSo: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [capSo, setCapSo] = useState<CapSoWithId | null>(null);
  const capSoArray: CapSoWithId[] | undefined = useAppSelector(
    (state) => state.capso.capSoList
  );

  useEffect(() => {
    const selectedCapSo = capSoArray?.find((capSo) => capSo.id === id);
    setCapSo(selectedCapSo ?? null);
  }, [capSoArray, id]);

  return (
    <div>
      <Layout>
        <Sider>
          <Menu />
        </Sider>
        <Layout>
          <Header style={{ backgroundColor: "#f5f5f5" }}>
            <Row>
              <Col span={8}>
                <div
                  style={{
                    fontSize: 15,
                    textAlign: "start",
                    color: "orange",
                  }}
                >
                  <p style={{ fontWeight: 500, color: "black" }}>
                    Cấp số &gt;
                    <Link to="/number" style={{ color: "black", right: 5 }}>
                      Danh sách cấp số &gt;
                    </Link>
                    <Link to="#" style={{ color: "orange", left: 5 }}>
                      Chi tiết
                    </Link>
                  </p>
                </div>
              </Col>
              <Col span={16}>
                <AvataProfile />
              </Col>
            </Row>
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
              Quản lý cấp số
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
                Thông tin thiết bị
              </p>
              {capSo && (
                <Form style={{ marginLeft: 15, marginRight: 15 }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <p>Tên khách hàng: &ensp;{capSo.capSo.tenKhachHang}</p>
                      <p>Tên dịch vụ: &ensp;{capSo.capSo.tenDichVu}</p>
                      <p>Sô thứ tự: &ensp;{capSo.capSo.thuTu}</p>
                      <p>Thời gian cấp: &ensp;{capSo.capSo.ngayGioCap}</p>
                      <p>Hạn sử dụng: &ensp;{capSo.capSo.hanSuDung}</p>
                    </Col>
                    <Col span={12}>
                      <p>Nguồn cấp: &ensp;{capSo.capSo.nguonCap}</p>
                      {/* Thêm chấm màu tương ứng với trạng thái */}
                      <p>
                        Trạng thái hoạt động:
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            marginLeft: 10,
                            display: "inline-block",
                            backgroundColor:
                              capSo.capSo.trangThai === "Bỏ qua"
                                ? "red"
                                : capSo.capSo.trangThai === "Đang chờ"
                                ? "blue"
                                : "green",
                          }}
                        />
                        &ensp;{capSo.capSo.trangThai}
                      </p>
                      <p>Số điện thoại: &ensp;{capSo.capSo.soDt}</p>
                      <p>Địa chỉ email: &ensp;{capSo.capSo.email}</p>
                    </Col>
                  </Row>
                </Form>
              )}
            </Content>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default ReadCapSo;
