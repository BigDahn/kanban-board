import { useGetBoards } from '../hooks/useBoards';
import Board from './Boards/Board';

function NavLinks({ onLinkClick }) {
  const { data: boards } = useGetBoards();

  return (
    <aside className="  flex flex-col justify-between">
      <Board boards={boards} onLinkClick={onLinkClick} />
    </aside>
  );
}

export default NavLinks;
