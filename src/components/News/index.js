import React, { useState, useEffect } from "react";
import LayoutDefault from "../Layout/index";
import { List, Card } from "antd";

function News() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const key = process.env.REACT_APP_NEWS_KEY;
    fetch(
      `https://newsapi.org/v2/everything?q=prabowo&sortBy=publishedAt&apiKey=${key}`
    )
      .then(response => {
        return response.json();
      })
      .then(json => {
        var data = json.articles;
        setData(data);
      })
      .catch(err => console.log(err));
  }, []);
  return (
    <LayoutDefault>
      <h1>News</h1>
      <p>Berita terbaru berdasarkan keyword</p>
      <Card>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: page => {
              console.log(page);
            },
            pageSize: 3
          }}
          dataSource={data}
          footer={
            <div>
              <b>News</b>
            </div>
          }
          renderItem={item => (
            <List.Item
              key={item.title}
              actions={[<p>{item.source.name}</p>]}
              extra={<img width={272} alt={item.title} src={item.urlToImage} />}
            >
              <List.Item.Meta
                title={
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                }
                description={item.description}
              />
              {item.content}
            </List.Item>
          )}
        />
      </Card>
    </LayoutDefault>
  );
}

export default News;
