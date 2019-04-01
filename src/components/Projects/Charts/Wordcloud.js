import React from "react";
import { ChartCard, TagCloud } from "ant-design-pro/lib/Charts";

const tags = [];
for (let i = 0; i < 50; i += 1) {
  tags.push({
    name: `TagClout-Title-${i}`,
    value: Math.floor(Math.random() * 50) + 20
  });
}
const Wordcloud = props => (
  <ChartCard title="Wordcloud">
    <TagCloud data={props.chartWordcloud} height={300} />
  </ChartCard>
);

export default Wordcloud;
