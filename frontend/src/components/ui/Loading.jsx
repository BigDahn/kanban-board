import Loader from './Loader';

function Loading() {
  return (
    <main className="w-screen bg-primary-300 text-white dark:text-black dark:bg-secondary-100 overflow-hidden min-h-screen mx-auto flex justify-center items-center flex-col gap-[3em] font-plus-jakarta-sans">
      <Loader />
    </main>
  );
}

export default Loading;
