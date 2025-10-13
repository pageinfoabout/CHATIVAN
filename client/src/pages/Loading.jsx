import React from 'react'
import { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'

const Loading = () => {
  const {fetchUser} = useAppContext

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUser()
      navigate('/')
      
    }, 8000)
    return () => clearTimeout(timeout)
    
    
  }, [])


 return (
  <div className='bg-gradient-to-b from-gray-300 to-black
  backdrop-opacity-60 flex items-center justify-center h-screen w-screen
  text-white text-2xl'>
    <div className='w-10 h-10 rounded-full bg-transparent border-4 border-white/30 border-t-white animate-spin'></div>
  </div>
  )
}

export default Loading