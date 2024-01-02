import React, {useCallback, useState} from 'react';
import Column from './Column';
import { DragDropContext } from 'react-beautiful-dnd';
import {Form, Input, Modal} from "antd";

const TaskBox = ({ events, setEvents, currentEvent, setCurrentEvent ,updateEvents}) => {

  const [open,setOpen] = useState(false)
  const [form] = Form.useForm()

  const handleRemove = useCallback(() => {
    if (confirm('你真的想删除它吗？')) {
      // update events
      setEvents((prev) => {
        const result = prev.filter((item) => item.title != currentEvent.title);
        // if event is empty
        if (!result.length) {
          // init the event
          const initEvent = [
            {
              title: 'Add a new Event',
              ['To do']: [],
              ['In progress']: [],
              ['Completed']: [],
            },
          ];
          setEvents(initEvent);
        } else {
          // set the first event as current
          setCurrentEvent(result[0]);
        }
        return result;
      });
    }
  }, [setEvents, setCurrentEvent, currentEvent.title]);

  const handeleEdit = useCallback(()=>{
    setOpen(true)
    form.setFieldValue('title',currentEvent.title)
    form.setFieldValue('description',currentEvent.description)
  },[form, currentEvent.title, currentEvent.description])

  const handeleEditSubmit = useCallback(  ()=>{
    const formData = form.getFieldValue()
    // 直接改数据,后期再优化
    let eventData = JSON.parse(localStorage.getItem('events'))
    const index = eventData.findIndex(item=>item.title === currentEvent.title)
    eventData[index].title = formData.title
    eventData[index].description = formData.description
    setTimeout(()=>{
      localStorage.setItem('events',JSON.stringify(eventData))
      setOpen(false)
      location.reload()
    },200)




  },[form, currentEvent.title])


  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const curEvent = events.find((item) => item.title === currentEvent.title);
    const taskCopy = curEvent[source.droppableId][source.index];
    setEvents((prev) =>
      prev.map((event) => {
        if (event.title === currentEvent.title) {
          let eventCopy = { ...event };
          // Remove from source
          const taskListSource = event[source.droppableId];
          taskListSource.splice(source.index, 1);
          eventCopy = { ...event, [source.droppableId]: taskListSource };
          // Add to destination
          const taskListDes = event[destination.droppableId];
          taskListDes.splice(destination.index, 0, taskCopy);
          eventCopy = { ...event, [destination.droppableId]: taskListDes };
          return eventCopy;
        } else {
          return event;
        }
      })
    );
  }, [events, setEvents, currentEvent.title]);

  return (
    <div className='task-box'>
      <header className='task-box-header'>
        <h1 className='task-box-title'>所有任务</h1>
        <button className='edit-button' onClick={handeleEdit}>
          编辑此事件
        </button>
        <button className='remove-button' onClick={handleRemove}>
          删除此事件
        </button>
      </header>
      <DragDropContext onDragEnd={(result) => handleDragEnd(result)}>
        <div className='task-box-body'>
          {
            ['To do', 'In progress', 'Completed'].map(tag => (
              <Column
                key={tag}
                tag={tag}
                events={events}
                setEvents={setEvents}
                currentEvent={currentEvent}
              />
            ))
          }
        </div>
      </DragDropContext>

      <Modal open={open} onCancel={()=>setOpen(false)} title={"编辑事件"} onOk={handeleEditSubmit}>
        <Form form={form}>
          <Form.Item label={'名称'} name={'title'} rules={[{required:true,message:'名称不可为空'}]}>
            <Input />
          </Form.Item>
          <Form.Item label={'描述'} name={'description'} rules={[{required:true,message:'名称不可为空'}]}>
            <Input/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskBox;
