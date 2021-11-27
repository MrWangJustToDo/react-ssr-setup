import React, { useEffect, useState } from "react";
import { FormattedNumber } from "react-intl";

export const B = () => {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setN((i) => i + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div>
      BBBBBB <FormattedNumber value={n} />
    </div>
  );
};

export default B;
