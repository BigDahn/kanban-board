import * as Dialog from '@radix-ui/react-dialog';
import EditTask from '../Tasks/EditTask';
import { useEffect, useRef } from 'react';
import DeleteConfirmation from '../DeleteConfirmation';
import DeleteTask from '../Tasks/DeleteTask';
import { useKanban } from '@/context/Kanban';

function SmallMenuTab({ task }) {
  const { isSmallMenuTabOpen, dispatch } = useKanban();

  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target))
        dispatch({ type: 'CLOSE_BOARD' });
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className=" ">
      <button
        onClick={(e) => {
          e.stopPropagation();

          dispatch({ type: 'TOGGLE_SMALL_MENUBAR' });
        }}
        className="absolute right-6 top-12 inline-flex size-[10px] appearance-none items-center justify-center rounded-full text-violet11 cursor-pointer bg-gray3 hover:bg-violet4"
        aria-label="Close"
      >
        <img src="/icon-vertical-ellipsis.svg" />
      </button>
      {isSmallMenuTabOpen && (
        <div className="absolute left-[50%] md:left-[84%] top-[16%] w-[170px] rounded-sm bg-primary-300 shadow-md shadow-primary-200 dark:bg-white dark:shadow-sm dark:shadow-gray-500 p-[10px] font-plus-jakarta-sans flex flex-col gap-3 z-50 ">
          <h2
            className="font-medium text-primary-600 hover:bg-white dark:hover:bg-primary-100 dark:hover:text-white py-[3px] px-[5px] rounded-[3px] text-[13px] cursor-pointer"
            onClick={() => {
              dispatch({ type: 'CLOSE_BOARD' }); // close all boards
              dispatch({ type: 'CLOSE_TASK_INFO' }); // close the task info
              dispatch({ type: 'OPEN_EDIT_TASK' }); // open edit task
            }}
          >
            Edit Task
          </h2>
          <h3
            className="font-medium hover:bg-white py-[3px] px-[5px] text-secondary-400 dark:hover:bg-primary-100 dark:hover:text-white text-[13px] rounded-[3px] cursor-pointer"
            onClick={() => {
              dispatch({ type: 'CLOSE_BOARD' }); // close dropdown
              dispatch({ type: 'OPEN_DELETE_MODAL' }); // open delete dialog
            }}
          >
            Delete task
          </h3>
        </div>
      )}
      <DeleteTask taskId={task?._id} />
    </div>
  );
}

export default SmallMenuTab;
