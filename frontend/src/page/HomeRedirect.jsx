import { Navigate } from "react-router-dom";
import { useGetBoards } from "../hooks/useBoards";
import Loading from "../components/ui/Loading";
import EmptyBoard from "../components/Boards/EmptyBoard";

function HomeRedirect() {
  const { data: boards, isLoading, isFetching } = useGetBoards();

  if (isLoading || isFetching) return <Loading />;

  if (boards?.board?.length > 0) {
    const slug = boards.board[0].slug;

    return <Navigate to={`/board/${slug}`} replace />;
  }

  return <EmptyBoard />;
}

export default HomeRedirect;
