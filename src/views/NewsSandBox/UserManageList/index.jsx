import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Table, Button, Modal, Switch } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import UserManage from '../../../components/UserManage';

const { confirm } = Modal;

export default function UserManageList() {
  const [dataSource, setdataSource] = useState([])
  const [isAddVisible, setisAddVisible] = useState(false)
  const [isUpdateVisible, setisUpdateVisible] = useState(false)
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
  const [roleList, setroleList] = useState([])
  const [rigionList, setrigionList] = useState([])
  const [currentUpdate, setCurrentUpdate] = useState(null)

  // 删除按钮的回调
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
  // 删除用户，确认选项的回调
  function DeleteConfirm(item) {
    setdataSource(dataSource.filter((data) => { return data.id !== item.id }))
    axios.delete(`http://localhost:8000/users/${item.id}`)

  }

  // 添加用户按钮的回调
  const handleChange = (item) => {
    item.roleState = !item.roleState
    setdataSource([...dataSource])
    axios.patch(`http://localhost:8000/users/${item.id}`, {
      roleState: item.roleState
    })
  }
  // 添加用户，确定选项的回调
  const addFormOk = () => {
    addFormRef.current.validateFields().then(
      (value) => {
        setisAddVisible(false)
        addFormRef.current.resetFields()
        axios.post(`http://localhost:8000/users`, {
          ...value,
          "roleState": true,
          "default": false
        }).then((res) => {
          setdataSource([...dataSource, {
            ...res.data,
            role: roleList.filter((item) => {
              return item.id === value.roleId
            })[0]
          }])
          console.log(dataSource);
        })
      }
    ).catch((err) => {
      console.log(err);
    })
  }

  // 编辑用户的回调
  const handleUpdate = (item) => {
    setTimeout(() => {
      //不一定是同步执行
      setisUpdateVisible(true) 
      
      if(item.roleId===1){
        setisUpdateDisabled(true)
      }else{
        setisUpdateDisabled(false)
      }      

      //同步执行，但是setisUpdateVisible不一定是同步执行，所以会报错
      updateFormRef.current.setFieldsValue(item)
      //解决方法：设置一个异步任务，保证setisUpdateVisible以及
      // updateFormRef.current.setFieldsValue是同步执行完的
    }, 0)
    //选出正在更新的那一项
    setCurrentUpdate(item)
  }
  // 编辑用户，确认按钮的回调
  const updateFormOk = () => {
    updateFormRef.current.validateFields().then((value) => {
      setisUpdateVisible(false)
      setdataSource(dataSource.map((item) => {
        if(item.id===currentUpdate.id){
          // console.log(value,item);
          return{
            ...item,
            ...value,
            role: roleList.filter((data) => {
              return data.id === value.roleId
            })[0]
          }
        }
        return item
      }))
      setisUpdateDisabled(!isUpdateDisabled)
      axios.patch(`http://localhost:8000/users/${currentUpdate.id}`,value)
      
    }).catch((err) => {
      console.log(err);
    })
    
  }


  const addFormRef = useRef(null)
  const updateFormRef = useRef(null)

  useEffect(() => {
    axios.get('http://localhost:8000/users?_expand=role').then(
      (res) => {
        setdataSource(res.data)
      })
  }, [])
  useEffect(() => {
    axios.get('http://localhost:8000/regions').then(
      (res) => {
        setrigionList(res.data)
      })
  }, [])
  useEffect(() => {
    axios.get('http://localhost:8000/roles').then(
      (res) => {
        setroleList(res.data)
      })
  }, [])
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...rigionList.map((item) => ({
          text:item.title,
          value:item.value
        })),
        {
          text:'全球',
          value:'全球'
        }

      ],
      //value为勾选后传过来的值，item就是遍历的每一项
      onFilter:(value,item) => {
        if(value==='全球') return item.region===''
        return item.region===value
      },
      render: (region) => {
        return <strong>{region === '' ? '全球' : region}</strong>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
      render: (username) => {
        return username
      }
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default}
          onChange={() => handleChange(item)}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined />}
              disabled={item.default} onClick={() => showConfirm(item)}></Button>
            <Button type="primary" shape="circle" icon={<EditOutlined />}
              disabled={item.default} onClick={() => handleUpdate(item)}></Button>
          </div>
        )
      }
    }
  ]
  return (
    <div>
      <Button type="primary" onClick={() => { setisAddVisible(true) }}>添加用户</Button>
      <Table columns={columns} dataSource={dataSource}
        pagination={{ pageSize: 5 }} rowKey={item => item.id} />
      {/* 添加用户弹出框 */}
      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => setisAddVisible(false)}
        onOk={() => addFormOk()}
      >
        <UserManage ref={addFormRef} roleList={roleList}
          rigionList={rigionList}></UserManage>
      </Modal>

      {/* 更新用户弹出框 */}
      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setisUpdateVisible(false)
          setisUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => updateFormOk()}
      >
        <UserManage ref={updateFormRef} roleList={roleList}
          rigionList={rigionList} isUpdateDisabled={isUpdateDisabled}></UserManage>
      </Modal>
    </div>
  )
}

