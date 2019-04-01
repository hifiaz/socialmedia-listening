import React from "react";
import { ChartCard, Pie } from "ant-design-pro/lib/Charts";

const Piechart = props => (
  <ChartCard title="Sentiment" contentHeight={300}>
    <Pie
      hasLegend
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
