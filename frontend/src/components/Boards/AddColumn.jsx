import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useEffect, useRef, useState } from 'react';
import { Pen } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { useForm } from 'react-hook-form';
import { useAddStatus } from '../../hooks/useBoards';
import { useParams } from 'react-router-dom';
import MiniLoader from '../ui/MiniLoader';
import { useKanban } from '@/context/Kanban';

function AddColumn() {
  const { slug } = useParams();
  const { isAddColumnOpen, dispatch } = useKanban();
  const { mutate: addStatus, isPending } = useAddStatus();
  const {
    handleSubmit,
    setValue,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const pickerRef = useRef(null);
  const penRef = useRef(null);

  const [openPickerIndex, setOpenPickerIndex] = useState(false);

  const [currentColor, setCurrentColor] = useState('#aabbcc');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target) &&
        !penRef.current.contains(e.target)
      ) {
        setOpenPickerIndex(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onSubmit = (data) => {
    addStatus(
      { column: [data], slug },
      {
        onSuccess: () => {
          dispatch({ type: 'CLOSE_COLUMN' });
          setCurrentColor('#aabbcc');
          setTimeout(() => reset(), 300);
        },
      },
    );
  };

  return (
    <Dialog.Root
      open={isAddColumnOpen}
      onOpenChange={(open) => {
        if (!open) dispatch({ type: 'CLOSE_COLUMN' });
      }}
    >
      <Dialog.Trigger asChild>
        <button
          className="text-primary-600 font-bold text-2xl md:text-[16px] hover:cursor-pointer hover:text-primary-100 transition-colors duration-200 hover:scale-105 border-none"
          onClick={() => dispatch({ type: 'OPEN_COLUMN' })}
        >
          + New Column
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[600px] md:max-h-[800px] w-full max-w-[330px] md:w-[90vw] md:max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-primary-300 dark:bg-white p-[20px] md:p-[25px] overflow-y-scroll custom-scroll focus:outline-none data-[state=open]:animate-contentShow">
          <VisuallyHidden asChild>
            <Dialog.Description>
              Create a new column with a status.
            </Dialog.Description>
          </VisuallyHidden>
          <Dialog.Title className="m-0 text-[14px] font-bold capitalize  text-white font-plus-jakarta-sans dark:text-black">
            Add New Column
          </Dialog.Title>
          <div className="flex flex-col gap-[1.3em] py-[1em]">
            <div className="flex flex-col gap-3">
              <label
                htmlFor="status"
                className="text-[14px] text-white font-bold font-plus-jakarta-sans dark:text-black"
              >
                Status
              </label>
              <div className="flex gap-2 items-center justify-between">
                <div className="flex flex-col w-[100%] gap-1 ">
                  <input
                    type="text"
                    name="status"
                    className="h-[45px] outline-none border-white dark:border-gray-400 border-[0.6px] rounded-sm w-full px-3 text-white text-[15px] dark:text-black font-plus-jakarta-sans hover:border-primary-100 dark:hover:border-primary-100"
                    {...register('status', {
                      required: 'This field is required',
                    })}
                  />
                  {errors.status && (
                    <p className="text-[6px] text-secondary-400 capitalize font-bold">
                      {errors.status.message}
                    </p>
                  )}
                </div>
                <input
                  type="hidden"
                  {...register('color')}
                  defaultValue={currentColor}
                />
                <div className="relative">
                  <div
                    ref={penRef}
                    style={{ color: currentColor }}
                    onKeyDown={(e) => e.stopPropagation()}
                    onClick={() => {
                      setOpenPickerIndex((openPickerIndex) => !openPickerIndex);
                    }}
                    className="cursor-pointer p-1"
                  >
                    <Pen size={16} />
                  </div>
                  {openPickerIndex && (
                    <div
                      ref={pickerRef}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-8 top-[-70px] md:top-[-100px] z-300 shadow-lg rounded-sm"
                    >
                      <HexColorPicker
                        color={currentColor}
                        onChange={(c) => {
                          setValue('color', c);
                          setCurrentColor(c);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                className="flex py-[1em] h-[50px]  cursor-pointer items-center justify-center  bg-primary-100 rounded-full  font-medium leading-none text-[15px] text-white font-plus-jakarta-sans outline-none outline-offset-1 select-none relative hover:bg-primary-600  dark:bg-primary-100 dark:hover:bg-primary-600 dark:hover:text-white transition-all ease-linear duration-200"
                onClick={handleSubmit(onSubmit)}
              >
                {isPending ? <MiniLoader /> : <h2> Add New Column</h2>}
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              className="absolute right-3 md:right-2 top-5 md:top-3 inline-flex size-[20px] appearance-none items-center justify-center rounded-full text-violet11 cursor-pointer bg-gray3 hover:bg-violet4"
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

export default AddColumn;
