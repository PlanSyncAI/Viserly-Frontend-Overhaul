import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] dark:bg-[#0B1120]">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
