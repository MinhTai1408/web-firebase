// NhatKyHoatDong.tsx
import { useEffect, useState } from "react";
import { Table } from "antd";
import { collection, getDocs } from "firebase/firestore/lite"; // Import 'collection' and 'getDocs' from 'firebase/firestore/lite' instead of 'firebase/firestore'
import { LoginHistory } from "../../model/interfaces";
import { db } from "../../Firebase";
// Import the LoginHistory interface

const NhatKyHoatDong = () => {
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);

  useEffect(() => {
    // Fetch login history from Firestore and update the state
    const fetchLoginHistory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "loginHistory"));
        const historyData: LoginHistory[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          historyData.push(data as LoginHistory);
        });
        setLoginHistory(historyData);
      } catch (error) {
        console.error("Error fetching login history:", error);
      }
    };

    fetchLoginHistory();
  }, []);

  const columns = [
    {
      title: "Tên Đăng Nhập",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Thời gian",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp: number) => new Date(timestamp).toLocaleString(),
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
    },
  ];

  return (
    <div>
      <h1>Nhật ký hoạt động</h1>
      <Table dataSource={loginHistory} columns={columns} />
    </div>
  );
};

export default NhatKyHoatDong;
