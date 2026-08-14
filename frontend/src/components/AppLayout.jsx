import { Outlet } from 'react-router-dom';
import Heading from './Heading';
import Sidebar from './Sidebar';
import WelcomePage from '../page/WelcomePage';
import { useKanban } from '../context/Kanban';
import { useGetBoards } from '@/hooks/useBoards';
import Loading from './ui/Loading';
import BoardPage from '@/page/BoardPage';

function AppLayout() {
  const { isSidebarOpen, isDarkMode, dispatch } = useKanban();
  const { isLoading } = useGetBoards();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="grid h-screen  box-border bg-primary-300 dark:bg-secondary-100 grid-rows-[65px_1fr] md:grid-rows-[90px_1fr] font-plus-jakarta-sans w-screen  ">
      <Heading isDarkMode={isDarkMode} />
      <div
        className={`${
          isSidebarOpen
            ? 'transition-all ease-linear delay-75 grid grid-cols-1 md:grid-cols-[300px_1fr] md:grid-rows-1 overflow-hidden '
            : 'grid grid-cols-1 md:grid-cols-[300px_1fr] md:grid-rows-1 md:-ml-75 transition-all delay-75 ease-linear overflow-hidden'
        }`}
      >
        <Sidebar
          setOpen={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          isOpen={isSidebarOpen}
        />
        <div className="  overflow-auto custom-scroll  ">
          <Outlet />
        </div>
      </div>
    </main>
  );
}

export default AppLayout;
