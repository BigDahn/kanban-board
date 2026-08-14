import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useAuth';
import Loading from './ui/Loading';
import toast from 'react-hot-toast';

function ProtectedRoute() {
  const { data: user, isLoading, error } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error(error?.response?.data?.message);
      navigate('/login');
    }
  }, [isLoading, user, navigate, error]);

  if (isLoading) return <Loading />;

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default ProtectedRoute;
