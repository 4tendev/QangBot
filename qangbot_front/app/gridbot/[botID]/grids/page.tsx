
import React from "react";
import GridsTable from "./GridsTable";

export default ({ params }: { params: { botID: number } }) => {
  

  return (
    <div className="">

      <GridsTable botID={params.botID} />
      add grids
    </div>
  );
};
