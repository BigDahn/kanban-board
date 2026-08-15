import { useKanban } from '@/context/Kanban';

function CreateBoardTrigger({ className, children = '+ Create New Board' }) {
  const { dispatch } = useKanban();

  return (
    <button
      className={className}
      onClick={() => dispatch({ type: 'OPEN_CREATE_BOARD' })}
    >
      {children}
    </button>
  );
}

export default CreateBoardTrigger;
