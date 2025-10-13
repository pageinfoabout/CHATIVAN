import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'
import { useRef } from 'react'




import toast from 'react-hot-toast'


const ChatBox = () => {

  const containerRef = useRef(null)


  const { selectedChat, theme, user, axios, token, setUser} = useAppContext()
  
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  
  const [prompt, setPrompt]  = useState('')
  const [mode, setMode]  = useState('text')
  const [isPublished, setIsPublished]  = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      if(!user) return toast.error('Please login to generate image');
      
      const promptcopy = prompt;
      setPrompt('');
      setMessages(prev => [...prev, {role: 'user', content: prompt, timestamp: Date.now(), isImage: false, }]);
      setLoading(true);
      
      const {data} = mode === 'image' ? await axios.post(`/api/message/image`, {chatId: selectedChat._id, prompt: promptcopy, isPublished}, {headers: {Authorization:token}}) : (mode === 'text' ? await axios.post(`/api/message/text`, {chatId: selectedChat._id, prompt: promptcopy}, {headers: {Authorization:token}}) : null)
      console.log(data)
      
      if(data.success){
        setMessages(prev => [...prev, data.reply])
        if (mode === 'image'){
          setUser(prev => ({...prev, credits: prev.credits - 2}))
        }else{
          setUser(prev => ({...prev, credits: prev.credits - 1}))
        }
      }else{
        toast.error(data.message);
        setPrompt(promptcopy);
      }
    } catch (error) {
      toast.error(error.message);
    }finally{
      setPrompt('');
      setLoading(false);
    } 
  }
    


  useEffect(() => {
    if(selectedChat){
      setMessages(selectedChat.messages)
    }
  },[selectedChat])

  useEffect(() => {
    if(containerRef.current){
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  },[messages])
  

  return (
    <div className='flex-1 flex flex-col justify beetween m-5 md:m-10 x1:mx-30 max-md:mt-14 2xl:pr-40'>



        {/* Chat Messages */}
        <div ref={containerRef} className='flex-1 mb-5 overflow-y-scroll '>
          {messages.length === 0 && (
            <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
              <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="" className='w-full max-w-56 sm:max-w-68'/>
              <p className='mt-5 text-5xl sm:text-6xl md:text-4xl font-semibold tracking-tight text-center text-gray-500 dark:text-white'>
                Select a chat or start a new one
                </p>
            </div>
          )}

          {messages.map((m, i) => <Message key={i} msg={m}/>)}

          {/* Three Dots Loading */}
          
          {loading && 
            <div className='loader mt-3 flex items-center gap-2'>
            <div className='w-1.5 h-1.5 rounded-full bg-[#b8b8b8] dark:bg-purple-400 animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-[#b8b8b8] dark:bg-purple-400 animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-[#b8b8b8] dark:bg-purple-400 animate-bounce'></div>
            </div>
            
             
             }


        </div>

        {mode === 'image' && (
          <label className='flex items-center gap-2 mb-3 text-sm mx-auto border border-gray-300 dark:border-[#80609F]/30 rounded-full p-3 pl-4'>
            <p className='text-xs' >Upload an image to Community </p>
            <input type='checkbox' className='cursor-pointer'
            checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)}  />
          </label> 
        )}

          



        {/* Prompt Input Box */}
        <form onSubmit={onSubmit} className='bg-white dark:bg-white/10 border border-gray-300 dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex items-center gap-4'>
          <select onChange={(e) => setMode(e.target.value)} value={mode} className='text-sm pl-3 pr-2 outline-none'>
             <option className='dark:bg-purple-900' value="text">Text </option>
             <option className='dark:bg-purple-900' value="image"> Image  </option>
          </select>
          <input onChange={(e) => setPrompt(e.target.value)} value={prompt}  type="text" placeholder='Enter your prompt' className='flex-1 w-full text-sm outline-none' required/>
          <button disabled={loading}>
            <img src={loading ? assets.stop_icon : assets.send_icon} alt="" className='w-8 cursor-pointer'/>
          </button>
        </form>
    </div>
  )
}



export default ChatBox