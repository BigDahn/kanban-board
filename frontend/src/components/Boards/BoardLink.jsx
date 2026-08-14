import { NavLink } from 'react-router-dom';

function BoardLink({ board, onLinkClick }) {
  return (
    <div className="flex flex-col gap-3">
      {board.map((board) => {
        const slug = board.slug;
        return (
          <NavLink
            key={board._id}
            onClick={onLinkClick}
            to={`/board/${slug}`}
            className={({ isActive }) => {
              return isActive
                ? 'bg-primary-100 hover:bg-white hover:text-primary-600 text-white cursor-pointer flex items-center gap-2 py-4  px-[1.5em] md:py-[1em] rounded-tr-full rounded-br-full md:w-69 dark:hover:bg-primary-100/25 dark:hover:text-primary-100'
                : 'text-primary-600 flex items-center gap-2 py-4 px-[1.5em] md:py-[1em] rounded-tr-full rounded-br-full md:w-69 hover:bg-white hover:text-primary-600 cursor-pointer dark:hover:bg-primary-100/25 dark:hover:text-primary-100';
            }}
          >
            <img src="/icon-board.svg" />
            <h2 className=" capitalize  text-[15px] font-bold">
              {board.title}
            </h2>
          </NavLink>
        );
      })}
    </div>
  );
}

export default BoardLink;
