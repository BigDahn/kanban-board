import { useKanban } from '@/context/Kanban';
import { TriangleAlert } from 'lucide-react';

function DeleteAccountTrigger() {
  const { dispatch } = useKanban();
  return (
    <div className="border-1 px-4 py-4 border-red-400 flex flex-col gap-3 rounded-sm ">
      <div className="flex gap-3 items-center text-secondary-300 text-[16px]">
        <h3 className="font-semibold uppercase tracking-wide ">Danger Zone</h3>
        <TriangleAlert />
      </div>
      <p className="mt-2 text-[15px] tracking-wide text-slate-400 ">
        Deleting your account is permanent and cannot be undone. All your
        boards, tasks, and account data will be removed immediately.
      </p>
      <div className="flex justify-end w-full">
        <button
          onClick={() => dispatch({ type: 'OPEN_DELETE_MODAL' })}
          className="flex justify-end  py-2 rounded-sm text-[14px] px-3 text-white bg-secondary-300 font-semibold cursor-pointer"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default DeleteAccountTrigger;
