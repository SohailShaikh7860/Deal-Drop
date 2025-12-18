"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import { LogIn } from 'lucide-react'
import { AuthModel } from './Authmodel'

const AuthButton = ({user}) => {
    const [showAuthModel, setAuthModel] = useState(false);
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
