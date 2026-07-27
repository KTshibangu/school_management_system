import React from 'react';
import Badge from '../assets/badge.png'

const LoginLeftSide = () => {
  return (
    <div className="hidden md:flex w-1/2 bg-white overflow-hidden border-r border-slate-200">
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-indigo-100/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col items-center justify-center p-12 lg:p-20 w-full h-full">
        <h1 className="text-4xl lg:text-5xl font-medium text-slate-900 mb-6 leading-tight tracking-tight">
          School Management System
        </h1>
        <h2 className="text-4xl lg:text-4xl font-medium text-slate-900 mb-6 leading-tight tracking-tight">
          Example High School
        </h2>
        <img src={Badge} className='w-100' />
        <p className="text-slate-900 text-lg max-w-md leading-relaxed">
          For testing admin portal:
        </p>
        <p className="text-slate-900 text-sm max-w-md leading-relaxed">
          admin@schoolted.com / admin123
        </p>
        <p className="text-slate-900 text-lg max-w-md leading-relaxed">
          For testing teacher portal:
        </p>
        <p className="text-slate-900 text-sm max-w-md leading-relaxed">
          ktshibangu@schoolted.com / 12345678
        </p>
      </div>
    </div>
  );
};

export default LoginLeftSide;
