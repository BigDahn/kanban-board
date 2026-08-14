import { useDeleteNotification, useMarkAsRead } from '@/hooks/useNotifications';
import { LABELS, timeAgo } from '../../lib/notification-utils';
import { CheckCheck, Trash } from 'lucide-react';

function NotificationsDetails({ data }) {
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();
  return (
    <div className="flex flex-col gap-4">
      {data?.map((notification) => (
        <div
          key={notification._id}
          className=" px-2 md:px-4 border-gray-200 dark:border-gray-600 dark:bg-white rounded-sm shadow-sm py-4 flex justify-between items-center bg-primary-500 dark:text-white"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[14px] md:text-[16px] text-white dark:text-black">
                {LABELS[notification.type]}
              </h3>
              <div
                style={{
                  backgroundColor:
                    notification.status === 'Unread' ? '#00FF00' : '#9CA3AF',
                }}
                className="h-2 w-2 rounded-full"
              ></div>
            </div>
            <p className="text-gray-200  max-w-[80%] md:max-w-full dark:text-gray-400 text-[12px] tracking-wide md:tracking-wider">
              {notification.descriptions}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p
              title={new Date(notification.createdAt).toLocaleString()}
              className="text-gray-200 dark:text-gray-500 text-[11px] tracking-wider"
            >
              {timeAgo(notification.createdAt)}
            </p>
            <div className="flex gap-2 mt-2">
              <button
                className="text-white transition-all ease-linear delay-100 py-[0.5em] px-[0.8em] rounded-sm dark:text-primary-100 text-[14px] font-semibold flex items-center gap-1  hover:text-primary-100 dark:hover:text-primary-600 cursor-pointer"
                onClick={() => markAsRead(notification._id)}
              >
                <CheckCheck size={13} />
              </button>
              <button
                className="text-secondary-300 transition-all ease-linear delay-100 py-[0.5em] px-[0.8em] rounded-sm dark:text-secondary-300 text-[13px] font-semibold flex items-center gap-1  hover:text-secondary-400 dark:hover:text-primary-600 cursor-pointer"
                onClick={() => deleteNotification(notification._id)}
              >
                <Trash size={13} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationsDetails;
