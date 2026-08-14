import * as Dialog from '@radix-ui/react-dialog';
import SmallMenuTab from '../ui/SmallMenuTab';
import { useFieldArray, useForm } from 'react-hook-form';

import { useGetBoard } from '../../hooks/useBoards';

import Select from '../ui/Select';
import { useEffect } from 'react';
import EditTask from './EditTask';
import { useEditTask } from '@/hooks/useTasks';
import MiniLoader from '../ui/MiniLoader';
import { useKanban } from '@/context/Kanban';
function TaskDialog({ task }) {
  const { isEditTaskOpen, isEditTaskId, isEditInfoOpen, dispatch } =
    useKanban();
  const { data } = useGetBoard();

  const { mutate: editTask, isPending } = useEditTask();

  const { column } = data || {};
  const { title, subTasks, status, description } = task;

  const defaultValues = {
    subTasks: subTasks.map((task) => ({
      title: task.title,
      completed: task.completed,
      id: task._id,
    })),
  };

  const currentColumn = column?.filter((column) => column.status !== status);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = useForm({ defaultValues });

  const watchTasks = watch('subTasks');

  const { fields } = useFieldArray({
    control,
    name: 'subTasks',
  });

  useEffect(() => {
    reset({
      subTasks: subTasks.map((task) => ({
        title: task.title,
        completed: task.completed,
        id: task._id,
      })),
    });
  }, [subTasks, reset]);

  const totalCompletedTask = watchTasks?.filter((task) => task.completed);
  const totalSubtasks = watchTasks?.length;

  const onSubmit = (data) => {
    editTask(
      { data: data, taskId: task._id },
      {
        onSuccess: () => {
          dispatch({ type: 'CLOSE_TASK_INFO' });
        },
      },
    );
  };

  return (
    <>
      <Dialog.Root
        open={isEditInfoOpen && task._id === isEditTaskId}
        onOpenChange={(open) => {
          if (!open) dispatch({ type: 'CLOSE_TASK_INFO' });
        }}
      >
        <Dialog.Trigger asChild>
          <div
            className="flex flex-col gap-1.5 cursor-pointer"
            onClick={() =>
              dispatch({ type: 'OPEN_TASK_INFO', payload: task._id })
            }
          >
            <h2 className="text-[15px] font-bold text-white dark:text-black group-hover:text-primary-100 dark:group-hover:text-primary-100 capitalize">
              {title}
            </h2>
            <h3 className="text-[12px] font-bold text-primary-600">
              {`${totalCompletedTask.length} of ${totalSubtasks} ${
                totalSubtasks > 1 ? 'subtasks' : 'subtask'
              }`}
            </h3>
          </div>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 max-h-[700px] md:max-h-[800px] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-primary-300 dark:bg-white p-[20px] md:p-[25px] focus:outline-none data-[state=open]:animate-contentShow flex flex-col gap-4 md:gap-6"
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              e.currentTarget.focus();
            }}
          >
            <Dialog.Title className=" relative m-0 text-[15px] font-bold capitalize wrap-break-word  text-white dark:text-black font-plus-jakarta-sans max-w-[80%]">
              {title}
            </Dialog.Title>
            <Dialog.Description className="font-medium text-[13px] text-primary-600 max-w-[94%] wrap-break-word capitalize">
              {description}
            </Dialog.Description>
            <div className="flex flex-col gap-[1em]">
              <div className="flex flex-col gap-[7px]">
                <label
                  htmlFor="subTasks"
                  className="text-[12px] font-bold text-primary-600"
                >
                  {`SubTasks ( ${totalCompletedTask.length} of ${totalSubtasks})`}
                </label>
                <div className="flex flex-col gap-2">
                  {fields.map((task, index) => {
                    const { title } = task;
                    return (
                      <div
                        key={index}
                        className="bg-primary-400 dark:bg-secondary-100 flex min-h-[40px]  gap-[1em] items-center p-2 rounded-[3px]"
                      >
                        <input
                          type="checkbox"
                          className="size-[16px] max-w-[12%]"
                          {...register(`subTasks.${index}.completed`)}
                        />
                        <h3
                          className={
                            watchTasks[index]?.completed
                              ? 'text-[12px] wrap-break-word font-medium max-w-[88%] text-primary-600 line-through dark:text-black/50 capitalize '
                              : 'text-[12px] wrap-break-word font-medium max-w-[88%] text-white dark:text-black capitalize '
                          }
                        >
                          {title}
                        </h3>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Select
                register={register}
                name="status"
                label="current status"
                column={currentColumn}
                currentStatus={status}
                style="text-white text-[13px] capitalize font-small dark:text-primary-600"
              />
              <SmallMenuTab task={task} />
            </div>
            <Dialog.Close asChild className="w-full">
              <button
                className={
                  !isDirty
                    ? 'flex py-[1em] h-[50px]  cursor-pointer items-center justify-center  bg-gray-300 rounded-full  font-medium leading-none text-[15px] text-black font-plus-jakarta-sans outline-none outline-offset-1 select-none relative'
                    : 'flex py-[1em] h-[50px]  cursor-pointer items-center justify-center  bg-primary-100 rounded-full  font-medium leading-none text-[15px] text-white font-plus-jakarta-sans outline-none outline-offset-1 select-none relative'
                }
                disabled={!isDirty}
                onClick={handleSubmit(onSubmit)}
              >
                {isPending ? <MiniLoader /> : <h2> Save Changes</h2>}{' '}
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      {isEditTaskOpen && <EditTask task={task} column={currentColumn} />}
    </>
  );
}

export default TaskDialog;
