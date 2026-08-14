import { useDroppable } from '@dnd-kit/react';
import TaskContainer from '../Tasks/TaskContainer';
import AddColumn from './AddColumn';

function Droppable({ column }) {
  const { status, color, tasks } = column;
  const { ref } = useDroppable({
    id: status,
  });

  return (
    <section
      key={status}
      ref={ref}
      className=" flex flex-col gap-1 space-y-1  w-screen max-w-[230px] md:max-w-[250px]"
    >
      <div className="flex items-center gap-1.5 ">
        <div
          style={{ backgroundColor: color }}
          className="h-2 w-2 rounded-full"
        ></div>
        <h2 className="capitalize text-gray-400 font-bold text-[15px]">
          {status}
        </h2>
      </div>

      <TaskContainer tasks={tasks} />
    </section>
  );
}

function BoardDetails({ board }) {
  const { column } = board;

  return (
    <main className="flex  gap-3 justify-between pb-3 w-full min-h-full  ">
      <div className="flex gap-[1em] md:gap-[2em] pt-2   ">
        {column.map((column) => {
          return <Droppable key={column.id} column={column} />;
        })}
      </div>
      <div className="cursor-pointer flex items-center justify-center ">
        <AddColumn />
      </div>
    </main>
  );
}

export default BoardDetails;
