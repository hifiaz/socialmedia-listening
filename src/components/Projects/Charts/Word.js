import React from "react";
import _ from "lodash";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import DataSet from "@antv/data-set";

let data;
fetch({
  url:
    "https://alifd.alibabausercontent.com/materials/@bizcharts/other-word-cloud/0.3.5/mock.json",
  async: false,
  success: iData => {
    data = iData;
  }
});

class Word extends React.Component {
  render() {
    function getTextAttrs(cfg) {
      return _.assign({}, cfg.style, {
        fillOpacity: cfg.opacity,
        fontSize: cfg.origin._origin.size,
        rotate: cfg.origin._origin.rotate,
        text: cfg.origin._origin.text,
        textAlign: "center",
        fontFamily: cfg.origin._origin.font,
        fill: cfg.color,
        textBaseline: "Alphabetic"
      });
    } // 给point注册一个词云的shape

    Shape.registerShape("point", "cloud", {
      drawShape(cfg, container) {
        const attrs = getTextAttrs(cfg);
        return container.addShape("text", {
          attrs: _.assign(attrs, {
            x: cfg.x,
            y: cfg.y
          })
        });
      }
    });
    const dv = new DataSet.View().source(this.props.chartWordcloud);
    console.log(dv);
    const range = dv.range("value");
    const min = range[0];
    const max = range[1];
    dv.transform({
      type: "tag-cloud",
      fields: ["x", "value"],
      size: [window.innerWidth, window.innerHeight],
      font: "Verdana",
      padding: 0,
      timeInterval: 5000,

      // max execute time
      rotate() {
        let random = ~~(Math.random() * 4) % 4;

        if (random == 2) {
          random = 0;
        }

        return random * 90; // 0, 90, 270
      },

      fontSize(d) {
        if (d.value) {
          const divisor = max - min !== 0 ? max - min : 1;
          return ((d.value - min) / divisor) * (80 - 24) + 24;
        }

        return 0;
      }
    });
    const scale = {
      x: {
        nice: false
      },
      y: {
        nice: false
      }
    };
    console.log(this.props);
    return (
      <div>
        <Chart
          height={window.innerHeight}
          width={window.innerWidth}
          data={dv}
            scale={scale}
          padding={0}
          forceFit
        >
          <Tooltip showTitle={false} />
          <Coord reflect="y" />
          <Geom
            type="point"
            position="x*y"
            color="category"
            shape="cloud"
            tooltip="value*category"
          />
        </Chart>
      </div>
    );
  }
}

export default Word;
