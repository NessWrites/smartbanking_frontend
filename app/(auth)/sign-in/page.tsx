import AuthForm from '@/components/AuthForm'
import React from 'react'
import Image from 'next/image'

const SignIn = () => {
  return (
    
    <section className='flex-center size-full max-sm:px-6 relative'>
      {/* Background GIF container - right side */}
      <h1 className="fixed top-10 left-10 w-full text-top-center font-extrabold text-blue-600 text-2xl bg-white py-2 z-50">
  Assisted by AI
</h1>

     
      <div className="hidden md:block absolute right-0 bottom-10 h-full w-1/2 overflow-hidden">
        <div 
          className="h-[100%] w-[100%] -left-[5%] -bottomm-[10%] absolute bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url(/icons/smart_bank.gif)',
            backgroundSize: 'contain',
            backgroundPosition: 'center center'
          }}
        ></div>
      </div>
      
      
      {/* Semi-transparent overlay to improve form readability */}
      <div className="hidden md:block absolute right-400 top-0 h-full w-1/2 bg-black bg-opacity-10"></div>
      
      {/* Auth Form - will stay on left side */}
      <div className="relative z-10 w-full md:w-1/3 -translate-x-200 -translate-y-12">
        <AuthForm type="sign-in"/>
      </div>

      {/* New chatbot GIF in lower left corner */}
      <div className="absolute left-0 bottom-0 z-0 w-[1000px] h-[1100px] -translate-x-1/4 translate-y-4/5 opacity-100">
        <Image
          src="/icons/chatbot.gif"
          alt="Chatbot assistant"
          width={800}
          height={800}
          className="w-full h-full object-contain"
          unoptimized // Recommended for GIFs
        />
      </div>
      <h2 className="fixed bottom-10 right-10 w-full text-right font-extrabold text-blue-600 text-2xl bg-white py-2 z-50">
  With secure ATM withdraw
</h2>
    </section>
  )
}

export default SignIn