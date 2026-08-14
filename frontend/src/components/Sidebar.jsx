import { useLocation } from 'react-router-dom';
import NavLinks from './NavLinks';
import Theme from './ui/Theme';
import ProfileLink from './Profile/ProfileLink';

function Sidebar({ setOpen, isOpen }) {
  const { pathname } = useLocation();

  const path = pathname.split('/')[1];
  return (
    <main className="bg-primary-400 dark:bg-white  justify-between pt-[0.4em]  border-r border-r-primary-500 dark:border-r-gray-200 hidden  md:flex h-full flex-col relative ">
      {path.startsWith('account') ? (
        <ProfileLink />
      ) : (
        <NavLinks isOpen={isOpen} setOpen={setOpen} />
      )}
      <section className="py-[1.5em] flex flex-col gap-[1em] px-[1.5em] ">
        <Theme />

        <button
          className="flex justify-start gap-2  items-center font-bold text-[15px] text-primary-600 cursor-pointer  z-40 "
          onClick={() => setOpen(false)}
        >
          <img src="/icon-hide-sidebar.svg" />
          Hide Sidebar
        </button>

        {!isOpen && (
          <div className="w-full justify-end bottom-3 ml-8 items-end flex  absolute">
            <button
              className="w-14 h-12 bg-primary-100 rounded-br-full rounded-tr-full flex justify-center items-center cursor-pointer "
              onClick={() => setOpen(true)}
            >
              <img src="/icon-show-sidebar.svg" />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default Sidebar;
