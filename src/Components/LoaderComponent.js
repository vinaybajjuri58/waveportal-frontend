import React from "react";
import { EatLoading } from "react-loadingg";
export const LoaderComponent = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: "40%",
        left: "50%",
        zIndex: 10,
      }}
    >
      <EatLoading />
    </div>
  );
};
