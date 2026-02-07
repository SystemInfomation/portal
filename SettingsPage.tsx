import React, { useState } from 'react';
import './all.css';
import { useUser } from './lib/userContext';

const themes = [
  { name: 'Light', value: 'light' },
  { name: 'Dark', value: 'dark' },
  { name: 'Celestial', value: 'celestrium' }
];

const animations = [
  { name: 'Enabled', value: true },
  { name: 'Disabled', value: false }
];

export default function SettingsPage() {
  const { userName, setUserName, clearUserName, isLoaded } = useUser();
  const [theme, setTheme] = useState(localStorage.getItem('celestrium-theme') || 'light');
  const [animation, setAnimation] = useState(localStorage.getItem('forsyth-animations') !== 'false');
  const [nameInput, setNameInput] = useState(isLoaded ? (userName || '') : '');

  const handleThemeChange = (value: string) => {
    setTheme(value);
    localStorage.setItem('celestrium-theme', value);
    document.body.className = value;
  };

  const handleAnimationChange = (value: boolean) => {
    setAnimation(value);
    localStorage.setItem('forsyth-animations', value ? 'true' : 'false');
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserName(nameInput);
  };

  const handleNameClear = () => {
    setNameInput('');
    clearUserName();
  };

  return (
    <div className="settings-page">
      <div className="settings-header glass-card">
        <h1>Settings</h1>
        <p>{isLoaded && userName ? `Personalize your experience, ${userName}.` : 'Personalize your experience. Instantly modern, responsive, and epic.'}</p>
      </div>
      <div className="settings-section glass-card">
        <h2>Personalization</h2>
        <form onSubmit={handleNameSubmit} className="name-input-section">
          <div className="input-group">
            <label htmlFor="userName">Your Name (Optional)</label>
            <div className="input-with-buttons">
              <input
                id="userName"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your name"
                maxLength={50}
              />
              {nameInput.trim() && (
                <button
                  type="button"
                  onClick={handleNameClear}
                  className="clear-btn"
                  title="Clear name"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <div className="button-group">
            <button
              type="submit"
              className="save-btn"
              disabled={!nameInput.trim() || nameInput.trim() === userName}
            >
              Save Name
            </button>
          </div>
        </form>
        {isLoaded && userName && (
          <div className="current-name">
            <span>Current name: <strong>{userName}</strong></span>
          </div>
        )}
      </div>
      <div className="settings-section glass-card">
        <h2>Theme</h2>
        <div className="settings-options">
          {themes.map(t => (
            <button
              key={t.value}
              className={`settings-btn${theme === t.value ? ' active' : ''}`}
              aria-pressed={theme === t.value}
              onClick={() => handleThemeChange(t.value)}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>
      <div className="settings-section glass-card">
        <h2>Animations</h2>
        <div className="settings-options">
          {animations.map(a => (
            <button
              key={a.value.toString()}
              className={`settings-btn${animation === a.value ? ' active' : ''}`}
              aria-pressed={animation === a.value}
              onClick={() => handleAnimationChange(a.value)}
            >
              {a.name}
            </button>
          ))}
        </div>
      </div>
      <div className="settings-footer">
        <p>Made with <span style={{color:'#9333ea'}}>♥</span> for Forsyth Portal</p>
      </div>
    </div>
  );
}
