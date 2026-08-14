import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import NavLinks from '../NavLinks';
import { useLocation } from 'react-router-dom';
import Theme from './Theme';
import { useKanban } from '@/context/Kanban';
import ProfileLink from '../Profile/ProfileLink';
function SmallSidebar() {
  const { isMobileSidebarOpen, dispatch } = useKanban();
  const { pathname } = useLocation();

  const path = pathname.split('/')[1];

  const closeMobileSidebar = () => dispatch({ type: 'TOGGLE_MOBILE_SIDEBAR' });
  return (
    <Dialog.Root
      open={isMobileSidebarOpen}
      onOpenChange={() => dispatch({ type: 'TOGGLE_MOBILE_SIDEBAR' })}
    >
      <Dialog.Trigger asChild>
        <div className="flex md:hidden">
          <img
            src={
              isMobileSidebarOpen
                ? '/icon-chevron-up.svg'
                : '/icon-chevron-down.svg'
            }
            alt={isMobileSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          />
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed h-screen inset-0 mt-[4em] bg-black/50 data-[state=open]:animate-overlayShow md:hidden" />
        <Dialog.Content
          forceMount
          className="absolute left-[12rem] top-[13.5rem] max-h-[290px]  w-[280px] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-sm overflow-y-auto bg-primary-400 dark:bg-white p-[15px] focus:outline-none data-[state=open]:animate-contentShow flex flex-col gap-4 md:hidden"
        >
          <VisuallyHidden.Root>
            <Dialog.Title>Navigation menu</Dialog.Title>
          </VisuallyHidden.Root>
          {path.startsWith('account') ? (
            <ProfileLink onLinkClick={closeMobileSidebar} />
          ) : (
            <NavLinks onLinkClick={closeMobileSidebar} />
          )}
          <Theme />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default SmallSidebar;
