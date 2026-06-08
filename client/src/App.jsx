import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginLanding from './pages/LoginLanding'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import Teachers from './pages/Teachers'
import Classes from './pages/Classes'
import Subjects from './pages/Subjects'
import Tasks from './pages/Tasks'
import Scores from './pages/Scores'
import Events from './pages/Events'
import Settings from './pages/Settings'
import LoginForm from './components/LoginForm'


const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/login' element={<LoginLanding/>}/>
        <Route path='/login/admin' element={<LoginForm role="admin" title="Admin Protal" subtitle="Sign in to manage the school"/>}/>
        <Route path='/login/teacher' element={<LoginForm role="teacher" title="Teacher Protal" subtitle="Sign in to access your account"/>}/>


        <Route element={<Layout />}>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/teachers' element={<Teachers/>}/>
          <Route path='/classes' element={<Classes/>}/>
          <Route path='/subjects' element={<Subjects/>}/>
          <Route path='/tasks' element={<Tasks/>}/>
          <Route path='/scores' element={<Scores/>}/>
          <Route path='/events' element={<Events/>}/>
          <Route path='/settings' element={<Settings/>}/>
        </Route>
        <Route path='*' element={<Navigate to='/dashboard' replace/>}/>
      </Routes>
    </>
  )
}

export default App
