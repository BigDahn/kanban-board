import React from 'react';
import UserImg from './UserImg';
import UserDetails from './UserDetails';
import { useCurrentUser } from '@/hooks/useAuth';

function ProfileComp() {
  const { data } = useCurrentUser();

  return (
    <div className="flex flex-col gap-1 justify-center items-start py-[2em] w-full px-[20px]">
      <UserDetails user={data || {}} />
    </div>
  );
}

export default ProfileComp;
