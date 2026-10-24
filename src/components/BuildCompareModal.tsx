import React from 'react';
import { SystemBuild } from '../types/hardware';
import { ThemeId } from '../types/theme';
import { CompareView } from './CompareView';

interface BuildCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseBuild: SystemBuild;
  currentTheme?: ThemeId;
  onNavigateToBuilder?: (step?: string) => void;
  onUpdateBuild?: (newBuild: SystemBuild) => void;
  favoriteGameIds?: string[];
  onToggleFavorite?: (gameId: string) => void;
}

export const BuildCompareModal: React.FC<BuildCompareModalProps> = ({
  isOpen,
  onClose,
  baseBuild,
  currentTheme = 'cyberpunk',
  onNavigateToBuilder,
  onUpdateBuild,
  favoriteGameIds,
  onToggleFavorite,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-3 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-7xl my-auto max-h-[96vh] overflow-y-auto p-0 shadow-2xl relative scrollbar-thin">
        <CompareView
          baseBuild={baseBuild}
          onClose={onClose}
          currentTheme={currentTheme}
          onNavigateToBuilder={(step) => {
            onClose();
            if (onNavigateToBuilder) onNavigateToBuilder(step);
          }}
          onUpdateBuild={onUpdateBuild}
          favoriteGameIds={favoriteGameIds}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
    </div>
  );
};
