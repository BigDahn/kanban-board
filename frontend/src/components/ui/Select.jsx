import React from 'react';

function Select({
  style,
  register,
  errors,
  label,
  column,
  currentStatus,
  disabled,
  name,
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={label}
        className={
          style
            ? style
            : 'text-white text-[15px] capitalize font-medium dark:text-black'
        }
      >
        {label}
      </label>
      <div className="flex flex-col gap-1 w-full">
        <select
          name={name}
          className="text-white dark:text-black  text-[15px] outline-none rounded-sm px-1 capitalize font-medium border-1 border-primary-500 dark:border-gray-300  hover:border-primary-100 h-[38px]    dark:hover:border-primary-100"
          {...register(`${name}`, {
            required: 'This field is required',
          })}
        >
          {!currentStatus ? (
            <option
              value=""
              className="bg-primary-500 text-[10px] text-primary-600 font-plus-jakarta-sans"
            >
              select an option below
            </option>
          ) : (
            <option
              value={currentStatus}
              className="bg-primary-500 text-[10px] text-primary-600 font-plus-jakarta-sans"
            >
              {currentStatus}
            </option>
          )}
          {column?.length > 0 ? (
            column.map((column, index) => {
              const { status } = column;

              return (
                <option
                  value={status}
                  disabled={disabled}
                  key={index}
                  className="bg-primary-500 text-[10px] text-primary-600 font-plus-jakarta-sans"
                >
                  {status}
                </option>
              );
            })
          ) : (
            <option disabled>No columns available</option>
          )}
        </select>
        {errors?.status && (
          <p className="text-[7px] text-secondary-400 capitalize font-bold">
            {errors.status.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Select;
