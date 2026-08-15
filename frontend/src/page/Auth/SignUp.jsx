import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { useRegister } from '../../hooks/useAuth';
import MiniLoader from '../../components/ui/MiniLoader';
import { Eye, EyeOff } from 'lucide-react';
import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import { useKanban } from '@/context/Kanban';

function SignUp() {
  const { mutate: signUp, isPending } = useRegister();
  const { isDarkMode } = useKanban();

  const onSubmit = (data) => {
    signUp(data);
  };

  return (
    <main className="max-w-screen bg-primary-400  dark:bg-secondary-100  min-h-screen m-auto flex flex-col gap-[3em] justify-center items-center font-plus-jakarta-sans">
      {isDarkMode ? (
        <img src="/logo-dark.svg" />
      ) : (
        <img src="/logo-light.svg" />
      )}
      <Form
        onSubmit={onSubmit}
        className="bg-primary-300 dark:bg-white dark:shadow dark:shadow-gray-200 p-[2em] rounded-[5px] w-full max-w-[350px] md:max-w-[400px] flex flex-col gap-[1.5em]"
      >
        <FormInput
          name="name"
          label="name"
          type="text"
          rules={{ required: 'Name is required' }}
          className="bg-white  dark:border dark:border-gray-300 text-black w-full h-[37px] outline-none px-2 rounded-[3px] text-[13px] font-medium dark:hover:border-primary-100"
        />
        <FormInput
          name="email"
          label="Email"
          type="text"
          autoComplete="email"
          rules={{ required: 'Email is required' }}
          className="bg-white  dark:border dark:border-gray-300 text-black w-full h-[37px] outline-none px-2 rounded-[3px] text-[13px] font-medium dark:hover:border-primary-100"
        />
        <FormInput
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          rules={{ required: 'Password is required' }}
          className="bg-white  dark:border dark:border-gray-300 text-black w-full h-[37px] outline-none px-2 rounded-[3px] text-[13px] font-medium dark:hover:border-primary-100"
        />
        <FormInput
          name="passwordConfirm"
          label="Confirm Password"
          autoComplete="new-password"
          type="password"
          rules={{ required: 'Please confirm your password' }}
          className="bg-white  dark:border dark:border-gray-300 text-black w-full h-[37px] outline-none px-2 rounded-[3px] text-[13px] font-medium dark:hover:border-primary-100"
        />
        <Button
          className="group hover:bg-white outline-none cursor-pointer transition-all ease-linear delay-100 bg-primary-100 py-[0.8em] h-[43px] rounded-sm font-bold uppercase hover:text-primary-300 mb-3 text-white text-[13px] relative dark:hover:bg-primary-600"
          type="submit"
        >
          {isPending ? <MiniLoader /> : <h2>Sign Up</h2>}
        </Button>
        <div className="flex justify-end items-center">
          <Link
            to="/login"
            className="text-[10px] font-bold text-white dark:text-primary-100 dark:hover:text-primary-600"
          >
            Already have an account?
          </Link>
        </div>
      </Form>
    </main>
  );
}

export default SignUp;
