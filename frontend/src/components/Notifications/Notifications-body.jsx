import EmptyNotification from './EmptyNotification';
import NotificationsDetails from './NotificationsDetails';

function NotificationBody({ data }) {
  const totalNotifications = data?.map((notification) => notification).length;

  return (
    <div>
      {totalNotifications === 0 ? (
        <EmptyNotification />
      ) : (
        <NotificationsDetails data={data} />
      )}
    </div>
  );
}

export default NotificationBody;
