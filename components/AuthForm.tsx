'use client';

import Link from 'next/link'
import React, { useState } from 'react'
import Image from "next/image"


import { number, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
  } from "@/components/ui/dialog";
  
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomInput from './CustomInput';
import { authFormSchema, fetchData } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fetchUserDetails, signIn, changePassword } from '@/lib/actions/user.actions';
 

const AuthForm = ({type}:{type: string}) => {
	const router = useRouter();
	const [user, setuser] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const formSchema = authFormSchema(type);
	const [showOtpDialog, setShowOtpDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
	const [otp, setOtp] = useState('');
	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
		  username: "",
		  password:''
		},
	  })

	  const handleChangePasswordClick = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setErrorMessage(null);
        
        try {
            // First send OTP
            const otpResponse = await fetch("http://localhost:8000/api/change-password/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ send_otp: true })
            });

            if (!otpResponse.ok) {
                throw new Error('Failed to send OTP');
            }

            // Show OTP dialog
            setShowOtpDialog(true);
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpSubmit = async () => {
        setIsLoading(true);
        setErrorMessage(null);
        
        try {
            const values = form.getValues();
            const response = await changePassword({
                verify_otp_and_change_password: true,
                otp_code: otp,
                new_password: values.password,
                confirm_password: values.retypePassword,
            });

            if (response.ok) {
                setShowOtpDialog(false);
                setShowSuccessDialog(true);
                setTimeout(() => {
                    setShowSuccessDialog(false);
                    router.push('/sign-in');
                }, 2000);
            } else {
                setErrorMessage(response.error || 'Failed to change password');
            }
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };
	 
	  // 2. Define a submit handler.
	  const onSubmit= async(
			data: z.infer<typeof formSchema>
		)=> {
		// Do something with the form values.
		// event.preventDefault(); // Prevents the default form submission

		setErrorMessage(null);
		setIsLoading(true);
		try{
			//Sign up with Appwrite and clean plain token
			if (type === 'change-password') {
				// Handle password change with OTP
				const response = await changePassword( {
				 
					verify_otp_and_change_password: true,
					otp_code: data.otp,
					new_password: data.password,
					confirm_password: data.retypePassword,
				  })
			
		
			
				
				if (response.ok) {
				  router.push('/sign-in'); // Redirect to login after successful password change
				} else {
				  setErrorMessage(response.error || 'Failed to change password');
				}
			   

				

			}
			if(type ==='sign-in'){
				const response = await signIn({
					username: data.username,
					password: data.password,
					// token: data.access_token
				})
				console.log({ response })

				if(response.access){

					 // Fetch user details using the token
					 //const userDetails = await fetchUserDetails(response.access);
					 //console.log("User Details:", userDetails);
				
				//Save the token to the local storage
				localStorage.setItem('authToken', response.access);
				console.log("Token Saved: ",localStorage.getItem('authToken'));
				// Redirect to home page with user details
                router.push('/',);

				// Make an authenticated request
                //await fetchData("http://localhost:8000/api/login");
            } else {
                console.log('No token found in response.');
            }
			
			
				// if(response) router.push('/')
				console.log({ responseData: response.data, response})
			}
			//console.log(values)
			setIsLoading(false);
		} catch (error: any) {
			console.log("Sign-in error:", error.message);
			setErrorMessage(error.message);

		} finally {
			setIsLoading(false);
		}

		
	  }

  return (
	<section className = "auth-form">
		<header className = 'flex flex-co gap-5 md:gap-8'>
		<Link href ="/"  className="cursor-pointer flex items-center gap-2">

			<Image 
				src ="/icons/logo.svg"
				width ={44}
				height={44}
				alt ="Smart Bank logo"
				/>
				<h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>
				Smart Banking</h1>
		</Link>	
	
		</header>

<div className = "flex flex-col gap-1 md:gap-3">
	<h1 className = "text-24 lg:text-30 font-semibold text-gray-900">
		{user 
		? 'Link Account':type ==='sign-in'?
		'Sign In':
		'Reset Password'
		}
		<p className = "text-16 front-normal text-gray-600">

			{user
			? 'Link your Account to get Started':
			'Enter your new password'
			}
		</p>

	</h1>
</div>

		
		{user?(
		<div className= "flex flex-col gap-4">
			{/*PlaidLink*/}

		</div>
	):(
		<>
		<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(onSubmit)(e); }} className="space-y-8"> */}
	  {type ==='change-password' && (
			<>
			
		

			
			</>
		)}

		<CustomInput
		control = {form.control} name ='username' label = 'Username'
		placeholder = 'Enter your phone number'
		/>
		<CustomInput
		control = {form.control} name ='password' label = 'Password'
		placeholder = 'Enter your password'
		/> 
		{type === 'change-password' && (
                <CustomInput
                  control={form.control} 
                  name='retypePassword' // Make sure this matches your schema
                  label='Confirm Password'
                  placeholder='Retype your password'
                />
              )}
		



		<div className = "flex flex-col gap-4">
        <Button type="submit" disabled = {isLoading}
		className = "form-btn">
			{isLoading?(
				<>
				<Loader2 size ={20}
				className = "animate-spin"/>&Nanum_Brush_Script;
				Loading...
				</>)
				:type === 'sign-in'
				?'Sign In':'Change Password'
			}
		</Button>
		</div>
      </form>
    </Form>
			<footer className = "flex justify-center gap-1">
				<p className = "text-14 font-normal text-gray-600 whitespace-pre-line">
					{type ==='sign-in'?
					"Forgot your password? An OTP will be sent to your registered phone number"

				:"An OTP is sent to your registered phone number"}
				</p >
				<Link href = {type ==='sign-in'? '/change-password':
					'/sign-in'
				}>
					{type ==='sign-in'? ' Send OTP':
					'Sign In'
				}

				</Link>
				{/* OTP Verification Dialog */}
				<Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter OTP</DialogTitle>
                        <DialogDescription>
                            We've sent an OTP to your registered phone number
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        {errorMessage && (
                            <p className="text-red-500 text-sm">{errorMessage}</p>
                        )}
                        <Button 
                            onClick={handleOtpSubmit}
                            disabled={isLoading || otp.length !== 6}
                            className="w-full"
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Verify OTP
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Success Dialog */}
            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Password Changed!</DialogTitle>
                        <DialogDescription>
                            Your password has been updated successfully.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>


			</footer>

		</>
	)
	}

	</section>
  )
}

export default AuthForm