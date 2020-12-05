import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tabs, Image, Tag } from 'antd';
import { get } from 'lodash'
import moment from 'moment';
import { VideoCameraAddOutlined, SettingOutlined, EditOutlined, DesktopOutlined } from '@ant-design/icons';
import {
  queryLogs
} from './service';
import "./Welcome.css";

const { TabPane } = Tabs;


export default () => {
  return (
    <PageContainer>
      <Card>
        <Image
          width={1600}
          src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607194086240&di=177e58e209ce697f6e516e67cdafc076&imgtype=0&src=http%3A%2F%2Fimg.iotworld.com.cn%2Feditorfiles%2F201905%2F3c1811f6e4364ad6849b5a65be11f547.jpg"
        />

      </Card>

    </PageContainer>
  )

};
