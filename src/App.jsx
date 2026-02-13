console.log("App Module Loading...");
import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardContent from './components/DashboardContent';
import CommandCenter from './components/CommandCenter';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import FarmerProfile from './components/FarmerProfile';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Login from './components/Login';
import ProfileSetup from './components/ProfileSetup';
import { dataService } from './services/dataService';
import { LanguageProvider, useTranslation } from './i18n';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

function MainLayout({ onLogout }) {
  const [districtId, setDistrictId] = useState('vellore');
  const [districtsList, setDistrictsList] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [viewMode, setViewMode] = useState('state');
  const { t } = useTranslation();

  useEffect(() => {
    dataService.getDistrictsList().then(list => {
      setDistrictsList(list);
      setLoadingList(false);
    }).catch(err => console.error("Failed to load districts", err));
  }, []);

  const handleDistrictSelect = (id) => {
    setDistrictId(id);
    setViewMode('district');
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'state':
        return <CommandCenter onDistrictSelect={handleDistrictSelect} />;
      case 'analytics':
        return (
          <main className="main-content" style={{ padding: '0' }}>
            <AdvancedAnalytics />
          </main>
        );
      case 'reports':
        return (
          <main className="main-content" style={{ padding: '0' }}>
            <Reports districtId={districtId} />
          </main>
        );
      case 'profile':
        return (
          <main className="main-content" style={{ padding: '0' }}>
            <FarmerProfile farmerId="TN-FARM-10045" onLogout={onLogout} />
          </main>
        );
      case 'settings':
        return (
          <main className="main-content" style={{ padding: '0' }}>
            <Settings onLogout={onLogout} />
          </main>
        );
      case 'district':
      default:
        return <DashboardContent districtId={districtId} />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar districtId={districtId} onViewChange={setViewMode} viewMode={viewMode} onLogout={onLogout} />

      <TopBar
        selectedDistrict={districtId}
        onDistrictChange={handleDistrictSelect}
        districts={districtsList}
        loading={loadingList}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      {viewMode === 'state' ? (
        <main className="main-content" style={{ padding: 0 }}>
          <CommandCenter onDistrictSelect={handleDistrictSelect} />
        </main>
      ) : (
        renderContent()
      )}

      {/* Bharat-VISTAAR Badge */}
      <div style={{
        position: 'fixed', bottom: 10, right: 20, zIndex: 100,
        fontSize: '0.7rem', color: 'var(--color-primary-emerald)',
        background: 'rgba(15, 23, 42, 0.95)',
        padding: '4px 12px', borderRadius: '20px',
        border: '1px solid var(--color-primary-emerald)',
        boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)',
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        fontFamily: 'Share Tech Mono, monospace'
      }}>
        <span style={{ fontSize: '1rem' }}>🇮🇳</span> {t('powered_by')}
      </div>
    </div>
  );
}

// Wrapper to consume context inside App
function AppContent() {
  const { isAuthenticated, isProfileComplete, login, logout, completeProfile, user, loading, isDemoMode } = useAuth();

  // Apply Demo Glow Effect Global Style
  useEffect(() => {
    if (isDemoMode) {
      document.body.style.boxShadow = 'inset 0 0 20px rgba(16, 185, 129, 0.4)';
      document.body.style.border = '2px solid rgba(16, 185, 129, 0.3)';
    } else {
      document.body.style.boxShadow = 'none';
      document.body.style.border = 'none';
    }
  }, [isDemoMode]);

  // Loading State
  if (loading) {
    return (
      <div style={{ height: '100vh', width: '100vw', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ color: '#10B981', fontSize: '2rem', marginBottom: '1rem' }} className="cyber-font">Agri-Neural Twin</div>
        <div style={{ color: '#94a3b8', fontFamily: 'Share Tech Mono' }}>INITIALIZING SYSTEM...</div>
      </div>
    );
  }

  const handleLogin = (role, isDemo, prefillData = null) => {
    login(role, isDemo, prefillData);
    toast.success(isDemo ? 'DEMO ENVIRONMENT EXTANT' : 'ACCESS GRANTED: WELCOME TO COMMAND CENTER', {
      style: { background: isDemo ? '#F59E0B' : '#10B981', color: '#fff', fontFamily: 'Share Tech Mono' },
      icon: isDemo ? '🧪' : '🔓'
    });
  };

  const handleLogout = () => {
    logout();
    toast.success('SESSION TERMINATED SECURELY', {
      style: { background: '#EF4444', color: '#fff', fontFamily: 'Share Tech Mono' },
      icon: '🔒'
    });
  };

  const handleProfileComplete = (data) => {
    completeProfile(data);
    toast.success("PROFILE SYNCED WITH STATE REGISTRY", {
      style: { background: '#10B981', color: '#fff', fontFamily: 'Share Tech Mono' },
      icon: '✅'
    });
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  if (!isProfileComplete) return <ProfileSetup userType={user?.role} onComplete={handleProfileComplete} prefillData={user?.prefillData} />;

  return <MainLayout onLogout={handleLogout} />;
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
