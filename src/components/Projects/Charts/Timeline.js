import React from "react";
import { TimelineChart, ChartCard } from "ant-design-pro/lib/Charts";

const chartData = [];
for (let i = 0; i < 20; i += 1) {
  chartData.push({
    x: new Date().getTime() + 1000 * 60 * 30 * i,
    y1: Math.floor(Math.random() * 100) + 1000,
    y2: Math.floor(Math.random() * 100) + 10
  });
}

const Timelinechart = props => (
  <ChartCard contentHeight={300}>
    <TimelineChart
      data={chartData}
      titleMap={{ y1: "客流量", y2: "支付笔数" }}
    />
  </ChartCard>
) || console.log(props);

export default Timelinechart;
