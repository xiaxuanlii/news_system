import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
import Home from './Home'
import UserManageList from './UserManageList'
import RightList from './RightManage/RightList'
import RoleList from './RightManage/RoleList'
import Nopermission from './Nopermission'
import './index.css'

import { Layout } from 'antd'
const { Content } = Layout;

export default function NewsSandBox() {
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          <Switch>
            <Route path='/home' component={Home} />
            <Route path='/user-manage/list' component={UserManageList} />
            <Route path="/right-manage/role/list" component={RoleList} />
            <Route path="/right-manage/right/list" component={RightList} />
            <Redirect from="/" to="/home" exact />
            <Route path="*" component={Nopermission} />
          </Switch>
        </Content>
      </Layout>
    </Layout>
  )
}
