import React, { useEffect, useState } from 'react'
import { dummyAdminDashboardData, dummyTeacherDashboardData } from '../assets/myassets'
import Loading from '../components/Loading'
import TeacherDashboard from '../components/TeacherDashboard'
import AdminDashboard from '../components/AdminDashboard'

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setData(dummyTeacherDashboardData)
    setTimeout(() => {
      setLoading(false)
    }, 1000);
  }, [])

  if(loading) return <Loading />

  if(!data) return <p className='text-center text-slate-500 py-12'>Failed to load dashboard</p>

  if(data.role === "ADMIN") {
    return <AdminDashboard data={data}/>
  } else {
    return <TeacherDashboard data={data}/>
  }
}

export default Dashboard
