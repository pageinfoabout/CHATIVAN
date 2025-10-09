import React from 'react'
import { useNavigate } from 'react-router-dom' 
import { useEffect } from 'react'

const Loading = () => {
  
  const navigate = useNavigate()

  useEffect(() => {
    const timeout = setTimeout(() => { 
      navigate('/')
  },8000)
  return () => clearTimeout(timeout)
 },[navigate])



 return (
  <div className='bg-gradient-to-b from-gray-300 to-black
  backdrop-opacity-60 flex items-center justify-center h-screen w-screen
  text-white text-2xl'>
    <div className='w-10 h-10 rounded-full bg-transparent border-4 border-white/30 border-t-white animate-spin'></div>
  </div>
  )
}

export default Loading