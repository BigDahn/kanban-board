import { useGetNotifications } from '@/hooks/useNotifications';
import ProfileSelector from './ProfileSelector';

function ProfileLink({ onLinkClick }) {
  const { data } = useGetNotifications();

  const unreadNotifications = data?.filter(
    (data) => data.status === 'Unread',
  ).length;

  return (
    <main className="flex flex-col gap-[1em] md:gap-[2.3em] md:items-start  w-full md:py-6">
      <h1 className="text-white dark:text-black font-bold text-[13px]  md:text-[18px] capitalize px-[1.5em] flex">
        User Profile Management
      </h1>
      <ProfileSelector onLinkClick={onLinkClick} inbox={unreadNotifications} />
    </main>
  );
}

export default ProfileLink;
