import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tabs, List, Tag } from 'antd';
import { VideoCameraAddOutlined, SettingOutlined, EditOutlined, DesktopOutlined } from '@ant-design/icons';
import "./Welcome.css";

const { TabPane } = Tabs;
const data = [
  [
    {
      title: "节点xxxxxx增加"
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
        <TabPane tab={<span><VideoCameraAddOutlined />节点增删</span>} key="0">
          <List
            itemLayout="horizontal"
            dataSource={data[0]}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Tag color="blue">N</Tag>}
                  title={<a href="https://ant.design">{item.title}</a>}
                  description="增加节点"
                />
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab={<span><SettingOutlined />节点修改</span>} key="1">
          <List
            itemLayout="horizontal"
            dataSource={data[1]}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Tag color="green">M</Tag>}
                  title={<a href="https://ant.design">{item.title}</a>}
                  description="节点修改"
                />
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab={<span><DesktopOutlined />配置增删</span>} key="2">
          <List
            itemLayout="horizontal"
            dataSource={data[2]}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Tag color="red">D</Tag>}
                  title={<a href="https://ant.design">{item.title}</a>}
                  description="删除配置"
                />
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab={<span><EditOutlined />配置修改</span>} key="3">
          <List
            itemLayout="horizontal"
            dataSource={data[3]}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Tag color="green">M</Tag>}
                  title={<a href="https://ant.design">{item.title}</a>}
                  description="配置修改"
                />
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </Card>

  </PageContainer>
);
