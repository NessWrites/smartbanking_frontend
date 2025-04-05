import React from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import {Control, FieldPath} from 'react-hook-form'
import { z } from 'zod'
import { authFormSchema } from '@/lib/utils'

// Create a union type for all possible form types
type FormType = 'sign-up' | 'sign-in' | 'change-password'

// Get schema for all possible form types
type FormSchema = z.infer<ReturnType<typeof authFormSchema>>

interface CustomInputProps {
  control: Control<FormSchema>,
  name: FieldPath<FormSchema>,
  label: string,
  placeholder: string
}

const CustomInput = ({control, name, label, placeholder}: CustomInputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div> 
          <FormLabel className="form-label">{label}</FormLabel>
          <FormLabel> 
            <div className="flex w-full flex-col">
              <FormControl>
                <Input
                  placeholder={placeholder}
                  className="input-class"
                  type={name === 'password' || name === 'retypePassword' ? 'password' : 'text'}
                  {...field}
                />
              </FormControl>
              <FormMessage className="form-message mt-2"/>
            </div>
          </FormLabel>
        </div>
      )}
    />
  )
}

export default CustomInput