import React from "react";

import { Bar, ChartCard } from "ant-design-pro/lib/Charts";

const salesData = [];
for (let i = 0; i < 7; i += 1) {
  salesData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  });
}

const Barchart = props => (
  <ChartCard title="Potential Impressions" contentHeight={320}>
    <Bar title="Every Post" data={props.impression} />
  </ChartCard>
);

export default Barchart;
