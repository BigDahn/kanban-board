import { Outlet, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useEffect, useRef, useState } from 'react';
import { useKanban } from '@/context/Kanban';

function WelcomePage() {
  const [showOutlet, setShowOutlet] = useState(false);
  const { isDarkMode } = useKanban();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const handleRedirect = () => {
    clearTimeout(timerRef.current);
    setShowOutlet(true);
    navigate('/', { replace: true });
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      handleRedirect();
    }, 7000);

    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <main>
      {showOutlet ? (
        <Outlet />
      ) : (
        <main className="flex flex-col gap-[1.4em] m-auto max-w-screen items-center justify-center h-screen font-plus-jakarta-sans bg-primary-500 dark:bg-white ">
          {isDarkMode ? (
            <img src="/logo-dark.svg" className="w-[200px]" />
          ) : (
            <img src="/logo-light.svg" className="w-[200px]" />
          )}
          <div className="space-y-3 justify-center flex flex-col sm:max-w-[350px] md:max-w-[700px]  w-screen">
            <h3 className="sm:text-[27px] md:text-[36px] font-bold text-white capitalize dark:text-black text-center">
              Welcome Back 🤗.. <br />{' '}
              <span className="">Let's you get started</span>
            </h3>
            <Button
              onClick={handleRedirect}
              className="bg-primary-100 py-2.5 rounded-sm text-white font-bold text-[20px] capitalize cursor-pointer hover:bg-white hover:text-primary-100 transition-all ease-linear delay-75 dark:hover:bg-primary-100/25"
            >
              Click here
            </Button>
          </div>
        </main>
      )}
    </main>
  );
}

export default WelcomePage;
