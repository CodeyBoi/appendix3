import React from "react";
import Squircle from "../components/squircle";

const TestSquircle = () => {
  const squircles = [];
  for (let i = 0; i < 1000; i++) {
    squircles.push(<Squircle key={i} />);
  }
  return <div>{squircles}</div>;
};

export default TestSquircle;
