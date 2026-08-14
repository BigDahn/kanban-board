import { CheckCheck, Trash } from 'lucide-react';
import React from 'react';
import { IoCheckmarkDone } from 'react-icons/io5';
import {
  useMarkAllAsRead,
  useDeleteAllNotifications,
} from '@/hooks/useNotifications';

function NotificationHeaders({ data }) {
  const { mutate: markAsRead } = useMarkAllAsRead();
  const { mutate: deleteAll } = useDeleteAllNotifications();
  const unreadCount = data?.filter((notification) => !notification.read).length;

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-[14px] font-semibold  text-white dark:text-black text-center">
        {unreadCount} unread{' '}
        {unreadCount === 1 ? 'notification' : 'notifications'}
      </h1>
      <div className="flex gap-3 items-center">
        <button
          className="text-white transition-all ease-linear delay-100 py-[0.5em] px-[0.8em] rounded-sm dark:text-primary-100  font-semibold flex items-center gap-1  hover:text-primary-100 dark:hover:text-primary-600 cursor-pointer"
          onClick={() => markAsRead()}
        >
          <CheckCheck size={13} />
          <h2 className="hidden md:text-[14px] md:flex"> Mark all as read</h2>
        </button>
        <button
          className="text-secondary-300 transition-all ease-linear delay-100 py-[0.5em] px-[0.8em] rounded-sm dark:text-secondary-300 text-[13px] font-semibold flex items-center gap-1  hover:text-secondary-400 dark:hover:text-primary-600 cursor-pointer"
          onClick={() => deleteAll()}
        >
          <Trash size={13} />
          <h2 className="hidden md:text-[14px] md:flex">Delete all</h2>
        </button>
      </div>
    </div>
  );
}

export default NotificationHeaders;
