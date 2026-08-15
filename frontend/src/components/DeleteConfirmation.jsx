import Delete from './Delete';
import VerifyDelete from './Profile/VerifyDelete';

function DeleteConfirmation({ boardName, isPending, onDelete, title, type }) {
  return (
    <>
      {type === 'board' || type === 'task' ? (
        <Delete
          boardName={boardName}
          isPending={isPending}
          onDelete={onDelete}
          title={title}
          type={type}
        />
      ) : (
        <VerifyDelete isPending={isPending} onDelete={onDelete} />
      )}
    </>
  );
}

export default DeleteConfirmation;
