import * as Dialog from '@radix-ui/react-dialog';
import { useForm, useFieldArray } from 'react-hook-form';
import { HexColorPicker } from 'react-colorful';
import { Pen } from 'lucide-react';
import { SquarePen } from 'lucide-react';
import Select from '../ui/Select';
import { useEditTask } from '@/hooks/useTasks';
import MiniLoader from '../ui/MiniLoader';
import { useKanban } from '@/context/Kanban';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

function EditTask({ task, column: currentColumn }) {
  const { isEditTaskOpen, isEditTaskId, dispatch } = useKanban();
  const { title, description, subTasks, status } = task;
  const { mutate: editTask, isPending } = useEditTask();

  const defaultValues = {
    title,
    description,
    status,
    subTasks: subTasks.map((task) => ({
      title: task.title,
      completed: task.completed,
      id: task._id,
    })),
  };
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subTasks',
  });

  const onSubmit = (data) => {
    editTask(
      { data: data, taskId: task._id },
      {
        onSuccess: () => {
          dispatch({ type: 'CLOSE_EDIT_TASK' });
        },
      },
    );
  };
  return (
    <Dialog.Root
      open={isEditTaskOpen && task._id === isEditTaskId}
      onOpenChange={(open) => {
        if (!open) dispatch({ type: 'CLOSE_EDIT_TASK' });
      }}
    >
      <Dialog.Trigger
        asChild
        onClick={(e) => {
          e.stopPropagation();
        }}
      ></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[600px] md:max-h-[800px] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-primary-300 dark:bg-white p-[20px] md:p-[25px] overflow-y-scroll custom-scroll focus:outline-none data-[state=open]:animate-contentShow">
          <VisuallyHidden asChild>
            <Dialog.Description>Edit current task.</Dialog.Description>
          </VisuallyHidden>
          <Dialog.Title className="m-0 text-[15px] flex flex-col justify-evenly h-full gap-3 font-bold capitalize  text-white dark:text-black font-plus-jakarta-sans">
            Edit Task
          </Dialog.Title>
          <div className="flex flex-col gap-3 py-[0.8em]">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="title"
                className="font-medium text-[15px] text-white dark:text-black capitalize"
              >
                Title
              </label>
              <div className="flex flex-col w-full gap-1">
                <input
                  type="text"
                  name="title"
                  defaultValue={title}
                  {...register('title', {
                    required: 'This field is required',
                  })}
                  className="h-[43px] outline-none px-3 rounded-sm dark:text-black text-white border border-white dark:border-gray-300 dark:hover:border-primary-100 hover:border-primary-100"
                />
                {errors?.title && (
                  <p className="text-[7px] text-secondary-400 capitalize font-bold">
                    {errors.title.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="description"
                className="font-medium text-[15px] text-white dark:text-black capitalize"
              >
                description
              </label>
              <textarea
                type="text"
                name="description"
                defaultValue={description}
                placeholder="e.g. It’s always good to take a break.This 15 minute break will recharge the batteries a little."
                className="h-[125px] outline-none px-3 rounded-sm py-2 text-white border border-white dark:text-black dark:border-gray-300 overflow-y-scroll custom-scroll dark:hover:border-primary-100 hover:border-primary-100"
                {...register('description')}
              />
            </div>
            <div>
              <label
                htmlFor="subTasks"
                className="font-medium text-[15px] text-white capitalize dark:text-black"
              >
                subtasks
              </label>
              <div className="flex flex-col gap-2 py-2">
                {fields.map((field, index) => {
                  const { title } = field;
                  return (
                    <div className="flex flex-col gap-[0.3em]" key={index}>
                      <div>
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            name="subTasks"
                            defaultValue={title}
                            className="h-[45px] outline-none border-white dark:border-gray-300 dark:text-black border-[0.6px] rounded-sm w-full px-3 text-white text-[15px] font-plus-jakarta-sans dark:hover:border-primary-100 hover:border-primary-100"
                            {...register(`subTasks.${index}.title`, {
                              required: 'This field is required',
                            })}
                          />
                          <button
                            onClick={() => remove(index)}
                            className="cursor-pointer"
                          >
                            <img src="/icon-cross.svg" className="w-[15px]" />
                          </button>
                        </div>
                        {errors?.subTasks && (
                          <p className="text-[7px] text-secondary-400 capitalize font-bold">
                            {errors.subTasks[index]?.title?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    append({
                      title: '',
                      completed: false,
                    });
                  }}
                  className="text-primary-100 rounded-full bg-white dark:bg-primary-100/25 dark:text-primary-100  py-3 cursor-pointer hover:bg-primary-600 hover:text-white transition-all ease-linear duration-200 dark:hover:bg-primary-600 dark:hover:text-white"
                >
                  Add Subtask
                </button>
              </div>
            </div>
            <Select
              register={register}
              errors={errors}
              label="status"
              name="status"
              column={currentColumn}
              currentStatus={status}
            />
            <Dialog.Close asChild className="w-full">
              <button
                className={
                  !isDirty
                    ? 'flex py-[1em] h-[50px]  items-center justify-center  bg-secondary-100 rounded-full  font-medium leading-none text-[15px] text-black/25 font-plus-jakarta-sans outline-none outline-offset-1 select-none relative  dark:bg-primary-100/25 dark:text-primary-600 cursor-not-allowed transition-all ease-linear duration-200'
                    : 'flex py-[1em] h-[50px]  cursor-pointer items-center justify-center  bg-primary-100 rounded-full  font-medium leading-none text-[15px] text-white font-plus-jakarta-sans outline-none outline-offset-1 select-none relative hover:bg-primary-600  dark:bg-primary-100 dark:hover:bg-primary-600 dark:hover:text-white transition-all ease-linear duration-200'
                }
                disabled={!isDirty}
                onClick={handleSubmit(onSubmit)}
              >
                {isPending ? <MiniLoader /> : <h2> Save Changes</h2>}{' '}
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              className="absolute right-6 top-7.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 cursor-pointer bg-gray3 hover:bg-violet4"
              aria-label="Close"
            >
              <img src="/icon-cross.svg" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default EditTask;
