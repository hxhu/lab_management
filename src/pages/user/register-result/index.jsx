import { Button, Result } from 'antd';
import { FormattedMessage, formatMessage, Link } from 'umi';
import React from 'react';
import styles from './style.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/user/login">
      <Button size="large" type="primary">
        <FormattedMessage id="返回登录" />
      </Button>
    </Link>
    <a href="https://www.baidu.com">
      <Button size="large">
        <FormattedMessage id="退出系统" />
      </Button>
    </a>
  </div>
);

const RegisterResult = ({ location }) => (
  <Result
    className={styles.registerResult}
    status="success"
    title={
      <div className={styles.title}>
        <FormattedMessage id="注册成功"/>
      </div>
    }
    subTitle={formatMessage({
      id: '同学你已经注册成功，请返回登录界面，登录以进入系统',
    })}
    extra={actions}
  />
);

export default RegisterResult;
