import React, {useCallback, useState} from 'react';
import AddEventButton from './AddEventButton';
import {Form, Input, message, Modal} from "antd";

const EventBar = ({ events, setEvents, currentEvent, setCurrentEvent }) => {
    const [title,setTitle] = useState('none title')
    const [visible,setVisible] = useState(false)
    const [form] = Form.useForm()
  const handleAdd = () => {

     setVisible(true)
     setTitle('输入标题')
  }

const handleSubmit = ()=>{
    form.validateFields().then(res=>{
        console.log(events)
        // Prevent Duplicated
        if (
          events.find((event) => event.title.toLowerCase() === res.title.toLowerCase())
        ) {
          message.error('事件名称已存在!')
          return;
        }
        // Add new event
        if (res.title)
          setEvents((prev) => [
            ...prev,
            {
              ...res,
              ['To do']: [],
              ['In progress']: [],
              ['Completed']: [],
            },
          ]);
        setVisible(false)
    })
        .catch(err=>{
            console.log(err)
        })
}


  return (
    <div className='event-bar'>
      <h1 className='event-bar-title'>.kanban</h1>
      <AddEventButton handleClick={handleAdd} />
      <div className='event-container'>
        {events.map((item) => (
          <div
            key={item.title}
            className={`event over-hide ${currentEvent.title === item.title ? 'selected-event' : ''
              }`}
            onClick={() => setCurrentEvent(item)}
          >
            {item.title}
          </div>
        ))}
      </div>
      <Modal open={visible} title={title} onCancel={()=>setVisible(false)} onOk={handleSubmit}>
          <Form form={form}>
              <Form.Item label={'名称'} name={'title'} rules={[{required: true,message:'名称不可为空'}]}>
                  <Input/>
              </Form.Item>
              <Form.Item label={'描述'} name={'description'} rules={[{required: true,message:'描述不可为空'}]}>
                  <Input/>
              </Form.Item>
          </Form>
      </Modal>
    </div>
  );
};

export default EventBar;
