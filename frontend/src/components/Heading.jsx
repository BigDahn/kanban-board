import { Link, useLocation } from 'react-router-dom';
import Dropdown from './ui/Dropdown';
import NewTask from '../components/Tasks/NewTask';

import { useGetBoards } from '../hooks/useBoards';
import HeaderComp from './HeaderComp';
import SmallSidebar from './ui/SmallSidebar';

function Heading({ isDarkMode }) {
  const { pathname } = useLocation();
  const { data: boards, isLoading } = useGetBoards();

  if (isLoading) return null;

  const path = pathname.split('/')[1]; /// to differentiate between paths

  const ActiveBoard =
    boards?.board?.length >= 1
      ? pathname.split('/')[2]
      : 'No Current Board To Display';

  const profilePath = pathname.split('/')[2]?.startsWith('profile')
    ? 'Profile Information'
    : pathname.split('/')[2]?.replace('-', ' & ');

  const options = {
    profile: 'View Account',
    edit: 'Edit Board',
    boardName: 'Delete Board',
  };
  //
  return (
    <header className="bg-primary-400 px-[1em] md:px-[1.6em] flex items-center justify-between  overflow-hidden dark:bg-white">
      <div className="flex gap-4 h-full items-center">
        <Link
          to="/"
          className="md:border-r md:border-r-primary-500 md:dark:border-r-gray-200  h-full hidden md:flex md:items-center"
        >
          {isDarkMode ? (
            <img
              src="/logo-dark.svg"
              className=" w-[180px] h-[25.22px] mr-[93.3px] flex"
            />
          ) : (
            <img
              src="/logo-light.svg"
              className=" w-[180px] h-[25.22px] mr-[93.3px] flex"
            />
          )}
        </Link>

        <Link
          to="/"
          className="border-none lhimd:border-r md:border-r-primary-500 md:dark:border-r-gray-200 h-full flex items-center md:hidden"
        >
          <img src="/logo-mobile.svg" />
        </Link>

        <div className="text-white font-bold capitalize text-[17px] md:text-[24px] dark:text-black  md:px-[0.6em]">
          {path === 'account' ? (
            <div className="flex items-center gap-2">
              <h2>{profilePath}</h2>
              <SmallSidebar />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2>{ActiveBoard?.replace('-', ' ')}</h2>
              <SmallSidebar />
            </div>
          )}
        </div>
      </div>

      {path === 'account' ? (
        <HeaderComp />
      ) : (
        <div className="flex items-center gap-[1em] px-[0.6em]">
          {boards?.board.length >= 1 && <NewTask />}

          <Dropdown options={options} boards={boards} />
        </div>
      )}
    </header>
  );
}

export default Heading;
