import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import EditBoard from '../Boards/EditBoard';
import Logout from '../LogOut';
import ViewAccount from '../../page/ViewAccount';
import DeleteBoard from '../Boards/DeleteBoard';
import { useKanban } from '@/context/Kanban';

function Dropdown({ options, boards }) {
  const { isDropDownOpen, dispatch } = useKanban();
  const { edit, boardName } = options;

  return (
    <DropdownMenu.Root
      open={isDropDownOpen}
      onOpenChange={(open) => {
        if (!open) dispatch({ type: 'TOGGLE_DROP_DOWN' });
      }}
    >
      <DropdownMenu.Trigger asChild>
        <button
          className="cursor-pointer"
          onClick={() => {
            dispatch({ type: 'TOGGLE_DROP_DOWN' });
          }}
        >
          <img src="/icon-vertical-ellipsis.svg" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[180px] rounded-sm bg-primary-300 py-[0.7em] shadow-sm shadow-black/70  will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade mr-[1em] md:mr-[2em] flex flex-col gap-2 dark:bg-white"
          sideOffset={20}
        >
          <DropdownMenu.Item
            className="group relative flex h-[25px] select-none items-center rounded-[3px]  text-[13px] leading-none text-gray-400 py-4 hover:bg-white dark:hover:bg-primary-100 
          dark:hover:text-white
          outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1  px-[0.9em]"
          >
            <ViewAccount />
          </DropdownMenu.Item>

          {boards?.board.length >= 1 && (
            <div className="flex flex-col gap-2">
              <DropdownMenu.Item
                className="group relative flex h-[25px] select-none items-center rounded-[3px]  text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1 text-primary-100 font-bold font-plus-jakarta-sans capitalize text-[14px] cursor-pointer hover:bg-white dark:hover:bg-primary-100  dark:hover:text-white px-[0.9em]  py-4"
                onSelect={(e) => {
                  e.preventDefault();
                  // IMPORTANT: Prevents dropdown from auto-closing
                }}
              >
                <EditBoard edit={edit} />
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="group relative flex h-[25px] select-none items-center rounded-[3px]  text-[13px] leading-none  outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1 dark:hover:bg-primary-100 hover:text-red-600  font-bold  px-[0.9em] py-4 font-plus-jakarta-sans capitalize text-[14px] text-red-500 hover:bg-white cursor-pointer dark:hover:text-white"
                onSelect={(e) => {
                  e.preventDefault(); // IMPORTANT: Prevents dropdown from auto-closing
                }}
              >
                <DeleteBoard boardName={boardName} />
              </DropdownMenu.Item>
            </div>
          )}
          <DropdownMenu.Item
            className="group relative flex h-[25px] select-none items-center rounded-[3px]  text-[13px] leading-none  outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1  px-[0.9em]  font-bold font-plus-jakarta-sans capitalize text-[14px] text-gray-400 hover:bg-white py-4 cursor-pointer dark:hover:text-black dark:hover:bg-primary-100 "
            // onSelect={(e) => {
            //   e.preventDefault(); // IMPORTANT: Prevents dropdown from auto-closing
            // }}
          >
            <Logout text="logout" />
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default Dropdown;
