import { useState, useEffect } from "react";
import { collection, doc, setDoc, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../Firebase";
import { addHours, format, isSameDay } from "date-fns";
import { formatToTimeZone } from "date-fns-timezone";
import { Button, Form, Layout, Modal, Select, Space, Row, Col } from "antd";
import Sider from "antd/es/layout/Sider";
import Menu from "../../pages/Menu/Menu";
import { Content, Header } from "antd/es/layout/layout";
import { Link } from "react-router-dom";

import { useAppSelector } from "../../hooks/storeHook";
import axios from "axios";
import AvataProfile from "../../pages/profile/AvataProfile";

const AddCapSo = () => {
  const { user } = useAppSelector((state) => state.auth);

  const [size] = useState(12);
  const [selectedService, setSelectedService] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [capSo, setCapSo] = useState({
    thuTu: 100,
    tenDichVu: "",
    ngayGioCap: "",
    hanSuDung: "",
  });

  useEffect(() => {
    const storedDate = localStorage.getItem("storedDate");
    const currentDate = new Date();

    if (storedDate && isSameDay(new Date(storedDate), currentDate)) {
      const storedThuTu = localStorage.getItem("storedThuTu") ?? "1";
      setCapSo((prevCapSo) => ({
        ...prevCapSo,
        thuTu: parseInt(storedThuTu),
      }));
    } else {
      localStorage.setItem("storedDate", currentDate.toISOString());

      const resetThuTu = async () => {
        const querySnapshot = await getDocs(collection(db, "capSo"));
        const numberOfDocuments = querySnapshot.size;

        if (numberOfDocuments === 0) {
          localStorage.setItem("storedThuTu", "1");
          setCapSo((prevCapSo) => ({
            ...prevCapSo,
            thuTu: 1,
          }));
        } else {
          localStorage.setItem("storedThuTu", "1");
        }
      };

      resetThuTu();
    }
  }, []);
  const actionTb = async (thaoTac: string) => {
    const response = await axios.get("https://api.ipify.org?format=json");
    const userIp = response.data.ip;
    if (user) {
      const newAccount = {
        email: user.email,
        timestamp: getCurrentDateTime(),
        ip: userIp,
        thaoTac,
      };

      await addDoc(collection(db, "thongBao"), newAccount);
    }
  };

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
  };
  const getCurrentDateTime = (): string => {
    const currentDate = new Date();
    return currentDate.toLocaleString();
  };

  const logUserAction = async (action: string) => {
    // Fetch the user's IP address using an external API
    const response = await axios.get("https://api.ipify.org?format=json");
    const userIp = response.data.ip;
    if (user) {
      const logData = {
        email: user.email,
        timestamp: getCurrentDateTime(),
        ip: userIp,
        action,
      };

      await addDoc(collection(db, "activityLog"), logData);
    }
  };

  const handlePrint = async () => {
    try {
      const capSoCollectionRef = collection(db, "capSo");
      const querySnapshot = await getDocs(capSoCollectionRef);
      const numberOfDocuments = querySnapshot.size;

      const newDocRef = doc(capSoCollectionRef);
      const ngayGioCap = new Date();
      const hanSuDung = addHours(ngayGioCap, 5);

      const vietnamTimeZone = "Asia/Ho_Chi_Minh";
      const formattedNgayGioCap = formatToTimeZone(
        ngayGioCap,
        "yyyy-MM-dd HH:mm:ss",
        { timeZone: vietnamTimeZone }
      );
      const formattedHanSuDung = formatToTimeZone(
        hanSuDung,
        "yyyy-MM-dd HH:mm:ss",
        { timeZone: vietnamTimeZone }
      );

      const getRandomSource = () => {
        const randomValue = Math.random();

        if (randomValue < 0.5) {
          return "Kiosk";
        } else {
          return "Hệ thống";
        }
      };
      // Lấy nguồn cấp ngẫu nhiên
      const randomSource = getRandomSource();

      const randomState = () => {
        const randomValue = Math.random();
        if (randomValue < 1 / 3) {
          return "Bỏ qua";
        } else if (randomValue < 2 / 3) {
          return "Đã sử dụng";
        } else {
          return "Đang chờ";
        }
      };

      const newCapSo = {
        ...capSo,
        thuTu: numberOfDocuments === 0 ? 100 : capSo.thuTu + 1,
        tenKhachHang: "Minh",
        soDt: "0123456789",
        email: "Minh@gmail.com",
        tenDichVu: selectedService,
        ngayGioCap: format(ngayGioCap, "dd/MM/yyyy HH:mm:ss"),
        hanSuDung: format(hanSuDung, "dd/MM/yyyy HH:mm:ss"),
        trangThai: randomState(),
        nguonCap: randomSource,
      };

      await setDoc(newDocRef, newCapSo);

      setCapSo(newCapSo);
      localStorage.setItem("storedThuTu", newCapSo.thuTu.toString());

      setModalOpen(true);

      await logUserAction(`Cập số mới ${getCurrentDateTime()}`);
      await actionTb(`Thời gian nhận số: ${getCurrentDateTime()}`);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
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
                    Cấp số mới
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
          <Content style={{ backgroundColor: "white", textAlign: "center" }}>
            <Form onFinish={handlePrint}>
              <p style={{ fontSize: 25, color: "orange" }}>CẤP SỐ MỚI</p>
              <p>Dịch vụ khách hàng lựa chọn</p>
              <Select
                style={{ width: 250 }}
                value={selectedService}
                onChange={handleServiceChange}
              >
                <option value="">Chọn dịch vụ</option>
                <option value="Khám tim mạch">Khám tim mạch</option>
                <option value="Khám sản - Phụ khoa">Khám sản - Phụ khoa</option>
                <option value="Khám răng hàm mặt">Khám răng hàm mặt</option>
                <option value="Khám tai mũi họng">Khám tai mũi họng</option>
              </Select>
            </Form>
            <Space size={size} style={{ paddingTop: 20 }}>
              <Link to="/number">
                <Button
                  style={{ borderColor: "orange", backgroundColor: "#fff7e6" }}
                >
                  Hủy bỏ
                </Button>
              </Link>
              <Button
                onClick={handlePrint}
                style={{ backgroundColor: "orange" }}
              >
                In số
              </Button>
            </Space>

            {modalOpen && (
              <Modal open={modalOpen} onCancel={handleModalClose}>
                <h3>Số thứ tự: {capSo.thuTu}</h3>
                <p>Dịch vụ: {capSo.tenDichVu}</p>
                <p>Ngày giờ cấp: {capSo.ngayGioCap}</p>
                <p>Giờ hạn sử dụng: {capSo.hanSuDung}</p>
              </Modal>
            )}
          </Content>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AddCapSo;
