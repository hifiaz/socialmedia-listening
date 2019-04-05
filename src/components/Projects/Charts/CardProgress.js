import React from "react";

import { ChartCard, MiniProgress } from "ant-design-pro/lib/Charts";
import numeral from "numeral";
import moment from "moment";

const visitData = [];
const beginDay = new Date().getTime();
for (let i = 0; i < 20; i += 1) {
  visitData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format(
      "YYYY-MM-DD"
    ),
    y: Math.floor(Math.random() * 100) + 10
  });
}
const Cardprogress = props => (
  <ChartCard
    contentHeight={46}
    title="Total"
    total={numeral(props.totalImpression).format("0,0")}
    footer="Potential Impression"
    loading={props.loading}
  >
    <MiniProgress percent={78} strokeWidth={8} target={80} />
  </ChartCard>
);

export default Cardprogress;
