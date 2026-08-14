import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

function FormInput({
  name,
  label,
  type = 'text',
  rules,
  className,
  disabled,
  autoComplete,
  value,
}) {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
  const [reveal, setReveal] = useState(false);

  const [password, passwordConfirm] = watch(['password', 'passwordConfirm']);
  const isPassword = type === 'password';

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="font-bold capitalize text-[15px] dark:text-[15px] pb-2 text-white dark:text-black">
        {label}
      </label>
      <div className="relative w-full">
        <input
          type={isPassword ? (reveal ? 'text' : 'password') : type}
          disabled={disabled}
          defaultValue={value}
          {...register(name, rules)}
          autoComplete={autoComplete}
          className={`${className} ${disabled ? 'text-gray-400' : ' '}`}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={reveal ? 'Hide password' : 'Show password'}
            onClick={(e) => {
              e.preventDefault();
              setReveal(!reveal);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            {reveal ? (
              <Eye size={16} color="gray" />
            ) : (
              <EyeOff size={16} color="gray" />
            )}
          </button>
        )}
      </div>
      {name === 'passwordConfirm' && password !== passwordConfirm && (
        <p className="text-[7px] text-secondary-400 capitalize font-bold">
          Passwords do not match
        </p>
      )}

      {errors?.[name] && (
        <p className="text-[7px] text-secondary-400 capitalize font-bold">
          {errors[name].message}
        </p>
      )}
    </div>
  );
}

export default FormInput;
