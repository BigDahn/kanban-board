import { useGetNotifications } from '@/hooks/useNotifications';
import NotificationHeaders from '../Notifications/Notification-Headers';
import NotificationBody from '../Notifications/Notifications-body';
import Loading from '../ui/Loading';

function Notifications() {
  const { data, isLoading } = useGetNotifications();

  if (isLoading) return <Loading />;

  return (
    <main className="flex flex-col gap-6 w-full px-[1em] m-auto py-3">
      <NotificationHeaders data={data} />
      <NotificationBody data={data} />
    </main>
  );
}

export default Notifications;
