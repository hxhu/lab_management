import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tabs, List, Tag } from 'antd';
import { get } from 'lodash'
import moment from 'moment';
import { VideoCameraAddOutlined, SettingOutlined, EditOutlined, DesktopOutlined } from '@ant-design/icons';
import {
  queryLogs
} from './service';
import "./Welcome.css";

const { TabPane } = Tabs;


export default () => {
  // const [logs, setLogs] = useState([[], [], [], []]);

  // const callback = () => {}

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const tmp = await queryLogs()
  //     setLogs(tmp.data)
  //   }

  //   fetchData()
  // }, []);

  return (
    <PageContainer>
      <Card>
        欢迎
        {/* <Tabs defaultActiveKey="0" onChange={callback}>
          <TabPane tab={<span><VideoCameraAddOutlined />节点增删</span>} key="0">
            <List
              itemLayout="horizontal"
              dataSource={logs[0]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={item.operation === "new" ? <Tag color="blue">N</Tag> : <Tag color="red">D</Tag> }
                    title={moment(get(item, 'timestamp', 0)).format('YYYY-MM-DD HH:mm:ss')}
                    description={item.message}
                  />
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab={<span><SettingOutlined />节点修改</span>} key="1">
            <List
              itemLayout="horizontal"
              dataSource={logs[1]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Tag color="green">M</Tag>}
                    title={moment(get(item, 'timestamp', 0)).format('YYYY-MM-DD HH:mm:ss')}
                    description={item.message}
                  />
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab={<span><DesktopOutlined />配置增删</span>} key="2">
            <List
              itemLayout="horizontal"
              dataSource={logs[2]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={item.operation === "new" ? <Tag color="blue">N</Tag> : <Tag color="red">D</Tag> }
                    title={moment(get(item, 'timestamp', 0)).format('YYYY-MM-DD HH:mm:ss')}
                    description={item.message}
                  />
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab={<span><EditOutlined />配置修改</span>} key="3">
            <List
              itemLayout="horizontal"
              dataSource={logs[3]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Tag color="green">M</Tag>}
                    title={moment(get(item, 'timestamp', 0)).format('YYYY-MM-DD HH:mm:ss')}
                    description={item.message}
                  />
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs> */}
      </Card>

    </PageContainer>
  )

};
