import React from "react";
import Layout from "../components/Layout/Layout";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <Layout>
      <Link to="/" className="pnf-btn">
        <img src="/images/404.jpg" alt="404" />← Back to Dashboard
      </Link>
    </Layout>
  );
};

export default PageNotFound;
