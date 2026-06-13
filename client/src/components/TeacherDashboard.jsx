import { ArrowRightIcon, Calendar, ClipboardCheck, School, Users } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';

const TeacherDashboard = ({ data }) => {
    const t = data.teacher;

    const cards = [
        {
            icon: School,
            value: data.classesAssigned,
            title: "My Classes",
            subtitle: "This Year",
        },
        {
            icon: Users,
            value: data.totalStudentsTaught,
            title: "My Students",
            subtitle: "This Year",
        },
        {
            icon: ClipboardCheck,
            value: data.pendingGrading,
            title: "Pending Grade",
            subtitle: "This semester",
        },
        {
            icon: Calendar,
            value: data.announcementsPosted,
            title: "Events",
            subtitle: "This semester",
        }
    ]
    return (
        <div className='animate-fade-in'>
            <div className='page-header'>
                <h1 className='page-title'>Welcome, {t?.firstName}!</h1>
                <p className='page-subtitle'>
                    {t?.employeeCode} - {t?.subject}
                </p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8'>
                {cards.map((card, index) => (
                    <div key={index} className='card card-hover p-5 sm:p-6 relative overflow-hidden group flex items-center justify-between'>
                        <div>
                            <div className='absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-500/70
                            group-hover:bg-indigo-500/70'/>
                            <p className='text-sm font-medium text-slate-700'>{card.title}</p>
                            <p className='text-2xl font-bold text-slate-900 mt-1'>{card.value}</p>
                        </div>
                        <card.icon className='size-10 p-2.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-indigo-50
                        group-hover:text-indigo-600 transition-colors duration-200'/>
                    </div>
                ))}
            </div>

            <div className='flex flex-col sm:flex-row gap-3'>
                <Link to="/tasks" className='btn-primary text-center inline-flex items-center justify-center gap-2'>
                    Create A Task <ArrowRightIcon className='w-4 h-4' />
                </Link>

                <Link to="/scores" className='btn-secondary text-center flex justify-center items-center gap-2'>
                    Mark Pendinng Tasks <ArrowRightIcon className='w-4 h-4' />
                </Link>
            </div>
        </div>
    )
}

export default TeacherDashboard
