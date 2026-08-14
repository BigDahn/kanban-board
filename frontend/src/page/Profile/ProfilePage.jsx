import { Outlet } from 'react-router-dom';

function ProfilePage() {
  return (
    <div className="flex">
      <Outlet />
    </div>
  );
}

export default ProfilePage;
