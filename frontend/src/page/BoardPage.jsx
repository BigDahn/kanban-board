import { useGetBoard, useGetBoards } from '../hooks/useBoards';
import Loading from '../components/ui/Loading';
import BoardDetails from '../components/Boards/BoardDetails';
import { Navigate, useParams } from 'react-router-dom';
import DragDropController from '@/components/DragDropController';

function BoardPage() {
  const { data, isLoading } = useGetBoard();
  const { data: boards } = useGetBoards();
  const { slug } = useParams();

  if (isLoading) return <Loading />;

  const boardExists = boards?.board?.find((b) => b.slug === slug);
  if (!boardExists) return <Navigate to="/" replace />;

  return (
    <DragDropController>
      <div className="px-[1em] md:px-[1.6em] h-full ">
        <BoardDetails board={data} />
      </div>
    </DragDropController>
  );
}

export default BoardPage;
