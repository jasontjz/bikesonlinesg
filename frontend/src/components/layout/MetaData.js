import React from "react";
import { Helmet } from "react-helmet";

const MetaData = ({ title }) => {
  return (
    <Helmet>
      <title>{`${title} at Bikes Online SG`}</title>
    </Helmet>
  );
};

export default MetaData;
