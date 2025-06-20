
import React, { useState, useEffect, useCallback } from 'react';
import AdminHeader from './components/admin/Header';
import Sidebar from './components/admin/Sidebar';
import UserInfoDisplay from './components/admin/UserInfoDisplay';
import LoadingSpinner from './components/admin/LoadingSpinner';
import ErrorDisplay from './components/admin/ErrorDisplay';
import LoginPage from './components/admin/LoginPage'; // Import LoginPage
import { fetchAllUsers, fetchUserSettings } from './services/api';
import type { CardConfig } from './types/admin';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Authentication state
  const [globalDate, setGlobalDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [cardConfigs, setCardConfigs] = useState<CardConfig[] | null>(null);
  
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false); // Start false until authenticated
  const [usersError, setUsersError] = useState<string | null>(null);
  
  const [isLoadingConfigs, setIsLoadingConfigs] = useState<boolean>(false);
  const [configsError, setConfigsError] = useState<string | null>(null);

  const [sheetDataCache, setSheetDataCache] = useState<Record<string, any>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) { // Only load users if authenticated
      const loadUsers = async () => {
        setIsLoadingUsers(true);
        setUsersError(null);
        try {
          const fetchedUsers = await fetchAllUsers();
          setUsers(fetchedUsers);
        } catch (error) {
          console.error("Failed to load users:", error);
          setUsersError(error instanceof Error ? error.message : String(error));
        } finally {
          setIsLoadingUsers(false);
        }
      };
      loadUsers();
    } else {
      // Reset user-related state if not authenticated
      setUsers([]);
      setSelectedUser(null);
      setCardConfigs(null);
      setIsLoadingUsers(false);
      setUsersError(null);
      setSheetDataCache({}); // Clear cache on logout
      setIsSidebarOpen(false); // Close sidebar on logout
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedUser && isAuthenticated) { // Ensure authenticated before loading configs
      const loadConfigs = async () => {
        setIsLoadingConfigs(true);
        setConfigsError(null);
        setCardConfigs(null); 
        try {
          const fetchedConfigs = await fetchUserSettings(selectedUser);
          setCardConfigs(fetchedConfigs);
        } catch (error) {
          console.error(`Failed to load settings for ${selectedUser}:`, error);
          setConfigsError(error instanceof Error ? error.message : String(error));
        } finally {
          setIsLoadingConfigs(false);
        }
      };
      loadConfigs();
    } else {
      setCardConfigs(null); 
    }
  }, [selectedUser, isAuthenticated]);

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    // Any other cleanup for logout can go here
  }, []);

  const handleUserSelect = useCallback((username: string) => {
    setSelectedUser(prevUser => {
      const newUser = prevUser === username ? null : username;
      if (newUser !== null) { 
        if (window.innerWidth < 1024) { 
           setIsSidebarOpen(false);
        }
      }
      return newUser;
    });
  }, []);
  
  const handleDateChange = useCallback((date: string) => {
    setGlobalDate(date);
    setSheetDataCache({}); 
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const renderMainContent = () => {
    if (selectedUser) {
      return (
        <UserInfoDisplay
          username={selectedUser}
          cardConfigs={cardConfigs}
          globalDate={globalDate}
          isLoading={isLoadingConfigs}
          error={configsError}
          sheetDataCache={sheetDataCache}
          setSheetDataCache={setSheetDataCache}
        />
      );
    }
    if (isLoadingUsers) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-10 h-full">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-500">กำลังโหลดรายชื่อผู้ใช้...</p>
        </div>
      );
    }
    if (usersError) {
      return (
        <div className="flex justify-center py-10">
           <ErrorDisplay title="เกิดข้อผิดพลาด" message={`ไม่สามารถโหลดรายชื่อผู้ใช้: ${usersError}`} className="max-w-md"/>
        </div>
      );
    }
    if (users.length === 0 && !isLoadingUsers && !usersError) { // Check for !isLoadingUsers and !usersError to avoid showing this during initial load/error
      return (
        <p className="text-center text-slate-500 py-10">
          ไม่พบรายชื่อผู้ใช้งานในระบบ
        </p>
      );
    }
    return (
      <p className="text-center text-slate-500 py-10">
        {isSidebarOpen ? 'กรุณาเลือกผู้ใช้งานจากแถบด้านข้าง' : 'คลิกปุ่มเมนู (แถบซ้ายบน) เพื่อเลือกผู้ใช้งาน'}
      </p>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 selection:bg-indigo-500 selection:text-white">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        users={users}
        selectedUser={selectedUser}
        onSelectUser={handleUserSelect}
        isLoading={isLoadingUsers}
        error={usersError}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
          currentGlobalDate={globalDate} 
          onGlobalDateChange={handleDateChange}
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8 no-scrollbar">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default App;