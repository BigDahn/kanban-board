import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import { useKanban } from '@/context/Kanban';
import { ArrowLeftFromLine, ArrowLeftIcon } from 'lucide-react';
import { useForgotPassword } from '@/hooks/useAuth';
import MiniLoader from '@/components/ui/MiniLoader';

function ForgotPassword() {
  const { isDarkMode } = useKanban();
  const { isPending, mutate: forgot } = useForgotPassword();

  const onSubmit = (data) => {
    forgot(data);
  };

  return (
    <main className="max-w-screen bg-primary-400  dark:bg-secondary-100  min-h-screen mx-auto flex justify-center items-center flex-col gap-[3em] font-plus-jakarta-sans">
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
          name="email"
          label="Email"
          type="text"
          rules={{ required: 'Email is required' }}
          className="bg-white  dark:border dark:border-gray-300 text-black w-full h-[37px] outline-none px-2 rounded-[3px] text-[13px] font-medium dark:hover:border-primary-100 transition-all ease-linear duration-300"
        />
        <Button className="group hover:bg-white outline-none cursor-pointer transition-all ease-linear delay-100 bg-primary-100 py-[0.8em] h-[43px] rounded-sm font-bold uppercase hover:text-primary-300 mb-3 text-white text-[13px] relative dark:hover:bg-primary-600">
          {isPending ? <MiniLoader /> : <h2>Send Link</h2>}
        </Button>
        <Link
          to="/login"
          className="text-[10px] font-bold text-white flex justify-end dark:text-primary-100 gap-1 items-center dark:hover:text-primary-600"
        >
          <ArrowLeftIcon size={10} strokeWidth={5} /> Back to Login
        </Link>
      </Form>
    </main>
  );
}

export default ForgotPassword;
