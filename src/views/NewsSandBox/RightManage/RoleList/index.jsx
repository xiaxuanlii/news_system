import React, { useState, useEffect } from 'react'
import { Table, Button, Modal,Tree } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
// import RightList from '../RightList';

const { confirm } = Modal;

export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [rights, setRights] = useState([])
  const [currentRights, setCurrentRights] = useState([])
  const [currentId, setCurrentId] = useState(0)
  const [isModalVisible, setisModalVisible] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:8000/roles').then(
      (res) => {
        setDataSource(res.data)
      })
  }, [])
  useEffect(() => {
    axios.get('http://localhost:8000/rights?_embed=children').then(
      (res) => {
        setRights(res.data)
      })
  }, [])
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
    setDataSource(dataSource.filter((data) => { return data.id !== item.id }))
    axios.delete(`http://localhost:8000/roles/${item.id}`)
  }
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <strong>{id}</strong>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      render: (roleName) => {
        return <div>{roleName}</div>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined />}
              onClick={() => showConfirm(item)}></Button>
            <Button onClick={() => { 
              setisModalVisible(true)
              setCurrentRights(item.rights)
              setCurrentId(item.id)
             }} type="primary" shape="circle" icon={<EditOutlined />}></Button>
          </div>
        )
      }
    }
  ]
  const handleOk = () => {
    setisModalVisible(false)
    setDataSource(dataSource.map((data) => {
      if(data.id===currentId){
        return {
          ...data,
          rights: currentRights
        }
      }else{
        return data
      }
    }))
    axios.patch(`http://localhost:8000/roles/${currentId}`,{rights:currentRights})
  }
  const handleCancel = () => { setisModalVisible(false) }
  const onCheck = (checkKeys) => {setCurrentRights(checkKeys.checked)}
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} 
      rowKey={(item) => item.id}></Table>
      <Modal title="权限分配" visible={isModalVisible} 
      onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkStrictly
          // defaultExpandedKeys={['0-0-0', '0-0-1']}
          // defaultSelectedKeys={['0-0-0', '0-0-1']}
          checkedKeys={currentRights}
          // onSelect={onSelect}
          onCheck={onCheck}
          treeData={rights}
        />
      </Modal>
    </div>
  )
}
