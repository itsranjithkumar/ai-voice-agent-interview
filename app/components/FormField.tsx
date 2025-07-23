import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { FormControl, FormDescription, FormLabel, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';


interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  label: string;
  type?: 'text' | 'email' | 'password' |'file';
}

function FormField<T extends FieldValues>({
  name,
  control,
  placeholder,
  label,
  type
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='label'>{label}</FormLabel>
          <FormControl>
            <Input className="input"placeholder={placeholder} type={type} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;