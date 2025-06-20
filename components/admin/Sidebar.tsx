
import React from 'react';
import UserSelector from './UserSelector';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  users: string[];
  selectedUser: string | null;
  onSelectUser: (username: string) => void;
  isLoading: boolean;
  error: string | null;
  onLogout: () => void; // Added onLogout prop
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  users, 
  selectedUser, 
  onSelectUser, 
  isLoading, 
  error,
  onLogout // Destructure onLogout
}) => {
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden" 
          onClick={onClose}
          aria-hidden="true"
        ></div>
      )}

      <aside 
        className={`fixed top-0 left-0 z-40 h-screen bg-slate-800 text-white shadow-xl
                    w-64 sm:w-72 md:w-80 lg:w-64  
                    transition-transform duration-300 ease-in-out 
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 lg:sticky lg:shadow-none lg:bg-slate-800 
                    ${isOpen ? 'lg:w-64' : 'lg:w-0 lg:invisible lg:opacity-0 lg:p-0'}`} // Control width and visibility on large screens when "closed" by toggle
        aria-label="Sidebar"
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white">เมนูผู้ใช้งาน</h2>
            <button 
              onClick={onClose} 
              className="p-1 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 lg:hidden" // Hide close button on large screens when sidebar is part of layout
              aria-label="ปิดเมนู"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto no-scrollbar">
            <UserSelector 
              users={users}
              selectedUser={selectedUser}
              onSelectUser={onSelectUser}
              isLoading={isLoading}
              error={error}
            />
          </div>

          <div className="p-4 border-t border-slate-700 space-y-3">
             <button
              onClick={onLogout}
              className="w-full flex items-center justify-start space-x-2.5 px-3 py-2.5 text-sm rounded-md transition-all duration-150 ease-in-out bg-slate-700 text-slate-100 hover:bg-rose-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-rose-500"
              aria-label="ออกจากระบบ"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              <span>ออกจากระบบ</span>
            </button>
            <p className="text-xs text-slate-400 text-center pt-2">Admin Checker v1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;