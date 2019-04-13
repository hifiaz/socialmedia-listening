import React from "react";
import { ChartCard, Pie } from "ant-design-pro/lib/Charts";

const PiePercent = props => {
  return (
    <ChartCard loading={props.loading} style={{ marginTop: 24 }}>
      <Pie
        percent={props.totalID.total}
        subTitle={props.totalID.title}
        total={props.totalID.total + " %"}
        height={140}
      />
    </ChartCard>
  );
};

export default PiePercent;
