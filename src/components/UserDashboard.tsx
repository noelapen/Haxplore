import { useState } from 'react';
import { BinFinder } from './user/BinFinder';
import { WasteDetection } from './user/WasteDetection';
import { UserProfile } from './user/UserProfile';
import { Map, ScanLine, User as UserIcon, LogOut, Home } from 'lucide-react';

interface UserDashboardProps {
  user: any;
  onLogout: () => void;
}

type ActiveView = 'home' | 'finder' | 'scan' | 'profile';

export function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [userData, setUserData] = useState(user);

  const handleRecyclingComplete = (item: any) => {
    // Update user data with new points and stats
    setUserData((prev: any) => ({
      ...prev,
      points: prev.points + item.points,
      totalRecycled: prev.totalRecycled + 1,
      co2Saved: prev.co2Saved + item.co2Saved,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {userData.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">{userData.name}</div>
              <div className="text-sm text-emerald-600">{userData.points} Points</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {activeView === 'home' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {userData.name}! 👋
              </h1>
              <p className="text-gray-600">
                Let's make a positive impact on the environment today
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-emerald-600 mb-1">
                  {userData.points}
                </div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {userData.totalRecycled}
                </div>
                <div className="text-sm text-gray-600">Items Recycled</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {userData.co2Saved.toFixed(1)} kg
                </div>
                <div className="text-sm text-gray-600">CO₂ Saved</div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => setActiveView('finder')}
                className="group bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-8 text-white text-left hover:shadow-xl transition-all hover:scale-105"
              >
                <Map className="w-12 h-12 mb-4 opacity-90" />
                <h2 className="text-2xl font-bold mb-2">Find E-Waste Bin</h2>
                <p className="text-emerald-50 mb-4">
                  Locate the nearest bin for your e-waste
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-semibold">
                  Start Finding
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>

              <button
                onClick={() => setActiveView('scan')}
                className="group bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white text-left hover:shadow-xl transition-all hover:scale-105"
              >
                <ScanLine className="w-12 h-12 mb-4 opacity-90" />
                <h2 className="text-2xl font-bold mb-2">Scan & Dispose</h2>
                <p className="text-blue-50 mb-4">
                  Use AI detection to identify and recycle items
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-semibold">
                  Start Scanning
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            </div>

            {/* Environmental Impact */}
            <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Your Environmental Impact 🌍
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {(userData.totalRecycled * 0.5).toFixed(1)} kg
                  </div>
                  <div className="text-sm text-gray-600">E-waste diverted from landfills</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {(userData.totalRecycled * 15).toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">Trees worth of oxygen saved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {(userData.totalRecycled * 2).toFixed(0)} L
                  </div>
                  <div className="text-sm text-gray-600">Water saved</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'finder' && <BinFinder />}
        {activeView === 'scan' && (
          <WasteDetection user={userData} onRecyclingComplete={handleRecyclingComplete} />
        )}
        {activeView === 'profile' && <UserProfile user={userData} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around">
            <button
              onClick={() => setActiveView('home')}
              className={`flex flex-col items-center gap-1 py-3 px-6 transition-colors ${
                activeView === 'home'
                  ? 'text-emerald-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </button>
            <button
              onClick={() => setActiveView('finder')}
              className={`flex flex-col items-center gap-1 py-3 px-6 transition-colors ${
                activeView === 'finder'
                  ? 'text-emerald-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Map className="w-6 h-6" />
              <span className="text-xs font-medium">Find Bin</span>
            </button>
            <button
              onClick={() => setActiveView('scan')}
              className={`flex flex-col items-center gap-1 py-3 px-6 transition-colors ${
                activeView === 'scan'
                  ? 'text-emerald-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <ScanLine className="w-6 h-6" />
              <span className="text-xs font-medium">Scan</span>
            </button>
            <button
              onClick={() => setActiveView('profile')}
              className={`flex flex-col items-center gap-1 py-3 px-6 transition-colors ${
                activeView === 'profile'
                  ? 'text-emerald-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <UserIcon className="w-6 h-6" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
