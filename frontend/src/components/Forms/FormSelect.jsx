import { useFormContext } from 'react-hook-form';

function FormSelect({
  label,
  name,
  value,
  className,
  disabled,
  rules,
  options,
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="flex flex-col gap-1 w-full ">
      <label className="font-bold capitalize text-[15px] text-white dark:text-black">
        {label}
      </label>
      <select
        name={name}
        value={value}
        className={className}
        {...register(name, rules)}
        disabled={disabled}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors?.[name] && (
        <p className="text-[7px] px-2 text-secondary-400 capitalize font-bold">
          {errors[name].message}
        </p>
      )}
    </div>
  );
}

export default FormSelect;
