import React, { Component } from "react";

import { ChartCard, MiniProgress, Field } from "ant-design-pro/lib/Charts";
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
class Cardprogress extends Component {
  render() {
    return (
      <ChartCard
        contentHeight={46}
        title="Trend Data"
        total={numeral(8846).format("0,0")}
        footer={<Field label="Per hari" value={numeral(12423).format("0,0")} />}
      >
        <MiniProgress percent={78} strokeWidth={8} target={80} />
      </ChartCard>
    );
  }
}

export default Cardprogress;
