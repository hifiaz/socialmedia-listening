import React from "react";
import { ChartCard, Field } from "ant-design-pro/lib/Charts";
import Trend from "ant-design-pro/lib/Trend";
import { Icon, Tooltip } from "antd";
import numeral from "numeral";

const Cardtext = () => (
  <div>
    <ChartCard
      title="Total Data"
      action={
        <Tooltip title="Total data">
          <Icon type="info-circle-o" />
        </Tooltip>
      }
      total={numeral(126560).format("0,0")}
      footer={
        <Field
          label="Per hari"
          value={numeral(12423).format("0,0")}
        />
      }
      contentHeight={46}
    >
      <span>
        Minggu Lalu
        <Trend flag="up" style={{ marginLeft: 8, color: "rgba(0,0,0,.85)" }}>
          12%
        </Trend>
      </span>
      <span style={{ marginLeft: 16 }}>
        Hari ini
        <Trend flag="down" style={{ marginLeft: 8, color: "rgba(0,0,0,.85)" }}>
          11%
        </Trend>
      </span>
    </ChartCard>
  </div>
);
export default Cardtext;
