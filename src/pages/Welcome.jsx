import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tabs, List, Avatar } from 'antd';
import { CoffeeOutlined, WifiOutlined, DeploymentUnitOutlined, AppstoreAddOutlined, DatabaseOutlined } from '@ant-design/icons';
import "./Welcome.css";

const { TabPane } = Tabs;
const data = [
  [
    {
      title: "深度学习项目1"
    },
    {
      title: "深度学习项目2"
    },
    {
      title: "深度学习项目3"
    },
    {
      title: "深度学习项目4"
    }
  ],
  [
    {
      title: "物联网1"
    },
    {
      title: "物联网2"
    },
    {
      title: "物联网3"
    },
    {
      title: "物联网4"
    }
  ],
  [
    {
      title: "通信研究1"
    },
    {
      title: "通信研究2"
    },
    {
      title: "通信研究3"
    },
    {
      title: "通信研究4"
    }
  ],
  [
    {
      title: "其他项目1"
    },
    {
      title: "其他项目2"
    },
    {
      title: "其他项目3"
    },
    {
      title: "其他项目4"
    }
  ]
];


function callback(key) {
  console.log(key);
}

export default () => (
  <PageContainer>
    <Card>
      <Tabs defaultActiveKey="0" onChange={callback}>
        <TabPane tab={<span><CoffeeOutlined />深度学习</span>} key="0">
          <List
            itemLayout="horizontal"
            dataSource={data[0]}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<DatabaseOutlined />}
                  title={<a href="https://ant.design">{item.title}</a>}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab={<span><DeploymentUnitOutlined />物联网</span>} key="1">
          <List
            itemLayout="horizontal"
            dataSource={data[1]}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<DatabaseOutlined />}
                  title={<a href="https://ant.design">{item.title}</a>}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab={<span><WifiOutlined />通信研究</span>} key="2">
          <List
            itemLayout="horizontal"
            dataSource={data[2]}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<DatabaseOutlined />}
                  title={<a href="https://ant.design">{item.title}</a>}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab={<span><AppstoreAddOutlined />其他项目</span>} key="3">
          <List
            itemLayout="horizontal"
            dataSource={data[3]}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<DatabaseOutlined />}
                  title={<a href="https://ant.design">{item.title}</a>}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </Card>

  </PageContainer>
);
