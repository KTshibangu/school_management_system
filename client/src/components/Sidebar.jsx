import React, { useEffect, useState } from 'react';
import { data, Link, useLocation } from 'react-router-dom';
import { dummyProfileData } from '../assets/myassets';
import {
  Users,
  BookOpen,
  BuildingIcon,
  Calendar,
  CheckSquare,
  ChevronRightIcon,
  ClipboardCheck,
  LayoutGridIcon,
  LogOutIcon,
  MenuIcon,
  Notebook,
  School,
  Settings,
  UserIcon,
  XIcon,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Sidebar = () => {
  const { pathname } = useLocation();
  const [userName, setUserName] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, loading, logout } = useAuth()


  useEffect(() => {
    api.get("/profile").then(({ data }) => {
      const profile = data.data
      if (profile?.firstName) {
        setUserName(`${profile?.firstName} ${profile?.lastName || ""}`.trim())
      }
    })
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const role = user?.role;

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutGridIcon },
    role === 'ADMIN'
      ? { name: 'Teachers', href: '/teachers', icon: UserIcon }
      : { name: 'Assessments', href: '/assessments', icon: CheckSquare },
    role === 'ADMIN'
      ? { name: 'Classes', href: '/classes', icon: School }
      : { name: 'Scores', href: '/scores', icon: ClipboardCheck },
    { name: 'Students', href: '/students', icon: Users },
    { name: 'Events', href: '/events', icon: Calendar },
    role === 'ADMIN'
      ? { name: 'Subjects', href: '/subjects', icon: BookOpen }
      : { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout()
    window.location.href = '/login';
  };

  const sidebarContent = (
    <>
      {/* Brand Header */}
      <div className="px-5 pt-6 pb-5 border-b border-white/6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserIcon className="text-white size-7" />
            <div>
              <p className="font-semibold text-[13px] text-white tracking-wide">
                School Ted
              </p>
              <p className="text-[11px] text-slate-300 font-medium">
                Management System
              </p>
            </div>
          </div>
          {/* Close button on mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <XIcon size={20} />
          </button>
        </div>
      </div>

      {/* User profile card */}
      {userName && (
        <div className="mx-3 mt-4 mb-1 p-3 rounded-lg bg-white/3 border border-white/4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center ring-1 ring-white/10 shrink-0">
              <span className="text-slate-400 text-xs font-semibold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-slate-200 truncate">
                {userName}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {role === 'ADMIN' ? 'Administrator' : 'Teacher'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section label */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300">
          Navigation
        </p>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {
          loading ? (
            <div className='px-3 py-3 flex items-center gap-2 text-slate-500'>
              <Loader2 className='animate-spin w-4 h-4' />
              <span className='text-sm'>Loading...</span>
            </div>
          ) : (
            navItems.map(item => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-md
                            text-[13px] font-medium transition-all duration-150 relative ${isActive
                      ? 'bg-indigo-500/12 text-indigo-300'
                      : 'text-slate-300 hover:text-white hover:bg-white/4'
                    }`}
                >
                  {isActive && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full
                                bg-indigo-500"
                    />
                  )}
                  <item.icon
                    className={`w-4 h-4 shrink-0 ${isActive
                        ? 'text-indigo-300'
                        : 'text-slate-400 group-hover:text-slate-300'
                      }`}
                  />
                  <span className="flex-1">{item.name}</span>
                  {isActive && (
                    <ChevronRightIcon className="w-3.5 h-3.5 text-indigo-500/50" />
                  )}
                </Link>
              );
            })
          )
        }
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-white/6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-[13px] font-medium text-slate-400
                hover:text-rose-400 hover:bg-rose-500/8 transition-all duration-150 cursor-pointer"
        >
          <LogOutIcon className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-500 text-white 
            rounded-lg shadow-lg border border-white/10"
        onClick={() => setMobileOpen(true)}
      >
        <MenuIcon size={20} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar - Desktop */}
      <aside
        className="hidden lg:flex flex-col h-full w-65 bg-linear-to-b from-slate-700 via-slate-700 to-slate-800
            text-white shrink-0 border-r border-white/4"
      >
        {sidebarContent}
      </aside>

      {/* Sidebar - mobile */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-linear-to-b from-slate-700 via-slate-700 to bg-slate-800
                text-white z-50 flex flex-col transform transition-transform duration-300
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
