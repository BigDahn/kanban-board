import { useForm, useFieldArray } from 'react-hook-form';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { HexColorPicker } from 'react-colorful';
import { Pen } from 'lucide-react';
import { SquarePen } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useEditBoard, useGetBoard } from '../../hooks/useBoards';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import MiniLoader from '../ui/MiniLoader';
import { useKanban } from '@/context/Kanban';

function EditBoard({ edit }) {
  const { isEditBoardOpen, dispatch } = useKanban();
  const { slug } = useParams();
  const navigate = useNavigate();

  const [openPickerIndex, setOpenPickerIndex] = useState(null);
  const pickerRef = useRef(null);

  const { mutate: editBoard, isPending } = useEditBoard();
  const { data } = useGetBoard();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setOpenPickerIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { title, column } = data || {};

  const defaultValues = {
    column,
  };

  const {
    register,
    setValue,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'column',
  });
  const columnValues = watch('column');

  if (!data) return null;

  const onSubmit = (data) => {
    editBoard(
      { data, slug },
      {
        onSuccess: (data) => {
          dispatch({ type: 'CLOSE_EDIT_BOARD' });
          dispatch({ type: 'CLOSE_BOARD' });
          setOpenPickerIndex(null);

          navigate(`/board/${data.data.board.slug}`);
        },
      },
    );
  };

  return (
    <Dialog.Root
      open={isEditBoardOpen}
      onOpenChange={(open) => {
        if (!open) dispatch({ type: 'CLOSE_EDIT_BOARD' });
      }}
    >
      <Dialog.Trigger asChild>
        <button
          className="flex gap-2  items-center justify-center rounded leading-none  outline-none outline-offset-1 capitalize  text-[15px] font-bold focus-visible:outline-2 focus-visible:outline-violet6 select-none cursor-pointer  "
          onClick={() => {
            (dispatch({ type: 'OPEN_EDIT_BOARD' }),
              dispatch({ type: 'TOGGLE_DROP_DOWN' }));
          }}
        >
          <SquarePen size={16} /> {edit}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[600px] md:max-h-[800px] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-primary-300 dark:bg-white p-[20px] md:p-[25px] overflow-y-scroll custom-scroll focus:outline-none data-[state=open]:animate-contentShow">
          <VisuallyHidden asChild>
            <Dialog.Description>Edit Current Board.</Dialog.Description>
          </VisuallyHidden>
          <Dialog.Title className="m-0 text-[24px] font-bold capitalize  text-white font-plus-jakarta-sans  dark:text-black ">
            Edit Board
          </Dialog.Title>
          <div className="flex flex-col gap-[1.3em] py-[1em]">
            <div className="flex flex-col gap-3">
              <label className="text-[14px] text-white font-bold font-plus-jakarta-sans  dark:text-black ">
                Board Name
              </label>
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  name="title"
                  defaultValue={title}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="h-[43px] outline-none px-3 rounded-sm dark:text-black text-white border border-white dark:border-gray-300 dark:hover:border-primary-100 hover:border-primary-100"
                  placeholder="e.g Web Design"
                  {...register('title', {
                    required: 'This field is required',
                  })}
                />
                {errors?.title && (
                  <p className="text-[7px] text-secondary-400 capitalize font-bold">
                    {errors.title?.message}
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
                  <div className="w-full " key={index}>
                    <div className="flex justify-between items-center w-full ">
                      <div className="flex items-center gap-1 md:gap-3  w-[85%] md:w-[94%]">
                        <div className="flex flex-col gap-4  w-full">
                          <input
                            type="text"
                            name="column"
                            onKeyDown={(e) => e.stopPropagation()}
                            className="h-[43px] outline-none px-3 rounded-sm dark:text-black text-white border border-white dark:border-gray-300 dark:hover:border-primary-100 hover:border-primary-100"
                            {...register(`column.${index}.status`, {
                              required: 'This field is required',
                            })}
                          />
                          {errors?.column && (
                            <p className="text-[7px] text-secondary-400 capitalize font-bold">
                              {errors.column[index]?.status?.message}
                            </p>
                          )}
                        </div>
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
                      </div>
                      <button
                        onClick={() => remove(index)}
                        className="cursor-pointer"
                      >
                        <img src="/icon-cross.svg" className="w-[15px]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              className="text-primary-100 rounded-full bg-white dark:bg-primary-100/25 dark:text-primary-100  py-3 cursor-pointer hover:bg-primary-600 hover:text-white transition-all ease-linear duration-200 dark:hover:bg-primary-600 dark:hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                append({
                  color: '#aabbcc',
                });
              }}
            >
              +Add new Column
            </button>

            <Dialog.Close asChild>
              <button
                className="flex py-[1em] h-[50px]  cursor-pointer items-center justify-center  bg-primary-100 rounded-full  font-medium leading-none text-[15px] text-white font-plus-jakarta-sans outline-none outline-offset-1 select-none relative hover:bg-primary-600  dark:bg-primary-100 dark:hover:bg-primary-600 dark:hover:text-white transition-all ease-linear duration-200"
                onClick={handleSubmit(onSubmit)}
              >
                {isPending ? <MiniLoader /> : <h2> Edit Board</h2>}
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute right-6 top-7.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 cursor-pointer bg-gray3 hover:bg-violet4"
              aria-label="Close"
              onClick={() => {
                dispatch({ type: 'TOGGLE_DROP_DOWN' });
                dispatch({ type: 'CLOSE_EDIT_BOARD' });
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

export default EditBoard;
