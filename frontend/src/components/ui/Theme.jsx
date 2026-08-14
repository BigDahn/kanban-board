import { useKanban } from '../../context/Kanban';

function Theme() {
  const { isDarkMode, dispatch } = useKanban();

  return (
    <section className="bg-primary-300 dark:bg-primary-100/25 py-3 h-12 rounded-sm flex items-center justify-center gap-[1.3em] ">
      <img src="/icon-light-theme.svg" />
      <div>
        <label
          htmlFor="check"
          className="inline-flex w-[31px] h-[15px] items-center justify-center rounded-full bg-purple-600 cursor-pointer "
        >
          <input
            type="checkbox"
            id="check"
            name="check"
            checked={isDarkMode}
            className="sr-only"
            onChange={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
          />

          <div
            className={`${
              isDarkMode
                ? 'relative -translate-x-2 w-[15px] h-[15px] rounded-full bg-white transition-all ease-linear  duration-300'
                : 'relative translate-x-2 h-[15px] w-[15px] rounded-full bg-white  transition-all ease-linear duration-300'
            }`}
          ></div>
        </label>
      </div>
      <img src="/icon-dark-theme.svg" />
    </section>
  );
}

export default Theme;
