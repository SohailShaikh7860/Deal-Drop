"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import { LogIn, LogOut } from 'lucide-react'
import { AuthModel } from './Authmodel'
import { signOut } from '@/app/action'

const AuthButton = ({user}) => {
    const [showAuthModel, setAuthModel] = useState(false);

    if(user){
        return(
        <form action={signOut}>
            <Button variant='ghost' size="sm" type="submit" className="gap-2">
                <LogOut className='w-4 h-4' />
                Sign Out
            </Button>
        </form>
        )
    }
  return (
    <div>
      <Button
            variant="default"
            size="sm"
            className="bg-orange-500 p-5 hover:bg-orange-600 cursor-pointer text-white"
            onClick={()=> setAuthModel(true)}
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>

          <AuthModel 
          isOpen={showAuthModel}
            onClose={()=> setAuthModel(false)}
          />
    </div>
  )
}

export default AuthButton
