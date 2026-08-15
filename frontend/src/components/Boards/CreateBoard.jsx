import { useForm, useFieldArray } from 'react-hook-form';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Pen } from 'lucide-react';
import { useCreateBoard } from '../../hooks/useBoards';
import MiniLoader from '../ui/MiniLoader';
import { useKanban } from '@/context/Kanban';

function CreateBoardDialog() {
  const { isCreateBoardOpen, dispatch } = useKanban();

  const defaultValues = {
    column: [{ color: '#aabbcc' }, { color: '#aabbcc' }],
  };

  const {
    register,
    control,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setOpenPickerIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { fields, append, remove } = useFieldArray({ control, name: 'column' });
  const columnValues = watch('column');
  const [openPickerIndex, setOpenPickerIndex] = useState(null);
  const { mutate: addBoard, isPending } = useCreateBoard();

  const onSubmit = (data) => {
    addBoard(data, {
      onSuccess: () => {
        dispatch({ type: 'CLOSE_CREATE_BOARD' });
        setOpenPickerIndex(null);
        setTimeout(() => reset(defaultValues), 100);
      },
    });
  };

  return (
    <Dialog.Root
      open={isCreateBoardOpen}
      onOpenChange={(open) => {
        if (!open) dispatch({ type: 'CLOSE_CREATE_BOARD' });
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[600px] md:max-h-[800px] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-primary-300 dark:bg-white p-[20px] md:p-[25px] overflow-y-scroll custom-scroll focus:outline-none data-[state=open]:animate-contentShow">
          <VisuallyHidden asChild>
            <Dialog.Description>
              Create a Board with a title,and status.
            </Dialog.Description>
          </VisuallyHidden>
          <Dialog.Title className="m-0 text-[24px] font-bold capitalize text-white font-plus-jakarta-sans dark:text-black">
            Add New Board
          </Dialog.Title>
          <div className="flex flex-col gap-[1.3em] py-[1em]">
            <div className="flex flex-col gap-3">
              <label
                htmlFor="title"
                className="text-[14px] text-white font-bold font-plus-jakarta-sans dark:text-black"
              >
                Board Name
              </label>
              <div>
                <input
                  type="text"
                  name="title"
                  className="h-[45px] outline-none border-white border-[0.6px] rounded-sm w-full px-3 text-white text-[15px] font-plus-jakarta-sans hover:border-primary-100 dark:border-gray-300 dark:text-black dark:hover:border-primary-100"
                  placeholder="e.g Web Design"
                  {...register('title', { required: 'This field is required' })}
                />
                {errors.title && (
                  <p className="text-[7px] text-secondary-400 capitalize pt-2 font-bold">
                    {errors.title.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {fields.length >= 1 && (
                <label className="text-[14px] text-white font-bold font-plus-jakarta-sans dark:text-black">
                  Board Columns
                </label>
              )}
              {fields.map((field, index) => {
                const currentColor = columnValues?.[index]?.color || '#aabbcc';
                return (
                  <div className="w-full" key={index}>
                    <div>
                      <div className="flex gap-2 items-center justify-between">
                        <input
                          type="text"
                          name="status"
                          className="h-[45px] outline-none border-white border-[0.6px] rounded-sm w-full px-3 text-white text-[15px] font-plus-jakarta-sans hover:border-primary-100 dark:border-gray-300 dark:text-black dark:hover:border-primary-100"
                          {...register(`column.${index}.status`, {
                            required: 'This field is required',
                          })}
                        />
                        <input
                          type="hidden"
                          {...register(`column.${index}.color`)}
                        />
                        <div className="relative">
                          <div
                            style={{ color: currentColor }}
                            onClick={() =>
                              setOpenPickerIndex(
                                openPickerIndex === index ? null : index,
                              )
                            }
                            className="cursor-pointer p-1"
                          >
                            <Pen size={16} />
                          </div>
                          {openPickerIndex === index && (
                            <div
                              ref={pickerRef}
                              className="absolute right-8 bottom-0 z-50 shadow-lg rounded-sm"
                            >
                              <HexColorPicker
                                color={currentColor}
                                onChange={(c) =>
                                  setValue(`column.${index}.color`, c)
                                }
                              />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => remove(index)}
                          className="cursor-pointer"
                        >
                          <img src="/icon-cross.svg" className="w-[15px]" />
                        </button>
                      </div>
                      {errors?.column && (
                        <p className="text-[7px] text-secondary-400 capitalize font-bold pt-2">
                          {errors.column[index]?.status?.message}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              className="text-primary-100 rounded-full bg-white dark:bg-primary-100/25 dark:text-primary-100 py-3 cursor-pointer hover:bg-primary-600 hover:text-white transition-all ease-linear duration-200 dark:hover:bg-primary-600 dark:hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                append({ color: '#aabbcc' });
              }}
            >
              +Add new Column
            </button>
            <button
              type="submit"
              className="flex py-[1em] h-[50px] cursor-pointer items-center justify-center bg-primary-100 rounded-full font-medium leading-none text-[15px] text-white font-plus-jakarta-sans outline-none outline-offset-1 select-none relative hover:bg-primary-600 dark:bg-primary-100 dark:hover:bg-primary-600 dark:hover:text-white transition-all ease-linear duration-200"
              onClick={handleSubmit(onSubmit)}
            >
              {isPending ? <MiniLoader /> : <h2>Create New Board</h2>}
            </button>
          </div>
          <Dialog.Close asChild>
            <button
              className="absolute right-6 top-7.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 cursor-pointer bg-gray3 hover:bg-violet4"
              aria-label="Close"
              onClick={() => {
                dispatch({ type: 'CLOSE_CREATE_BOARD' });
                setOpenPickerIndex(null);
                setTimeout(() => reset(defaultValues), 100);
              }}
            >
              <img src="/icon-cross.svg" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CreateBoardDialog;
