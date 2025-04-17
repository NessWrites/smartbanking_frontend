
import AuthForm from '@/components/AuthForm'
import React from 'react'

const ChangePassword = async() => {
  //const loggedInUser = await getLoggedInUser();
  //console.log(loggedInUser)
  return (
	<section className='flex-center size-full
  max-sm:px-6'>
    <AuthForm type = "change-password"/>


  </section>
  )
}

export default ChangePassword