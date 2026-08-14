import { Link } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useAuth';
import { useKanban } from '@/context/Kanban';

function ViewAccount() {
  const { dispatch } = useKanban();
  const { data, isLoading } = useCurrentUser();



  if (isLoading) return null;

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_DROP_DOWN' });
      }}
      className="  cursor-pointer font-bold font-plus-jakarta-sans capitalize text-[14px] flex gap-2 items-center"
    >
      <img src={data?.photo?.url} className="w-4 h-4 rounded-full" />
      <Link to="account/profile"> View Profile</Link>
    </div>
  );
}

export default ViewAccount;
