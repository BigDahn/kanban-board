import { useKanban } from '@/context/Kanban';
import { useForm } from 'react-hook-form';
import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useEmailVerify, useResendOtp } from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import MiniLoader from '../ui/MiniLoader';

function EmailOtp() {
  const { isOTPModalOpen, otpExpiresAt, dispatch } = useKanban();
  const [now, setNow] = useState(() => Date.now());
  const { mutate: verifyOtp, isPending } = useEmailVerify();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    verifyOtp(data, {
      onSuccess: () => {
        dispatch({ type: 'CLOSE_OTP_MODAL' });
        reset();
      },
    });
  };

  const onResendOtp = () => {
    resendOtp(null, {
      onSuccess: (data) => {
        dispatch({ type: 'OPEN_OTP_MODAL', payload: data.expiresAt });
      },
    });
  };

  const secondsLeft = otpExpiresAt
    ? Math.max(0, Math.floor((new Date(otpExpiresAt) - now) / 1000))
    : 0;

  const mins = Math.floor(secondsLeft / 60);
  const secs = String(secondsLeft % 60).padStart(2, '0');
  const isExpired = otpExpiresAt && secondsLeft === 0;

  return (
    <Dialog.Root
      open={isOTPModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          dispatch({ type: 'CLOSE_OTP_MODAL' });
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[600px] md:max-h-[800px] w-full max-w-[330px] md:w-[100vw] flex flex-col gap-4 md:max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-primary-300 dark:bg-white p-[20px] md:p-[25px] overflow-y-scroll custom-scroll focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-[14px] font-bold uppercase  text-white font-plus-jakarta-sans dark:text-black">
            Verify Your Email
          </Dialog.Title>
          <Dialog.Description className="m-0 text-[12px] font-bold capitalize  text-white font-plus-jakarta-sans dark:text-black">
            Please enter the OTP sent to your email address to verify your
            account.
          </Dialog.Description>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col w-[100%] gap-3 ">
              <input
                type="text"
                name="otp"
                inputMode="numeric"
                maxLength={6}
                className="h-[45px] outline-none border-white dark:border-gray-400 border-[0.6px] rounded-sm w-full px-3 text-white text-[15px] dark:text-black font-plus-jakarta-sans hover:border-primary-100 dark:hover:border-primary-100"
                placeholder="Enter OTP"
                {...register('otp', {
                  required: 'This field is required',
                  maxLength: {
                    value: 6,
                    message: 'OTP must be 6 digits',
                  },
                  minLength: {
                    value: 6,
                    message: 'OTP must be 6 digits',
                  },
                })}
              />

              <div className="flex justify-between md:items-center">
                <p className="text-[10px] flex justify-end text-white dark:text-black font-bold">
                  {isExpired
                    ? 'OTP has expired. Please request a new one.'
                    : `OTP expires in ${mins}:${secs}`}
                </p>
                {errors.otp && (
                  <p className="text-[6px] text-secondary-400 capitalize font-bold">
                    {errors.otp.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between md:items-center  ">
              <button
                type="button"
                className="flex py-[1em] h-[40px] w-[10em] text-[13px]  cursor-pointer items-center justify-center  bg-gray-400 rounded-sm  font-medium leading-none  text-white font-plus-jakarta-sans outline-none outline-offset-1 select-none relative hover:bg-primary-600 hover:text-black  dark:bg-primary-600 px-[12em]dark:hover:bg-primary-600 dark:hover:text-white transition-all ease-linear duration-200
                disabled:cursor-not-allowed
                disabled:hover:text-white"
                disabled={!isExpired}
                onClick={onResendOtp}
              >
                {isResending ? <MiniLoader /> : <h2> Resend OTP</h2>}
              </button>
              <button
                type="submit"
                className="flex py-[1em] h-[40px] w-[10em]  cursor-pointer items-center justify-center  bg-primary-100 rounded-sm  font-medium leading-none text-[13px] text-white font-plus-jakarta-sans outline-none outline-offset-1 select-none relative hover:bg-primary-50  dark:bg-primary-100 dark:hover:bg-primary-100/60 dark:hover:text-white transition-all ease-linear duration-200 disabled:cursor-not-allowed disabled:hover:bg-primary-100"
                disabled={isExpired}
              >
                {isPending ? <MiniLoader /> : <h2> Verify Otp</h2>}
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute right-3 md:right-4 top-5 md:top-7 inline-flex size-[14px] appearance-none items-center justify-center rounded-full text-violet11 cursor-pointer bg-gray3 hover:text-primary-100 cursor-pointer"
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

export default EmailOtp;
