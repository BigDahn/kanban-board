import CreateBoard from './CreateBoard';
import Loading from '../ui/Loading';
import BoardLink from './BoardLink';
import CreateBoardTrigger from './CreateBoardTrigger';

function Board({ boards, onLinkClick }) {
  const { board = [] } = boards || {};

  return (
    <section className="flex flex-col gap-[1em] md:gap-[1.6em] ">
      <h3 className="text-[12px] font-bold tracking-[2.4px] uppercase text-primary-600 px-[1.5em] ">
        {board.length > 1
          ? `All Boards (${board.length})`
          : `All Board (${board.length})`}
      </h3>
      <div className="flex flex-col gap-[0.5em]">
        <BoardLink onLinkClick={onLinkClick} board={board} />
        <div className="flex items-center gap-2  hover:bg-white py-4  px-[1.5em] md:py-[1em] rounded-tr-full rounded-br-full md:w-69 cursor-pointer dark:hover:bg-primary-100/25 dark:hover:text-primary-100">
          <img src="/icon-board.svg" />

          <CreateBoardTrigger className="flex gap-2  items-center justify-center rounded leading-none  outline-none outline-offset-1 capitalize text-primary-100 text-[15px] font-bold hover:bg-mauve3 focus-visible:outline-2 focus-visible:outline-violet6 select-none cursor-pointer dark:text-primary-100" />
        </div>
      </div>
    </section>
  );
}

export default Board;
