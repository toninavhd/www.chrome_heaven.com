'use client';
import React from 'react';

interface DesktopShortcutProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
}

export const DesktopShortcut: React.FC<DesktopShortcutProps> = ({ title, icon, isSelected, onSelect, onDoubleClick }) => {
  return (
    <div
      className={`desktop-icon ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
    >
      {icon}
      <div className="desktop-icon-text">{title}</div>
    </div>
  );
};
