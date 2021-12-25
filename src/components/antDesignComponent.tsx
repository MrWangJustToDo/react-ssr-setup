import React from "react";
import { DatePicker, Carousel } from "antd";

const AntDesignComponent = () => {
  return (
    <>
      <h2>Ant Design</h2>
      <DatePicker />
      <br />
      <div style={{ width: "300px", borderRadius: "0.6rem", overflow: "hidden" }}>
        <Carousel autoplay>
          <div>
            <div style={{ height: "200px", backgroundColor: "#ccc", textAlign: "center", fontSize: "1.6rem" }}>1</div>
          </div>
          <div>
            <div style={{ height: "200px", backgroundColor: "#ccc", textAlign: "center", fontSize: "1.6rem" }}>2</div>
          </div>
          <div>
            <div style={{ height: "200px", backgroundColor: "#ccc", textAlign: "center", fontSize: "1.6rem" }}>3</div>
          </div>
          <div>
            <div style={{ height: "200px", backgroundColor: "#ccc", textAlign: "center", fontSize: "1.6rem" }}>4</div>
          </div>
        </Carousel>
      </div>
    </>
  );
};
export default AntDesignComponent;
