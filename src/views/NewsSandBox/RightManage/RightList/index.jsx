import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Tag, Button, Modal, Popover,Switch } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal;

export default function RightList() {
  const [rightList, setRightList] = useState([])
  function showConfirm(item) {
    confirm({
      title: '您确认要删除此项吗?',
      icon: <ExclamationCircleOutlined />,
      // content: '',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        DeleteConfirm(item)
      },
      onCancel() {
      },
    });
  }
  function DeleteConfirm(item) {
    if (item.grade === 1) {
      setRightList(rightList.filter((data) => { return data.id !== item.id }))
      axios.delete(`http://localhost:8000/rights/${item.id}`)
    } else {
      let List = rightList.filter((data) => { return data.id === item.rightId })
      List[0].children = List[0].children.filter((data) => { return data.id !== item.id })
      setRightList([...rightList])
      axios.delete(`http://localhost:8000/children/${item.id}`)

    }
  }
  const switchMethod = (item) => {
    item.pagepermisson = (item.pagepermisson===1?0:1)
    setRightList([...rightList])
    if(item.grade===1){
      axios.patch(`http://localhost:8000/rights/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }else{
      axios.patch(`http://localhost:8000/children/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }
  }

  useEffect(() => {
    axios.get('http://localhost:8000/rights?_embed=children').then(
      (res) => {
        // 将只有一级列表设置为不可展开
        res.data.forEach((item) => {
          if (item.children.length === 0) {
            item.children = ''
          }
        })
        setRightList(res.data)
      })
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => {
        return <strong>{id}</strong>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      render: (key) => {
        return <Tag color='orange'>{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined />}
              onClick={() => showConfirm(item)}></Button>
            <Popover content={<div style={{textAlign:"center"}}>
              <Switch checked={item.pagepermisson} onChange={()=>switchMethod(item)}></Switch></div>} title="页面配置项" trigger={item.pagepermisson===undefined?'':"click"}>
              <Button type="primary" shape="circle" disabled={item.pagepermisson===undefined} icon={<EditOutlined />}></Button>
            </Popover>         
          </div>
        )
      }
    }
  ]
  return (
    <div>
      <Table columns={columns} dataSource={rightList} pagination={{pageSize: 5}} />
    </div>
  )
}
