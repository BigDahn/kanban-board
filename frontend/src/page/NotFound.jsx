import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();
  return (
    <main className="max-w-screen bg-primary-400 dark:bg-secondary-100 min-h-screen mx-auto flex justify-center items-center flex-col gap-[1.4em] font-plus-jakarta-sans">
      <div className="flex flex-col gap-1 text-white text-center dark:text-black items-center">
        <h2 className="text-[120px] md:text-[250px] font-bold ">404</h2>
        <div className="flex flex-col gap-2 items-center">
          <h4 className="text-[20px] md:text-[30px] font-semibold">Oops!!!!</h4>
          <p className="text-[18px] font-medium">
            The page you are looking for does not exist
          </p>
        </div>
      </div>
      <button
        className="bg-primary-100 text-white h-[50px] w-[200px] rounded-sm cursor-pointer font-bold text-[15px]"
        onClick={() => navigate('/')}
      >
        Go home
      </button>
    </main>
  );
}

export default NotFound;
