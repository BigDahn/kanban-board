import { useDraggable } from '@dnd-kit/react';
import TaskList from './TaskList';

function DraggableTask({ task }) {
  const { ref } = useDraggable({
    id: task._id,
    data: {
      description: task.description,
      subTasks: task.subTasks,
      title: task.title,
      status: task.status,
    },
  });

  return (
    <div
      ref={ref}
      className="group flex flex-col bg-primary-400 dark:bg-white shadow-sm dark:shadow-gray-300 shadow-primary-300 px-4 py-3 rounded-md wrap-break-word capitalize"
    >
      <TaskList task={task} />
    </div>
  );
}

function TaskContainer({ tasks }) {
  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => {
        return <DraggableTask key={task._id} task={task} />;
      })}
    </div>
  );
}

export default TaskContainer;
