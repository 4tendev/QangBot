import React from "react";

const Page = () => {
  return (
    <div>
      <div  className="flex justify-center md:justify-start alert  rounded-none h-12 md:ps-11 md:text-start absolute top-[80px] p-0  w-full left-0">
       <div className="w-full font-bold flex justify-center md:me-80">
        <button className="btn btn-ghost">
        {"  Your Share Value  :    1231231 USD     "}

        </button>
        </div>
      </div>

      <div className="w-full fixed  left-0 md:top-20 md:mt-2 md:left-1/2 bottom-0 md:flex gap-3">
        <button className="w-1/3 md:w-24 md:btn-sm md:rounded btn btn-success rounded-none">Deposit</button>
        <button className="w-1/3 md:w-24 md:btn-sm md:rounded btn btn-info rounded-none">History</button>
        <button className="w-1/3 md:w-24 md:btn-sm md:rounded btn btn-primary rounded-none">Withdraw</button>
      </div>
    </div>
  );
};

export default Page;
