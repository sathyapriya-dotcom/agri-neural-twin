import React from 'react';
import { useTranslation } from '../i18n';

export default function Sidebar({ districtId, viewMode, onViewChange }) {
  const { t } = useTranslation();

  const menuItems = [
    { key: 'dashboard', view: 'district' },
    { key: 'advanced_analytics', view: 'analytics' },
    { key: 'reports', view: 'reports' },
    { key: 'settings', view: 'settings' },
    { key: 'farmer_profile', view: 'profile' },
  ];

  const getActive = (view) => {
    // Keep dashboard active for both state command (default) and district view
    if (view === 'district' && (viewMode === 'district' || viewMode === 'state')) return true;
    return viewMode === view;
  };

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <span className="cyber-font" style={{ fontSize: '1.2rem', color: 'var(--color-primary-emerald)' }}>🌱 {t('app_title')}</span>
      </div>
      <nav className="nav-links">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`nav-item ${getActive(item.view) ? 'active' : ''}`}
            onClick={() => onViewChange && onViewChange(item.view)}
            style={{ cursor: 'pointer' }}
          >
            {t(item.key)}
          </div>
        ))}

        {/* Logout */}
        <div className="nav-item" style={{ marginTop: 'auto', borderTop: '1px solid var(--color-border)', color: '#EF4444' }}>
          {t('logout')}
        </div>
      </nav>

      {districtId && (
        <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'Share Tech Mono' }}>
          {t('select_district')}: {districtId.toUpperCase()}<br />
          {t('status_online')}
        </div>
      )}
    </aside>
  );
}
