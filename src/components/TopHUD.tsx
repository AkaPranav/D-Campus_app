'use client';

import React from 'react';
import { RefreshCw, BarChart3, Calendar, FileText, Settings } from 'lucide-react';
import { StudentProfile } from '@/lib/erpClient';
import { ActiveTab } from './BottomNav';

interface TopHUDProps {
  student: StudentProfile | null;
  onRefresh: () => void;
  isSyncing: boolean;
  lastSync: string | null;
  activeTab?: ActiveTab;
  onChangeTab?: (tab: ActiveTab) => void;
  assignmentCount?: number;
}

export default function TopHUD({
  student,
  onRefresh,
  isSyncing,
  lastSync,
  activeTab = 'attendance',
  onChangeTab,
  assignmentCount = 0,
}: TopHUDProps) {
  const navTabs = [
    { id: 'attendance' as ActiveTab, label: 'ATTENDANCE', icon: BarChart3 },
    { id: 'timetable' as ActiveTab, label: 'TIMETABLE', icon: Calendar },
    {
      id: 'assignments' as ActiveTab,
      label: 'NOTES & DUE',
      icon: FileText,
      badge: assignmentCount > 0 ? String(assignmentCount) : undefined,
    },
    { id: 'settings' as ActiveTab, label: 'SETTINGS', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#13171f] border-b-2 border-[#000000] shadow-[0_2px_0px_#000000]">
      {/* Retro Titlebar Header */}
      <div className="bg-[#161c28] px-3.5 md:px-6 py-1.5 border-b border-[#2d3545] flex items-center justify-between select-none">
        {/* Retro Dots & Brand */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="retro-dot close" />
            <span className="retro-dot min" />
            <span className="retro-dot max" />
          </div>
          <span className="text-[#2d3545] text-xs font-mono">|</span>
          <div className="flex items-center gap-2">
            <span className="bg-[#000000] text-[#fbbf24] px-1.5 py-0.5 rounded border border-[#2d3545] font-mono text-[10px] font-black tracking-wider">
              D-CAMPUS // WORKSTATION
            </span>
            <span className="hidden sm:inline font-mono text-[10px] text-[#64748b]">
              ACADEMIC SUITE v1.4.0
            </span>
          </div>
        </div>

        {/* System Pulse State & Refresh */}
        <div className="flex items-center gap-2">
          <span className="retro-badge safe text-[9px]">
            ● ONLINE
          </span>
          <button
            onClick={onRefresh}
            disabled={isSyncing}
            className="btn-retro px-2 py-0.5 text-[#fbbf24] hover:text-[#ffffff] flex items-center justify-center gap-1 text-[10px] disabled:opacity-50"
            title="Force Synchronize with University Portal"
          >
            <RefreshCw size={11} className={isSyncing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline font-mono">SYNC</span>
          </button>
        </div>
      </div>

      {/* Sub-bar with Student Identity, Desktop Navigation & Session Info */}
      <div className="bg-[#0b0d11] px-3.5 md:px-6 py-2 flex items-center justify-between font-mono text-[11px] border-b border-[#000000] gap-4">
        {/* Student Info Pill */}
        <div className="flex items-center gap-2 truncate shrink-0">
          <span className="font-black text-[#10b981] bg-[#10b981]/15 px-1.5 py-0.2 rounded border border-[#10b981]/40">
            {student?.studentId || 'CU240250963'}
          </span>
          <span className="text-[#94a3b8] truncate text-[10px] hidden sm:inline">
            {student?.studentName || 'PRANAV PANDEY'} • {student?.branch || 'CSE'} (SEM {student?.yearSem || '5'})
          </span>
        </div>

        {/* Desktop / Tablet Horizontal Navigation Tabs */}
        {onChangeTab && (
          <nav className="hidden md:flex items-center gap-1.5 justify-center flex-1 max-w-xl">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onChangeTab(tab.id)}
                  className={`px-3 py-1 rounded font-mono text-xs font-black flex items-center gap-1.5 transition-all border ${
                    isActive
                      ? 'bg-[#fbbf24] text-[#000000] border-[#000000] shadow-[2px_2px_0px_#000000]'
                      : 'bg-[#080a0d] text-[#94a3b8] hover:text-[#f8fafc] border-[#2d3545] hover:bg-[#161c28]'
                  }`}
                >
                  <Icon size={13} className={isActive ? 'stroke-[2.5]' : 'stroke-[2]'} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-black border leading-none ${
                        isActive
                          ? 'bg-[#000000] text-[#fbbf24] border-[#000000]'
                          : 'bg-[#1b202b] text-[#fbbf24] border-[#2d3545]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Sync Status Timestamp */}
        <div className="text-[9px] text-[#64748b] shrink-0 font-bold">
          {lastSync ? `SYNC: ${new Date(lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'SYNC: LIVE'}
        </div>
      </div>
    </header>
  );
}

