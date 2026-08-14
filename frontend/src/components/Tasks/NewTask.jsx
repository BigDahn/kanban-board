import { useForm, useFieldArray } from 'react-hook-form';
import * as Dialog from '@radix-ui/react-dialog';
import { useGetBoard } from '../../hooks/useBoards';
import Select from '../ui/Select';
import { useCreateTask } from '../../hooks/useTasks';
import { useParams } from 'react-router-dom';
import MiniLoader from '../ui/MiniLoader';
import { useKanban } from '@/context/Kanban';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

function NewTask() {
  const { isCreateTaskOpen, dispatch } = useKanban();
  const { data } = useGetBoard();
  const { mutate: createTask, isPending } = useCreateTask();
  const { slug } = useParams();

  const { column } = data || {};

  const defaultValues = {
    subtasks: [
      {
        title: '',
        completed: false,
      },
      {
        title: '',
        completed: false,
      },
    ],
  };

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    name: 'subtasks',
    control,
  });

  const onSubmit = (data) => {
    createTask(
      { data, slug },
      {
        onSuccess: () => {
          dispatch({ type: 'CLOSE_CREATE_TASK' });
          setTimeout(() => reset(defaultValues), 200);
        },
      },
    );
  };

  return (
    <Dialog.Root
      open={isCreateTaskOpen}
      onOpenChange={(open) => {
        if (!open) dispatch({ type: 'CLOSE_CREATE_TASK' });
      }}
    >
      <Dialog.Trigger asChild>
        <button
          className="text-white w-[54px] h-[30px]  md:w-41 md:h-12 cursor-pointer flex items-center justify-center bg-primary-100 rounded-xl md:rounded-full font-bold"
          onClick={() => dispatch({ type: 'OPEN_CREATE_TASK' })}
        >
          <h3 className="hidden  md:flex md:text-[15px]">+AddNewTask</h3>
          <img
            src="/icon-add-task-mobile.svg"
            className="flex items-center justify-center h-[12px]  md:hidden"
          />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50">
          <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[600px] md:max-h-[800px] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-primary-300 dark:bg-white p-[20px] md:p-[25px] overflow-y-scroll custom-scroll focus:outline-none data-[state=open]:animate-contentShow">
            <div className="flex justify-between items-center font-plus-jakarta-sans">
              <VisuallyHidden asChild>
                <Dialog.Description>
                  Create a new task with a title, description, and status.
                </Dialog.Description>
              </VisuallyHidden>
              <Dialog.Title className="text-white capitalize font-bold text-[16px] dark:text-black">
                Add New Task
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="cursor-pointer hover:text-red-600">
                  <img src="/icon-cross.svg" />
                </button>
              </Dialog.Close>
            </div>
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
                    {...register('title', {
                      required: 'This field is required',
                    })}
                    className="h-[43px] outline-none px-3 rounded-sm  text-white border border-white dark:border-gray-300 dark:text-black dark:hover:border-primary-100"
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
                  placeholder="e.g. It’s always good to take a break.This 15 minute break will recharge the batteries a little."
                  className="h-[7rem] outline-none px-3 rounded-sm py-2 text-white border border-white dark:border-gray-300 dark:text-black dark:hover:border-primary-100"
                  {...register('description')}
                />
              </div>
              <div>
                <label
                  htmlFor="subtasks"
                  className="font-medium text-[15px] text-white dark:text-black capitalize"
                >
                  subtasks
                </label>
                <div className="flex flex-col gap-2 py-2">
                  {fields.map((field, index) => {
                    return (
                      <div className="flex flex-col gap-[0.3em]" key={index}>
                        <div>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              name="subtasks"
                              className="h-[45px] outline-none border-white border-[0.6px] rounded-sm w-full px-3 text-white text-[15px] font-plus-jakarta-sans 
                              dark:border-gray-300 
                              dark:hover:border-primary-100
                              dark:text-black"
                              {...register(`subtasks.${index}.title`, {
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
                          {errors?.subtasks && (
                            <p className="text-[7px] text-secondary-400 capitalize font-bold">
                              {errors.subtasks[index]?.title?.message}
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
                column={column}
              />
              <Dialog.Close asChild className="w-full">
                <button
                  className="flex py-[1em] h-[50px]  cursor-pointer items-center justify-center  bg-primary-100 rounded-full  font-medium leading-none text-[15px] text-white font-plus-jakarta-sans outline-none outline-offset-1 select-none relative hover:bg-primary-600  dark:bg-primary-100 dark:hover:bg-primary-600 dark:hover:text-white transition-all ease-linear duration-200"
                  onClick={handleSubmit(onSubmit)}
                >
                  {isPending ? <MiniLoader /> : <h2> Create Task</h2>}{' '}
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default NewTask;
