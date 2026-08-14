import { useDeleteTask } from '@/hooks/useTasks';
import DeleteConfirmation from '../DeleteConfirmation';
import { useKanban } from '@/context/Kanban';

function DeleteTask({ taskId }) {
  const { dispatch } = useKanban();
  const { mutate: deleteTask, isPending } = useDeleteTask(() => {
    dispatch({ type: 'CLOSE_BOARD' });
  });

  return (
    <DeleteConfirmation
      type="task"
      isPending={isPending}
      onDelete={() => deleteTask({ taskId: taskId })}
    />
  );
}

export default DeleteTask;
