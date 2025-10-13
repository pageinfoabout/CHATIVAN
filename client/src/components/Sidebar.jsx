import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import moment from 'moment'
import toast from 'react-hot-toast'

 
const Sidebar = ({isMenuOpen, setIsMenuOpen}) => {

    const { user, chats, setSelectedChat, theme, setTheme, navigate, createNewChat, axios, setChats, fetchUserChats, setToken, token } = useAppContext()
    const [search, setSearch] = useState('')

    const logout = async () => {
      localStorage.removeItem('token');
      setToken(null);
      toast.success('Logged out successfully');
      
    }

    const deleteChat = async (e, chatId) => {
      try {
        e.stopPropagation();
        const confirm = window.confirm('Are you sure you want to delete this chat?');
        if(!confirm) return;
        const {data} = await axios.post('/api/chat/delete', {chatId}, {headers: {Authorization:token}})
        if(data.success){
          setChats(prev => prev.filter(chat => chat._id !== chatId));
          await fetchUserChats();
          toast.success('Chat deleted successfully');
        }
      } catch (error) {
        toast.error(error.message);
      }
    }


  return (
    <div className={`fixed md:static inset-y-0 left-0 z-50 w-72 flex flex-col h-screen p-5
      dark:bg-gradient-to-b dark:from-[#242124]/30 dark:to-[#000000]/30 to-[#000000]/30
      border-r border-[#000000]/30 backdrop-blur-3xl transform transition-transform duration-300
      ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* logo */} 
        <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="" className='w-full max-w-24'/>   
        {/* New Chat Button */}
        <button onClick={createNewChat} className='flex justify-center items-center w-full py-2 mt-10 text-white bg-gradient-to-r from-[#FFFFFF] to-[#000000] text-sm rounded-md
cursor-pointer border border-gray-400 dark:border-white/20'>
          <span className='mr-2 text-x1'>+</span> New Chat
           
        </button>
        {/* Search Bar */}
        <div className='flex items-center gap-2 p-3 mt-4 border border-gray-400
dark:border-white/20 rounded-md'>
          <img src={assets.search_icon} alt="" className='w-4 not-dark:invert ' />
          <input onChange={(e) => setSearch(e.target.value)} value={search} type="text" placeholder='Search Bar' className='text-xs placeholder:text-gray-400 bg-transparent outline-none'/>
        </div>
        {/* RecentChats */}
        {chats.length > 0 && <p className='mt-4 text-sm'>Recent chats</p>}
        <div className='flex-1 overflow-y-scroll mt-3 tx-sm space-y-3'>
          {
          
          chats.filter((chat)=> chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) : chat.name.toLowerCase().includes(search.toLowerCase())).map((chat) => (
              <div onClick={()=> {navigate ('/');setSelectedChat(chat); setIsMenuOpen(false)}}
              key={chat._id} className='p-2 px-4 dark:bg-[#57317C]/10 
              border border-gray-300 dark:border-[#80609F]/15 rounded-md cursor-pointer
              flex justify-between group'>
                <div className='flex-1 min-w-0'>
                  <p className='truncate w-full'>
                    {chat.messages.length > 0 ? chat.messages[0].content.slice(0,32) : chat.name}
                  </p>
                  <p className='text-xs text-gray-500 dark:text-[#B1A6C0]'>
                    {moment(chat.updatedAt).fromNow()}</p>
                </div>
                <img src={assets.bin_icon} 
                 className='w-4 shrink-0 cursor-pointer not-dark:invert'
                 alt=""
                 onClick= {e=> toast.promise(deleteChat(e, chat._id), {loading: 'Deleting chat...'})}/>
              </div>
            ))
          }
        </div> 

        {/* Community Images */}
        <div onClick={() => {navigate('/community'); setIsMenuOpen(false)}} className='flex items-center gap-2 p-3 mt-4 border border-gray-300
dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all'>
          <img src={assets.gallery_icon} alt="" className='w-4 not-dark:invert'/>
          <div className='flex flex-col text sm'>
            <p>Community Images</p>
          </div>
        </div>
         
        {/* Credits Purchases Option */}
        <div onClick={() => {navigate('/credits'); setIsMenuOpen(false)}} className='flex items-center gap-2 p-3 mt-4 border border-gray-300
dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all'>
          <img src={assets.diamond_icon} alt="" className='w-4 dark:invert'/>
          <div className='flex flex-col text sm '>
            <p>Credits : {user?.credits}</p>
            <p className='text-xs text-gray-400'>Purchase Credits to use Picture.AI</p>
          
          </div>
          
        </div>
            
        {/* Dark Mode Toggle */}
        <div  className='flex justify-between items-center gap-2 p-3 mt-4 border border-gray-300
dark:border-white/15 rounded-md'>
          <div className='flex items-center gap-2 text-sm '>
            <img src={assets.theme_icon} alt="" className='w-4 not-dark:invert'/>
            <p>Dark Mode</p>
          </div>
          <label className='relative inline-flex cursor-pointer'>
            <input onChange={()=> setTheme(theme === 'dark' ? 'light' : 'dark')} 
            type="checkbox" 
            className='sr-only peer' 
            checked={theme === 'dark'}
            />
            <div className='w-9 h-5 bg-gray-400 rounded-full peer peer-checked:bg-purple-600 transition-all'>
            </div>
            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4'></span> 
          </label>
        </div>


        {/* User Account */}
        <div className='flex items-center gap-3 p-3 mt-4 border border-gray-300
dark:border-white/15 rounded-md cursor-pointer group'>
          <img src={assets.user_icon} alt="" className='w-7 rounded-full'/>
          <p className='flex-1 text-sm dark:text-black truncate'>{user ? user.name : 'Login your account'}</p>
          {user && <img onClick={logout} src={assets.logout_icon} alt="" className='h-5 cursor-pointer not-dark:invert'/>}
        </div>

 
 
        <img onClick={()=> setIsMenuOpen(false)} src={assets.close_icon} alt="" className='absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert'/>
        </div>
  )
}

export default Sidebar


