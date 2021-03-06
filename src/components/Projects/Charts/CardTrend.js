import React from "react";

import { ChartCard, MiniArea } from "ant-design-pro/lib/Charts";
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
const Cardtrend = props => (
  <ChartCard
    title="Total"
    total={numeral(props.totalUser).format("0,0")}
    footer="Unique User"
    loading={props.loading}
  >
    <MiniArea line height={45} data={visitData} />
  </ChartCard>
);

export default Cardtrend;
