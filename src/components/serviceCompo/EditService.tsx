import Sider from "antd/es/layout/Sider";
import Layout from "antd/es/layout/layout";
import React from "react";
import Menu from "../../pages/Menu/Menu";

const EditService = () => {
  return (
    <div>
      <Layout>
        <Sider>
          <Menu />
        </Sider>
      </Layout>
    </div>
  );
};

export default EditService;
