import * as Dialog from '@radix-ui/react-dialog';
import { Eye, EyeOff } from 'lucide-react';
import { useKanban } from '@/context/Kanban';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import MiniLoader from '../ui/MiniLoader';

function VerifyDelete({ isPending, onDelete }) {
  const { isDeleteModalOpen, dispatch } = useKanban();

  const [reveal, setReveal] = useState(false);
  const onSubmit = (data) => {
    onDelete(data);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  return (
    <Dialog.Root
      open={isDeleteModalOpen}
      onOpenChange={(open) => {
        if (!isPending && !open) dispatch({ type: 'CLOSE_BOARD' });
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content
          onMouseDown={(e) => e.stopPropagation()} // ← add here
          onInteractOutside={(e) => isPending && e.preventDefault()}
          onEscapeKeyDown={(e) => isPending && e.preventDefault()}
          className="fixed left-1/2 top-1/2 w-[96%] max-h-[85vh] md:w-[90vw] md:max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-primary-300 dark:bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow flex flex-col gap-3"
        >
          <Dialog.Title className="m-0 text-[16px] flex flex-col justify-evenly h-full gap-3 font-semibold   text-white dark:text-black font-plus-jakarta-sans">
            Enter your password to delete your account
          </Dialog.Title>
          <VisuallyHidden asChild>
            <Dialog.Description>Edit current task.</Dialog.Description>
          </VisuallyHidden>
          <form className="flex flex-col gap-2">
            <div className="relative w-full">
              <input
                type={reveal ? 'text' : 'password'}
                name="password"
                autoComplete="password"
                {...register('password', {
                  required: 'This field is required',
                })}
                className="h-[43px] outline-none px-3 rounded-sm dark:text-black text-white border border-white dark:border-gray-300 dark:hover:border-primary-100 hover:border-primary-100 w-full"
              />
              <button
                type="button"
                aria-label={reveal ? 'Hide password' : 'Show password'}
                onClick={(e) => {
                  e.preventDefault();
                  setReveal(!reveal);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {reveal ? (
                  <Eye size={16} color="gray" />
                ) : (
                  <EyeOff size={16} color="gray" />
                )}
              </button>
            </div>
            {errors?.password && (
              <h6 className="text-[7px] text-secondary-400 capitalize font-bold">
                {errors.password.message}
              </h6>
            )}
          </form>
          <div className=" flex flex-col gap-4  md:flex-row items-center md:justify-between md:pt-3">
            <button
              className={`${
                isPending
                  ? 'bg-secondary-300 cursor-pointer hover:bg-secondary-400 text-white rounded-full w-[295px] md:w-[200px] h-[45px] md:h-[50px]  text-[13px] font-bold font-plus-jakarta-sans hover:dark:bg-secondary-400 disabled:cursor-not-allowed relative dark:bg-secondary-300'
                  : 'bg-secondary-300 cursor-pointer hover:bg-secondary-400 text-white rounded-full w-[295px] md:w-[200px] h-[45px] md:h-[50px] text-[13px] font-bold font-plus-jakarta-sans disabled:cursor-not-allowed relative ease-linear dark:bg-secondary-300 hover:dark:bg-secondary-400'
              }`}
              aria-label="Close"
              disabled={isPending}
              onClick={handleSubmit(onSubmit)}
            >
              {isPending ? <MiniLoader /> : <h2> Delete Account</h2>}
            </button>

            <Dialog.Close asChild>
              <button
                className="bg-primary-50 hover:bg-white dark:hover:bg-primary-100 dark:hover:text-white cursor-pointer  text-primary-100 rounded-full w-[295px] md:w-[200px]  h-[45px] md:h-[50px]  text-[13px] font-bold font-plus-jakarta-sans disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Close"
                type="button"
                disabled={isPending}
                onClick={() => {
                  dispatch({ type: 'CLOSE_BOARD' });
                  reset();
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

export default VerifyDelete;
