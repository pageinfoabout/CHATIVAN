import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { dummyPlans } from '../assets/assets'
import Loading from './Loading'

const Credits = () => {


  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPlans = async () => {
    setPlans(dummyPlans)
    setLoading(false)
  }

  useEffect(() => {
    fetchPlans()
  }, []  )

  if(loading) return <Loading />


  return (
    <div className='max-w-7xl h-screen overflow-y-scroll mx-auto px-6 pt-12 xl:px-12 2xl:px-20'>
      <h2 className='text-3xl font-semibold text-center mb-10 xl:mt-30
      texr-gray-800 dark:text-white'>Creadit Plans</h2>
        <div className='flex flex-wrap justify-center gap-8 overflow-x-auto '>
          {plans.map((plan) => (
            <div key={plan._id} className={`border border-gray-200 dark:border-purple-700 rounded-1g shadow hover:shadow-1g
              transition-shadow p-6 min-w-[300px] flex flex-col ${plan._id === "pro" ? "bg-gradient-to-r from-[#57317C]/10 to-[#80609F]/10" : "bg-white dark:bg-[#242124]/30"}`}>
                <div clasName='flex-1'>
                  <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>{plan.name}</h3>

                  <p className='text-2xl font-bold text-purple-500 dark:text-[#BFA6E6] mb-2'>${plan.price}
                     <span className='text-sm text-gray-500 dark:text-[#868686]'>{' '}/ {plan.credits} credits</span>
                   </p>
                  <ul className='list-disc list-inside text-sm text-gray-500 dark:text-[#868686]'>
                    {plan.features.map ((feature, index) => (
                      <li key={index}>{feature} </li>
                    ))}
                  </ul>
                </div>
                <button className='mt-6 md:mt-10 bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white font-semibold py-2 rounded transition-colors cursor-pointer'>Buy Now</button>
            </div>
          ))} 
        </div>
    </div>
  )
}

export default Credits
