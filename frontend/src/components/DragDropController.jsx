import { DragDropProvider } from '@dnd-kit/react';
import { useEditTask } from '@/hooks/useTasks';

function DragDropController({ children }) {
  const { mutate: editTask } = useEditTask();
  return (
    <DragDropProvider
      onDragEnd={({ operation }) => {
        const { source, target } = operation;

        if (!target) return;

        const { title, description, subTasks } = source.data;

        const updatedTask = {
          title,
          description,
          subTasks,
          status: target.id,
        };

        editTask({ data: updatedTask, taskId: source.id });
      }}
    >
      {children}
    </DragDropProvider>
  );
}

export default DragDropController;
