import React, { Component } from "react";
import { ChartCard, TagCloud } from "ant-design-pro/lib/Charts";

const tags = [];
for (let i = 0; i < 50; i += 1) {
  tags.push({
    name: `TagClout-Title-${i}`,
    value: Math.floor(Math.random() * 50) + 20
  });
}
class Wordcloud extends Component {
  render() {
    return (
      <ChartCard
      title="Wordcloud"
      >
        <TagCloud data={tags} height={300} />
      </ChartCard>
    );
  }
}

export default Wordcloud;
