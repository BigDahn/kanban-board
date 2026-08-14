import { userAPI } from '@/api/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function useUpdateUser() {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: userAPI.updateProfile,
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Profile Updated Successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Something went very wrong');
    },
  });
}

export function useUpdatePassword() {
  const queryclient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: userAPI.updatePassword,
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ['user'] });
      queryclient.clear();
      toast.success('Password Updated Successfully. Please login again');
      navigate('/login');
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          'Something went very wrong. Please try again later',
      );
    },
  });
}

export function useEmailUpdate() {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: userAPI.updateEmail,
    onSuccess: (data) => {
      queryclient.invalidateQueries({ queryKey: ['user'] });
      toast.success(
        data.message ||
          'We sent a verification code to your email. Please verify your email',
      );
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          'Something went very wrong. Please try again later',
      );
    },
  });
}
export function useEmailVerify() {
  const queryclient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: userAPI.verifyEmail,
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ['user'] });
      queryclient.clear();
      toast.success('Email Verified Successfully');
      navigate('/login');
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          'Something went very wrong. Please try again later',
      );
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: userAPI.resendOtp,
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          'Something went very wrong. Please try again later',
      );
    },
  });
}
