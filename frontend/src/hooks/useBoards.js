import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BoardsApi } from '../api/boards';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

export function useGetBoards() {
  return useQuery({
    queryKey: ['boards'],
    queryFn: BoardsApi.getAllBoard,
    staleTime: 0,
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BoardsApi.addNewBoard,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast.success(data.message);
    },
    onError: (error) => {
      console.error(error.response?.data?.message);
      toast.error(error.response?.data?.message || 'Failed to create board');
    },
  });
}

export function useEditBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BoardsApi.editBoard,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to edit board');
    },
  });
}

export function useGetBoard() {
  const { slug } = useParams();

  return useQuery({
    queryKey: ['boards', slug],
    queryFn: () => BoardsApi.getBoard(slug),
    enabled: !!slug,
  });
}

export function useAddStatus() {
  const queryClient = useQueryClient();
  const { slug } = useParams();
  return useMutation({
    mutationFn: ({ column, slug }) => BoardsApi.addStatus({ column, slug }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['boards', slug] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add status');
    },
  });
}

export function useDeleteBoard(onDeleteSuccess) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { slug } = useParams();
  return useMutation({
    mutationFn: (slug) => BoardsApi.deleteBoard(slug),
    onSuccess: async (data) => {
      toast.success(data.message);
      onDeleteSuccess?.();
      navigate('/');
      await queryClient.refetchQueries({ queryKey: ['boards'] });
      queryClient.removeQueries({ queryKey: ['boards', slug] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete board');
    },
  });
}
