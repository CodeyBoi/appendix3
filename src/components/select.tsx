import { SelectHTMLAttributes } from 'react';

type SelectItem = {
  value: string | number;
  label: string;
};

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
  options: SelectItem[];
  label?: string;
  onChange?: (value: string) => void;
};

const Select = ({ options, label, onChange, ...props }: SelectProps) => {
  const id = Math.random().toString(36).substring(2);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.currentTarget.value);
  };
  return (
    <div className='flex flex-col'>
      {label && (
        <label htmlFor={id} className='flex flex-col gap-1'>
          {label}
        </label>
      )}
      <select onChange={handleChange} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
