import { useState } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import { PatientInformationForm } from '../../features/Registration/pages/PatientInformationForm';

export function RegistrationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#f0f5f3] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />

      <div className="flex flex-1 w-full min-h-0">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-20 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeSidebar}
            />
            <div className="absolute top-14 sm:top-16 left-0 bottom-0">
              <Sidebar />
            </div>
          </div>
        )}

        <main className="flex-1 p-3 sm:p-4 md:p-4 max-w-[1400px] min-h-0 overflow-y-auto">
          <PatientInformationForm />
        </main>
      </div>
    </div>
  );
}

export default RegistrationPage;
