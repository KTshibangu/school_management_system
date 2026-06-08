import React from 'react'

const LoginLeftSide = () => {
  return (
    <div className='hidden md:flex w-1/2 bg-slate-700 relative overflow-hidden border-r border-slate-200'>
      <div className='absolute -top-32 -left-32 w-72 h-72 bg-indigo-100/20 rounded-full blur-3xl'></div>
      
      <div className='relative z-10 flex flex-col items-start justify-center p-12 lg:p-20 w-full h-full'>
        <h1 className='text-4xl lg:text-5xl font-medium text-white mb-6 leading-tight tracking-tight'>
            School <br /> Management System
        </h1>
        <p className='text-white text-lg max-w-md leading-relaxed'>
            Streamline your school operations, organize classes, teachers, tasks and school events
        </p>
      </div>
    </div>
  )
}

export default LoginLeftSide
