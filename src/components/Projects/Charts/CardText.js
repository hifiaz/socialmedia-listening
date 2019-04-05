import React from "react";
import { ChartCard } from "ant-design-pro/lib/Charts";
import Trend from "ant-design-pro/lib/Trend";
import { Icon, Tooltip } from "antd";
import numeral from "numeral";

const Cardtext = props => (
  <div>
    <ChartCard
      title="Total"
      action={
        <Tooltip title="Total data">
          <Icon type="info-circle-o" />
        </Tooltip>
      }
      total={numeral(props.totalData).format("0,0")}
      footer="All Data"
      contentHeight={46}
      loading={props.loading}
    >
      <span>
        Week
        <Trend flag="up" style={{ marginLeft: 8, color: "rgba(0,0,0,.85)" }}>
          12%
        </Trend>
      </span>
      <span style={{ marginLeft: 16 }}>
        Today
        <Trend flag="down" style={{ marginLeft: 8, color: "rgba(0,0,0,.85)" }}>
          11%
        </Trend>
      </span>
    </ChartCard>
  </div>
);
export default Cardtext;
