import { useState, useEffect } from "react";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { db } from "../../Firebase";
import { addHours, format, isSameDay } from "date-fns";
import { formatToTimeZone } from "date-fns-timezone";
import { Button, Form, Layout, Modal, Select, Space } from "antd";
import Sider from "antd/es/layout/Sider";
import Menu from "../../pages/Menu/Menu";
import { Content, Header } from "antd/es/layout/layout";
import { Link } from "react-router-dom";

const AddCapSo = () => {
  const [size] = useState(12);
  const [selectedService, setSelectedService] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [capSo, setCapSo] = useState({
    thuTu: 2000,
    tenDichVu: "",
    ngayGioCap: "",
    hanSuDung: "",
  });

  useEffect(() => {
    const storedDate = localStorage.getItem("storedDate");
    const currentDate = new Date();

    if (storedDate && isSameDay(new Date(storedDate), currentDate)) {
      const storedThuTu = localStorage.getItem("storedThuTu") ?? "2000";
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
          localStorage.setItem("storedThuTu", "2000");
        }
      };

      resetThuTu();
    }
  }, []);

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
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

      const newCapSo = {
        ...capSo,
        thuTu: numberOfDocuments === 0 ? 1 : capSo.thuTu + 1,
        tenDichVu: selectedService,
        ngayGioCap: format(ngayGioCap, "dd/MM/yyyy HH:mm:ss"),
        hanSuDung: format(hanSuDung, "dd/MM/yyyy HH:mm:ss"),
      };

      await setDoc(newDocRef, newCapSo);

      setCapSo(newCapSo);
      localStorage.setItem("storedThuTu", newCapSo.thuTu.toString());

      setModalOpen(true);
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
                Cấp số mới
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
          <Content style={{ backgroundColor: "white", textAlign: "center" }}>
            <Form>
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
