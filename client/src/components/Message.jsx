import { React, useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'

const Message = ({ msg }) => {
  
  useEffect(() => {
    Prism.highlightAll()
  },[msg.content] ) 

  return (
    <div>
      {msg.role === "user" ? (
        <div className='flex items-start justify-end my-4 gap-2'>
          <div className='flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-gray-300 dark:border-white/20 rounded-md max-w-2xl'>
            <p className='text-sm dark:text-white'>{msg.content}</p>
            <span className='text-xs text-gray-400 dark:text-[#868686]'>
              {moment(msg.timestamp).fromNow()}</span>
          </div>
          <img src={assets.user_icon} alt="" className='w-7 rounded-full'/>
        </div>
      ) : (
        <div className='inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md my-4'>
          {msg.isImage ? (
            <img src={msg.content} alt="" className='w-full max-w-md mt-2'/>
          ) : (
            <div className='text-sm dark:text- reset-tw'>
            <Markdown>{msg.content}</Markdown>
            </div>
          )}
          <span className='text-xs text-gray-400 dark:text-[#868686]'>{moment(msg.timestamp).fromNow()}</span>
        </div>
      )}
    </div>
  )
}

export default Message