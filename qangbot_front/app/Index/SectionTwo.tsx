import React from "react";
import Invest from "./Invest";
import SupportedExchanges from "./SupportedExchanges";

const SectionTwo = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:my-5 my-3 gap-3 justify-center sm:items-center">
      <SupportedExchanges />
      <Invest />
    </div>
  );
};

export default SectionTwo;
