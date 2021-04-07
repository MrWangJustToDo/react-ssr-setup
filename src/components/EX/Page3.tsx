import React from "react";
import { Link } from "react-router-dom";

let Page3 = () => {
  return (
    <div>
      123456 <p>this is page three</p>
      <Link to="/">回到首页</Link>
      <br/>
      <Link to="/welcome">去到dynamic</Link>
      <hr/>
    </div>
  );
};

export default Page3;
