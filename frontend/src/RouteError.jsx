import { useNavigate, useRouteError } from 'react-router-dom';

function RouteError() {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error('Route error:', error);
  return (
    <main className="max-w-screen bg-primary-400 dark:bg-secondary-100 min-h-screen mx-auto flex justify-center items-center flex-col gap-[3em] font-plus-jakarta-sans">
      <h2 className="text-white dark:text-black font-semibold text-[20px] md:text-[30px] capitalize">
        Something went wrong...
      </h2>
      <button
        className="bg-primary-100 text-white h-[50px] w-[200px] rounded-sm cursor-pointer font-bold text-[15px]"
        onClick={() => navigate('/')}
      >
        Go home
      </button>
    </main>
  );
}

export default RouteError;
