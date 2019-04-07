import React from "react";
import { ChartCard, Pie } from "ant-design-pro/lib/Charts";

const Piechart = props => (
  <ChartCard contentHeight={300} loading={props.loading}>
    <Pie
      animate
      hasLegend
      height={294}
      subTitle="Total"
      total={() => (
        <span
          dangerouslySetInnerHTML={{
            __html: props.chartSentiment.reduce((pre, now) => now.y + pre, 0)
          }}
        />
      )}
      data={props.chartSentiment}
      valueFormat={val => <span dangerouslySetInnerHTML={{ __html: val }} />}
    />
  </ChartCard>
);

export default Piechart;
