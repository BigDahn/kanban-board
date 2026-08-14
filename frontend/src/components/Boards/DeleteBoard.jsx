import DeleteConfirmation from '../DeleteConfirmation';
import { useDeleteBoard, useGetBoard } from '../../hooks/useBoards';

import { useParams } from 'react-router-dom';
import { useKanban } from '@/context/Kanban';

function DeleteBoard({ boardName }) {
  const { dispatch } = useKanban();
  const { slug } = useParams();
  const { data } = useGetBoard();
  const { title } = data || {};
  const { mutate: deleteBoard, isPending } = useDeleteBoard(() =>
    dispatch({ type: 'CLOSE_BOARD' }),
  );
  return (
    <DeleteConfirmation
      boardName={boardName}
      isPending={isPending}
      type="board"
      onDelete={() => deleteBoard(slug)}
      title={title}
    />
  );
}

export default DeleteBoard;
