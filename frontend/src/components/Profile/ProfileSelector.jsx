import { BellDot, Settings, ShieldCheck, Trash, UserRound } from 'lucide-react';
import UserImg from './UserImg';
import { Link, NavLink } from 'react-router-dom';

function ProfileSelector({ onLinkClick, inbox }) {
  return (
    <main className="flex flex-col gap-[0.7em] w-full md:pr-[1em] cursor-pointer ">
      <NavLink
        to={'/account/profile'}
        onClick={onLinkClick}
        className={({ isActive }) => {
          return isActive
            ? 'bg-primary-100 hover:bg-white hover:text-primary-600 text-white cursor-pointer flex items-center gap-2 py-3  px-[1.5em] md:py-[1em] rounded-tr-full rounded-br-full md:w-69 dark:hover:bg-primary-100/25 dark:hover:text-primary-100 text-[14px] md:text-[15px]'
            : 'text-primary-600 flex items-center gap-2 py-3 px-[1.5em] md:py-[1em] rounded-tr-full rounded-br-full md:w-69 hover:bg-white hover:text-primary-600 cursor-pointer dark:hover:bg-primary-100/25 dark:hover:text-primary-100 text-[14px] md:text-[15px]';
        }}
      >
        <UserRound
          size={20}
          strokeWidth={2.3}
          className="transition-colors duration-200"
        />
        Personal Info
      </NavLink>
      <NavLink
        to={'/account/email-password'}
        onClick={onLinkClick}
        className={({ isActive }) => {
          return isActive
            ? 'bg-primary-100 hover:bg-white hover:text-primary-600 text-white cursor-pointer flex items-center gap-2 py-3  px-[1.5em] md:py-[1em] rounded-tr-full rounded-br-full md:w-69 dark:hover:bg-primary-100/25 dark:hover:text-primary-100 text-[14px] md:text-[15px]'
            : 'text-primary-600 flex items-center gap-2 py-3 px-[1.5em] md:py-[1em] rounded-tr-full rounded-br-full md:w-69 hover:bg-white hover:text-primary-600 cursor-pointer dark:hover:bg-primary-100/25 dark:hover:text-primary-100 text-[14px] md:text-[15px]';
        }}
      >
        <ShieldCheck
          size={20}
          strokeWidth={2.3}
          className="transition-colors duration-200"
        />
        Email & Password
      </NavLink>
      <NavLink
        to={'/account/notifications'}
        onClick={onLinkClick}
        className={({ isActive }) => {
          return isActive
            ? 'bg-primary-100 hover:bg-white hover:text-primary-600 text-white cursor-pointer flex items-center gap-2 py-3  px-[1.5em] md:py-[1em] rounded-tr-full rounded-br-full md:w-69 dark:hover:bg-primary-100/25 dark:hover:text-primary-100 text-[14px] md:text-[15px] justify-between'
            : 'text-primary-600 flex items-center gap-2 py-3 px-[1.5em] md:py-[1em] rounded-tr-full rounded-br-full md:w-69 hover:bg-white hover:text-primary-600 cursor-pointer dark:hover:bg-primary-100/25 dark:hover:text-primary-100 text-[14px] md:text-[15px] justify-between';
        }}
      >
        <div className="flex items-center gap-3">
          <BellDot
            size={20}
            strokeWidth={2.3}
            className="transition-colors duration-200"
          />
          Notifications
        </div>
        {inbox >= 1 && (
          <div className="h-[19px] w-[19px] flex items-center justify-center text-[11px] font-bold rounded-full bg-primary-100 text-white">
            {inbox}
          </div>
        )}
      </NavLink>
    </main>
  );
}

export default ProfileSelector;
