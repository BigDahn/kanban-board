import { LogOut } from 'lucide-react';
import { useLogout } from '../hooks/useAuth';

function Logout({ text }) {
  const { mutate: logout } = useLogout();
  return (
    <button
      onClick={() => {
        logout();
      }}
      className="cursor-pointer flex items-center gap-1.5  "
    >
      <LogOut size={20} />
      {text && <h3>{text}</h3>}
    </button>
  );
}

export default Logout;
