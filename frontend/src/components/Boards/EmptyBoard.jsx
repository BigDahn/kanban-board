import CreateBoard from './CreateBoard';

function EmptyBoard() {
  return (
    <main className="flex flex-col m-auto  gap-3 h-full items-center justify-center max-w-[600px]">
      <h3 className="text-[22px] text-primary-600 font-bold text-center px-3 ">
        No Boards available, click the button below to create a new board
      </h3>
      <div className="py-4 px-4 rounded-full bg-primary-100">
        <CreateBoard className="flex gap-2  items-center justify-center rounded leading-none  outline-none outline-offset-1 capitalize text-white text-[15px] font-bold hover:bg-mauve3 focus-visible:outline-2 focus-visible:outline-violet6 select-none cursor-pointer" />
      </div>
    </main>
  );
}

export default EmptyBoard;
