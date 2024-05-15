import React from "react";

export default ({ params }: { params: { id: number } }) => {
  return <div>{params.id}</div>;
};
