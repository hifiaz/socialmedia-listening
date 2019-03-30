import React, { Component } from "react";

import { ChartCard, MiniArea, Field } from "ant-design-pro/lib/Charts";
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
class Cardtrend extends Component {
  render() {
    return (
      <ChartCard
        title="Trend Data"
        total={numeral(8846).format("0,0")}
        footer={
          <Field
            label="Per hari"
            value={numeral(12423).format("0,0")}
          />
        }
      >
        <MiniArea line height={45} data={visitData} />
      </ChartCard>
    );
  }
}

export default Cardtrend;
