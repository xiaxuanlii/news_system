import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import style from './index.module.css'
import axios from 'axios'

const { Sider } = Layout
const { SubMenu } = Menu;
const iconList = {
  '/home': <UserOutlined />,
  '/user-manage': <UserOutlined />,
  '/user-manage/list': <UserOutlined />,
  '/right-manage': <UserOutlined />,
  '/right-manage/role/list': <UserOutlined />,
  '/right-manage/right/list': <UserOutlined />
}

function SideMenu(props) {
  const [menu, setMenu] = useState([])
  useEffect(() => {
    axios.get('http://localhost:8000/rights?_embed=children').then(
      (res) => {
        setMenu(res.data)
      }
    )
  }, [])
  const checkPagePermission = (item) => {
    return item.pagepermisson
  }
  const renderMenu = (menuList) => {
    return menuList.map(item => {
      const { key, title } = item
      // 渲染二级菜单
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return <SubMenu key={key} icon={iconList[item.key]} title={title}>
          {renderMenu(item.children)}
        </SubMenu>
      }
      //渲染一级菜单
      return checkPagePermission(item) && <Menu.Item key={key} icon={iconList[item.key]} onClick={() => {
        props.history.push(key)
      }}>{title}</Menu.Item>
    })
  }
  //设置刷新后扔高亮
  const selectKeys = [props.location.pathname]
  //设置刷新后一级菜单展开
  const openKeys = ['/'+props.location.pathname.split('/')[1]]

  return (

    <Sider trigger={null} collapsible collapsed={false}>
      <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
        <div className={style.logo}>新闻发布管理系统</div>
        <div style={{flex:1,overflow:"auto"}}>
          <Menu theme="dark" mode="inline" 
          selectedKeys={selectKeys} defaultOpenKeys={openKeys}>
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>

  )
}
export default withRouter(SideMenu)