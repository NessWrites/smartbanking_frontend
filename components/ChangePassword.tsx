// components/ChangePasswordForm.js
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import CustomInput from './CustomInput';

// Define form schema
const changePasswordSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  otp: z.string().optional(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ChangePasswordForm = () => {
  const [step, setStep] = useState(1); // 1: request OTP, 2: verify OTP and change password
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      phoneNumber: '',
      newPassword: '',
      confirmPassword: '',
      otp: '',
    },
  });

  const handleSendOTP = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/users/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          send_otp: true,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2); // Move to OTP verification step
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          verify_otp_and_change_password: true,
          otp_code: values.otp,
          new_password: values.newPassword,
          confirm_password: values.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to change password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold mb-4">Password Changed Successfully!</h2>
        <p>Your password has been updated. You can now log in with your new password.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
      
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(step === 1 ? handleSendOTP : handleChangePassword)} 
          className="space-y-4"
        >
          {step === 1 ? (
            <>
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registered Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your registered phone number" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Send OTP
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">
                We've sent an OTP to your registered phone number. Please enter it below along with your new password.
              </p>
              
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter OTP" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Enter new password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Confirm new password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Change Password
                </Button>
              </div>
            </>
          )}
          
          {error && (
            <div className="text-red-500 text-sm text-center mt-2">
              {error}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;