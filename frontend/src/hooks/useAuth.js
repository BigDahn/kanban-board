import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: authAPI.getCurrentUser,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      toast.success('Logged In Successfully');
      navigate('/');
    },
    onError: (error) => {
      console.error('Login failed:', error.response?.data?.message);
      toast.error(error.response?.data?.message || 'Something went very wrong');
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: () => {
      toast.success('User Created Successfully');
      navigate('/');
    },
    onError: (error) => {
      console.error('Login failed:', error.response?.data?.message);
      toast.error(error.response?.data?.message);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: (data) => {
      queryClient.clear();
      toast.success(data.message);
      navigate('/login');
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authAPI.resetPassword,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate('/login');
    },
    onError: (error) => {
      console.error('Password reset failed:', error.response?.data?.message);
      toast.error(error.response?.data?.message);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: authAPI.forgotPassword,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      console.error(
        'Failed to send password reset link',
        error.response?.data?.message,
      );
      toast.error(error.response?.data?.message);
    },
  });
}
