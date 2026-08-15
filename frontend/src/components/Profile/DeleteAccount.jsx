import React from 'react';
import DeleteConfirmation from '../DeleteConfirmation';
import { useKanban } from '@/context/Kanban';
import { useDeleteUser } from '@/hooks/useAuth';

function DeleteAccount() {
  const { dispatch } = useKanban();
  const { mutate: deleteUser, isPending } = useDeleteUser(() => {
    dispatch({ type: 'CLOSE_BOARD' });
  });
  return (
    <DeleteConfirmation
      isPending={isPending}
      type="account"
      onDelete={(data) => deleteUser(data)}
    />
  );
}

export default DeleteAccount;
