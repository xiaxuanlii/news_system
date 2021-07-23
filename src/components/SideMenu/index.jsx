import React from 'react'
import {withRouter} from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import style from './index.module.css'

const { Sider } = Layout
const { SubMenu } = Menu;

const menuList = [
  {
    key: '/home',
    title: '首页',
    icon: <UserOutlined/>
  },
  {
    key:'/user-manage',
    title: '用户管理',
    icon:<UserOutlined/>,
    children: [
      {
        key:'/user-manage/list',
        title:'用户管理',
        icon:<UserOutlined/>
      }    
    ]
  },
  {
    key:'/right-manage',
    title:'权限管理',
    icon:<UserOutlined/>,
    children:[
      {
        key:'/right-manage/role/list',
        title:'角色列表',
        icon:<UserOutlined/>
      },
      {
        key:'/right-manage/right/list',
        title:'权限列表',
        icon:<UserOutlined/>
      }
    ]
  }
]

function SideMenu(props) {
  const renderMenu = (menuList) => {
    return menuList.map(item=>{
      const {key,title,icon} = item
      if(item.children){        
        return <SubMenu key={key} icon={icon} title={title}>
          {renderMenu(item.children)}
        </SubMenu>
      } 
      return <Menu.Item key={key} icon={icon} onClick={() => {
        props.history.push(key)
        // console.log(props);
      }}>{title}</Menu.Item>
    })
  }
  return (

    <Sider trigger={null} collapsible collapsed={false}>
      <div className={style.logo}>新闻发布管理系统</div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        {renderMenu(menuList)}
      </Menu>
    </Sider>

  )
}
export default withRouter(SideMenu)