import { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/storeHook";
import {
  QueryDocumentSnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../Firebase";
import { Acounts } from "../../features/accountsSlice";
import { Popover, Layout } from "antd";
import { Badge } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import AvataProfile from "./AvataProfile";
import Meta from "antd/es/card/Meta";
import Card from "antd/es/card/Card";
import { Content, Header } from "antd/es/layout/layout";
interface ThongBao {
  id: string;
  email: string;

  thaoTac: string;
  // Add any other properties if they exist in the collection
}

const NotificationPopover: React.FC = () => {
  const [activity, setActivity] = useState<ThongBao[]>([]);
  const [searchEmail, setSearchEmail] = useState<string>("");

  useEffect(() => {
    const fetchActivityLog = async () => {
      try {
        const activityLog: ThongBao[] = [];
        const q = query(
          collection(db, "thongBao"),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);

        // Loop through the query snapshot to extract data and store it in the activityLog array
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          activityLog.push({
            id: doc.id,
            email: data.email,

            thaoTac: data.thaoTac,
            // Add any other properties if they exist in the collection
          });
        });

        // Apply the filter based on the search keyword (email)
        const filteredActivityLog = activityLog.filter((log) =>
          log.email.includes(searchEmail)
        );

        setActivity(filteredActivityLog);
      } catch (error) {
        console.error("Error fetching activity log:", error);
      }
    };
    fetchActivityLog();
  }, [searchEmail]);
  const content = (
    <Card title="Thông báo" style={{ maxHeight: "200px", overflowY: "auto" }}>
      {activity.map((activity) => (
        <div key={activity.id}>
          <strong>Email:</strong> {activity.email}
          <br />
          <strong>Action:</strong> {activity.thaoTac} <hr />
        </div>
      ))}
    </Card>
  );
  return (
    <div>
      <Popover placement="bottomRight" content={content}>
        <Badge count={activity.length}>
          <Meta
            avatar={
              <FontAwesomeIcon
                icon={faBell}
                style={{
                  fontSize: 13,
                  borderRadius: "80%",
                  background: "#ffe7ba",
                  color: "#ffc069",
                  padding: "5px",
                }}
              />
            }
          />
        </Badge>
      </Popover>
    </div>
  );
};
export default NotificationPopover;
