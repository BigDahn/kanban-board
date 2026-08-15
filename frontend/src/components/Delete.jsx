import * as Dialog from '@radix-ui/react-dialog';
import { Trash } from 'lucide-react';
import MiniLoader from './ui/MiniLoader';
import { useKanban } from '@/context/Kanban';
function Delete({ boardName, isPending, onDelete, title, type }) {
  const { isDeleteModalOpen, dispatch } = useKanban();

  const handleDelete = () => {
    onDelete();
  };
  return (
    <Dialog.Root
      open={isDeleteModalOpen}
      onOpenChange={(open) => {
        if (!isPending && !open) dispatch({ type: 'CLOSE_BOARD' });
      }}
    >
      {type === 'board' && (
        <Dialog.Trigger asChild>
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: 'OPEN_DELETE_MODAL' });
            }}
          >
            <div className="flex items-center gap-1.5 cursor-pointer ">
              <Trash size={15} /> {boardName}
            </div>
          </button>
        </Dialog.Trigger>
      )}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content
          onMouseDown={(e) => e.stopPropagation()} // ← add here
          onInteractOutside={(e) => isPending && e.preventDefault()}
          onEscapeKeyDown={(e) => isPending && e.preventDefault()}
          className="fixed left-1/2 top-1/2 w-[96%] max-h-[85vh] md:w-[90vw] md:max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-primary-300 dark:bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow"
        >
          <Dialog.Title className="text-red-500 capitalize font-bold">
            {`Delete this ${type === 'board' ? 'Board' : 'Task'} ?`}
          </Dialog.Title>
          <Dialog.Description className="text-[16px] md:text-[15px] text-primary-600 font-medium font-plus-jakarta-sans py-4  max-w-[430px]">
            {type === 'board'
              ? ` Are you sure you want to delete the "${title}" board? This
              action will remove all columns and tasks and cannot be reversed.`
              : `Are you sure you want to delete this task? This action will
                remove this current task and cannot be reversed.`}
          </Dialog.Description>
          <div className=" flex flex-col gap-4  md:flex-row items-center md:justify-between md:pt-3">
            <button
              className={`${
                isPending
                  ? 'bg-secondary-300 cursor-pointer hover:bg-secondary-400 text-white rounded-full w-[295px] md:w-[200px] h-[45px] md:h-[50px]  text-[13px] font-bold font-plus-jakarta-sans hover:dark:bg-secondary-400 disabled:cursor-not-allowed relative dark:bg-secondary-300'
                  : 'bg-secondary-300 cursor-pointer hover:bg-secondary-400 text-white rounded-full w-[295px] md:w-[200px] h-[45px] md:h-[50px] text-[13px] font-bold font-plus-jakarta-sans disabled:cursor-not-allowed relative ease-linear dark:bg-secondary-300 hover:dark:bg-secondary-400'
              }`}
              aria-label="Close"
              disabled={isPending}
              onClick={(e) => {
                handleDelete(e);
              }}
            >
              {isPending ? (
                <MiniLoader />
              ) : (
                <h2> Delete {type === 'board' ? 'Board' : 'Task'}</h2>
              )}
            </button>

            <Dialog.Close asChild>
              <button
                className="bg-primary-50 hover:bg-white dark:hover:bg-primary-100 dark:hover:text-white cursor-pointer  text-primary-100 rounded-full w-[295px] md:w-[200px]  h-[45px] md:h-[50px]  text-[13px] font-bold font-plus-jakarta-sans disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Close"
                disabled={isPending}
                onClick={() => {
                  dispatch({ type: 'CLOSE_BOARD' });
                }}
              >
                Cancel
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Delete;
