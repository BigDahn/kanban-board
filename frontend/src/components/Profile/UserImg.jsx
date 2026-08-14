import { Camera, Trash2, Upload } from 'lucide-react';
import Button from '../ui/Button';
import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useKanban } from '@/context/Kanban';

function UserImg({ url }) {
  const { isUploadModalOpen, dispatch } = useKanban();
  const { setValue } = useFormContext();

  const fileRef = useRef(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        dispatch({ type: 'CLOSE_BOARD' });
      }
    };

    if (isUploadModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUploadModalOpen, dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('photo', file);
      dispatch({ type: 'CLOSE_BOARD' });
    }
  };

  const handleRemoveImage = () => {
    setValue('photo', 'default');
    dispatch({ type: 'TOGGLE_UPLOAD_MODAL' });
  };

  return (
    <div className="relative">
      <div className="h-[150px] w-[150px] rounded-full flex items-center justify-center outline-none relative ">
        <img
          src={url}
          alt="profile image"
          className="object-cover rounded-full "
        />
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileRef}
        onChange={handleImageChange}
      />
      <Button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => dispatch({ type: 'TOGGLE_UPLOAD_MODAL' })}
        className="bg-purple-500 dark:bg-white   h-7 w-7 rounded-full flex items-center justify-center relative bottom-12 left-30 cursor-pointer"
      >
        <Camera
          size={16}
          strokeWidth={3}
          className="dark:text-primary-100 text-white"
        />
      </Button>
      {isUploadModalOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-[109px] md:top-[108px] left-[154px] md:left-[153px] bg-white  rounded-lg shadow-lg p-2 flex flex-col gap-1 z-50 w-40"
        >
          <button
            type="button"
            onClick={() => {
              dispatch({ type: 'TOGGLE_UPLOAD_MODAL' });
              fileRef.current.click();
            }}
            className="flex items-center gap-2 px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md w-full"
          >
            <Upload size={14} />
            Upload photo
          </button>
          <button
            type="button"
            onClick={() => {
              handleRemoveImage();
            }}
            className="flex items-center gap-2 px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 rounded-md w-full"
          >
            <Trash2 size={14} />
            Remove photo
          </button>
        </div>
      )}
    </div>
  );
}

export default UserImg;
