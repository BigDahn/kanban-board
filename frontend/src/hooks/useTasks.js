import { useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import { TasksApi } from '../api/tasks';
import { useParams } from 'react-router-dom';

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { slug } = useParams();
  return useMutation({
    mutationFn: ({ data, slug }) => TasksApi.addTask({ data, slug }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['boards', slug] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          'An error occurred while creating the task.',
      );
    },
  });
}

export function useDeleteTask({ dispatchCall }) {
  const queryClient = useQueryClient();
  const { slug } = useParams();
  return useMutation({
    mutationFn: ({ taskId }) => TasksApi.deleteTask({ slug, taskId }),
    onSuccess: (data) => {
      toast.success(data.message);
      dispatchCall?.();
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['boards', slug] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          'An error occurred while deleting the task.',
      );
    },
  });
}

export function useEditTask() {
  const queryClient = useQueryClient();
  const { slug } = useParams();
  return useMutation({
    mutationFn: ({ taskId, data }) => TasksApi.editTask({ slug, taskId, data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['boards', slug] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          'An error occurred while editing the task.',
      );
    },
  });
}
