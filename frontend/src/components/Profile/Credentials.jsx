import Form from '../Forms/Form';
import FormInput from '../Forms/FormInput';
import Button from '../ui/Button';
import MiniLoader from '../ui/MiniLoader';
import { Ban, Check } from 'lucide-react';
import { useEmailUpdate, useUpdatePassword } from '@/hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useAuth';
import { useKanban } from '@/context/Kanban';
import EmailOtp from './Email-Otp-Verify';

function Credentials() {
  const navigate = useNavigate();
  const { isOTPModalOpen, dispatch } = useKanban();
  const { data } = useCurrentUser();
  const { email } = data || {};

  const { mutate: passwordUpdate, isPending } = useUpdatePassword();
  const { mutate: emailUpdate, isPending: isLoading } = useEmailUpdate();
  const onSubmit = (data) => {
    emailUpdate(data, {
      onSuccess: (data) => {
        dispatch({ type: 'OPEN_OTP_MODAL', payload: data.expiresAt });
      },
    });
  };

  const handlePasswordUpdate = (data) => {
    passwordUpdate(data, {
      onSuccess: () => {
        navigate('/login');
      },
    });
  };

  return (
    <main className=" flex flex-col gap-[0.6em] items-start w-full py-3 px-5">
      {/* Email Update Field */}
      <div className="flex flex-col gap-4 w-full lg:items-center m-auto  ">
        <h1 className="text-[16px] font-semibold  capitalize text-white dark:text-black text-center">
          Update Email Address
        </h1>
        <Form onSubmit={onSubmit} className="flex flex-col gap-[1em] ">
          <FormInput
            name="old_email"
            label="Current Email"
            value={email}
            className="w-full lg:w-[800px] h-[40px] rounded-sm border border-primary-100  bg-transparent disabled:cursor-not-allowed  outline-none px-2 text-[16px] font-normal"
            disabled={true}
          />
          <FormInput
            name="email"
            label="New Email"
            className="w-full lg:w-[800px] h-[40px] rounded-sm border border-primary-100 text-white dark:text-black  bg-transparent disabled:cursor-not-allowed  outline-none px-2 text-[16px] font-normal"
            rules={{ required: 'Email is required' }}
          />
          <FormInput
            name="password"
            label="Current password"
            className="w-full lg:w-[800px] h-[40px] rounded-sm border border-primary-100  text-white dark:text-black
             disabled:cursor-not-allowed  outline-none px-2 text-[16px] font-normal"
            type="password"
            autoComplete="current-password"
            rules={{ required: 'Password is required' }}
            full
          />
          <div className="flex justify-center lg:justify-end gap-4 mt-3 md:items-center">
            <Button
              className=" hover:bg-primary-600 outline-none cursor-pointer transition-all ease-linear delay-100 bg-white py-[0.8em] h-[43px] w-[130px] flex items-center gap-3 justify-center rounded-sm font-bold uppercase dark:hover:bg-primary-600   mb-3 text-gray-700 text-[13px] relative dark:bg-gray-300"
              type="reset"
            >
              <Ban size={16} strokeWidth={2.4} />
              Cancel
            </Button>

            <Button
              className=" hover:bg-primary-600 outline-none cursor-pointer transition-all ease-linear delay-100 bg-primary-100 py-[0.8em] h-[43px] w-[130px] flex items-center gap-3 rounded-sm font-bold uppercase hover:text-white mb-3 text-white text-[13px] relative"
              type="submit"
            >
              {isLoading ? (
                <MiniLoader />
              ) : (
                <h2 className="flex items-center gap-3 justify-center w-full">
                  {' '}
                  <Check size={16} color="white" strokeWidth={2.4} />
                  Update
                </h2>
              )}
            </Button>
          </div>
        </Form>
      </div>

      <div className=" border-t w-full dark:border-t-gray-300" />
      {/* Password update field       */}
      <div className="flex flex-col w-full lg:items-center m-auto py-3 gap-6">
        <h1 className="text-[16px] font-semibold capitalize text-white dark:text-black text-center">
          Update Password
        </h1>
        <Form
          onSubmit={handlePasswordUpdate}
          className="flex flex-col gap-[1em] lg:items-center   "
        >
          <FormInput
            name="passwordCurrent"
            label="Current password"
            className="w-full lg:w-[800px] h-[40px] rounded-sm border border-primary-100  text-white dark:text-black
             disabled:cursor-not-allowed  outline-none px-2 text-[16px] font-normal"
            type="password"
            autoComplete="current-password"
            rules={{ required: 'Password is required' }}
            full
          />
          <FormInput
            name="password"
            label="New Password"
            className=" w-full lg:w-[800px] h-[40px] rounded-sm border border-primary-100  text-white dark:text-black disabled:cursor-not-allowed  outline-none px-2 text-[16px] font-normal"
            type="password"
            autoComplete="new-password"
            rules={{ required: 'Password is required' }}
          />
          <FormInput
            name="passwordConfirm"
            label="Confirm New Password"
            className=" w-full lg:w-[800px] h-[40px] rounded-sm border border-primary-100   text-white dark:text-black disabled:cursor-not-allowed  outline-none px-2 text-[16px] font-normal"
            type="password"
            autoComplete="new-password"
            rules={{ required: 'Password is required' }}
          />
          <div className="flex justify-center lg:justify-end gap-4 mt-3 items-  w-full">
            <Button
              className=" hover:bg-primary-600 outline-none cursor-pointer transition-all ease-linear delay-100 bg-white py-[0.8em] h-[43px] w-[130px] flex items-center gap-3 justify-center rounded-sm font-bold uppercase hover:text-white mb-3 text-gray-700 text-[13px] relative dark:bg-gray-300"
              type="reset"
            >
              <Ban size={16} strokeWidth={2.4} />
              Cancel
            </Button>

            <Button
              className=" hover:bg-primary-600 outline-none cursor-pointer transition-all ease-linear delay-100 bg-primary-100 py-[0.8em] h-[43px] w-[130px] flex items-center gap-3 rounded-sm font-bold uppercase hover:text-white mb-3 text-white text-[13px] relative"
              type="submit"
            >
              {isPending ? (
                <MiniLoader />
              ) : (
                <h2 className="flex items-center gap-3 justify-center w-full">
                  {' '}
                  <Check size={16} color="white" strokeWidth={2.4} />
                  Save
                </h2>
              )}
            </Button>
          </div>
        </Form>
      </div>

      {isOTPModalOpen && <EmailOtp />}
    </main>
  );
}

export default Credentials;
