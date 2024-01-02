import AddTaskButton from './AddTaskButton';
import Task from './Task';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import uuid from 'react-uuid';
import {useState} from "react";
import {Form, Input, Modal} from "antd";

const Column = ({ tag, currentEvent, events, setEvents }) => {
  const [visible,setVisible] = useState(false)
  const [form] = Form.useForm()
  const handleSubmit = () => {
    const name = form.getFieldValue().name
    const details = form.getFieldValue().details
    if (!(name && details)) return;
    setEvents((prev) => {
      const arrCopy = [...prev];
      const index = prev.findIndex(
        (event) => event.title === currentEvent.title
      );
      const eventCopy = arrCopy[index];
      // Remove old and add the latest data
      arrCopy.splice(index, 1, {
        ...eventCopy,
        [tag]: [
          ...eventCopy[tag],
          { name: name, id: uuid(), details: details },
        ],
      });
      return arrCopy;
    });
    setVisible(false)
  };

  const handleRemove = (id, e) => {
    // 禁止冒泡到上层:修改task
    e.stopPropagation();
    setEvents((prev) =>
      prev.map((event) => {
        if (event.title === currentEvent.title) {
          const taskList = event[tag];
          const index = taskList.findIndex((item) => item.id === id);
          taskList.splice(index, 1);
          return { ...event, [tag]: [...taskList] };
        } else {
          return event;
        }
      })
    );
  };

  const handleUpdate = (id) => {
    const name = prompt('Update task name:');
    const details = prompt('Update details:');
    if (!(name && details)) return;
    setEvents((prev) =>
      prev.map((event) => {
        if (event.title === currentEvent.title) {
          const taskList = event[tag];
          const index = taskList.findIndex((item) => item.id === id);
          const updatedTask = {
            ...taskList[index],
            name,
            details,
          };
          taskList.splice(index, 1);
          return { ...event, [tag]: [...taskList, updatedTask] };
        } else {
          return event;
        }
      })
    );
  };

  return (
    <div className='column'>
      {tag}
      <AddTaskButton handleClick={()=> {
        setVisible(true)
        form.setFieldValue(null)
      }} />
      <Droppable droppableId={tag}>
        {(provided, snapshot) => {
          return (
            <div
              className='task-container'
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {events
                .find((event) => event.title === currentEvent.title)
                ?.[tag].map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                          <Task
                            name={item.name}
                            details={item.details}
                            id={item.id}
                            provided={provided}
                            snapshot={snapshot}
                            handleRemove={handleRemove}
                            handleUpdate={handleUpdate}
                          />
                        )}
                    </Draggable>
                  ))}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
      <Modal open={visible} onCancel={()=>setVisible(false)} onOk={handleSubmit} title={"新增目录"}>
        <Form form={form}>
          <Form.Item name={'name'} label={'名称'}>
            <Input />
          </Form.Item>
          <Form.Item name={'details'} label={'详情'}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Column;
