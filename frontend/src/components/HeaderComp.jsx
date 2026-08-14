import { useCurrentUser } from '@/hooks/useAuth';
import Logout from './LogOut';

function HeaderComp() {
  const { data } = useCurrentUser();

  return (
    <div className="flex items-center gap-3 text-gray-300 dark:text-gray-600 dark:hover:text-primary-100 hover:text-primary-100">
      <div className="rounded-full h-[50px] w-[50px] hidden md:flex items-center justify-center text-black font-bold font-plus-jakarta-sans">
        <img
          src={data?.photo?.url}
          alt="Profile"
          className="rounded-full h-full w-full object-cover"
        />
      </div>
      <Logout />
    </div>
  );
}

export default HeaderComp;
