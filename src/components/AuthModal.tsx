import React from 'react';
import { AuthView, AuthMode } from './AuthView';
import { ThemeId } from '../types/theme';
import { GamerUser } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  currentTheme?: ThemeId;
  onSuccess?: (user: GamerUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  currentTheme = 'cyberpunk',
  onSuccess,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto">
        <AuthView
          initialMode={initialMode}
          currentTheme={currentTheme}
          onSuccess={onSuccess}
          onClose={onClose}
          isModal={true}
        />
      </div>
    </div>
  );
};
