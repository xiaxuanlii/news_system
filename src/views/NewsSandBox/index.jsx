import React from 'react'
import {Switch, Redirect, Route} from 'react-router-dom'
import SideMenu from '../../components/SideMenu'  
import TopHeader from '../../components/TopHeader'  
import Home from './Home'
import UserManageList from './UserManageList'
import RightList from './RightManage/RightList'
import RoleList from './RightManage/RoleList'
import Nopermission from './Nopermission'

export default function NewsSandBox() {
  return (
    <div>
      <SideMenu></SideMenu>
      <TopHeader></TopHeader>
      <Switch>
        <Route path='/home' component={Home}/>
        <Route path='/user-manage/list' component={UserManageList}/>
        <Route path="/right-manage/role/list" component={RoleList}/>
        <Route path="/right-manage/right/list" component={RightList}/>
        <Redirect from="/" to="/home" exact/>
        <Route path="*" component={Nopermission}/>
      </Switch>
    </div>
  )
}
