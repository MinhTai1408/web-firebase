import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CapSoWithId } from "../../features/capSoSlice";
import { useAppSelector } from "../../hooks/storeHook";
import { Col, Form, Layout, Row } from "antd";
import Sider from "antd/es/layout/Sider";
import Menu from "../../pages/Menu/Menu";
import { Content, Header } from "antd/es/layout/layout";

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
                  Danh sách cấp số
                </Link>
                <Link to="#" style={{ color: "orange", left: 5 }}>
                  Chi tiết
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
                      <p>Tên dịch vụ: &ensp;{capSo.capSo.tenDichVu}</p>
                      <p>Sô thứ tự: &ensp;{capSo.capSo.thuTu}</p>
                      <p>Thời gian cấp: &ensp;{capSo.capSo.ngayGioCap}</p>
                      <p>Hạn sử dụng: &ensp;{capSo.capSo.hanSuDung}</p>
                      <p>Trạng thái hoạt động: &ensp;{capSo.capSo.trangThai}</p>
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
