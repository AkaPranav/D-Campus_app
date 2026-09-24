'use client';

import React, { useState } from 'react';
import { Download, Upload, Search, Lock, Calendar, BookOpen, ChevronDown } from 'lucide-react';
import { AssignmentItem } from '@/lib/erpClient';
import SubmissionSafetyModal from './SubmissionSafetyModal';

interface AssignmentsViewProps {
  assignments: AssignmentItem[];
  sessionCookies: string;
}

export default function AssignmentsView({ assignments, sessionCookies }: AssignmentsViewProps) {
  const [activeCategory, setActiveCategory] = useState<'ASSIGNMENT' | 'STUDY_MATERIAL'>('ASSIGNMENT');
  const [assignmentStatusFilter, setAssignmentStatusFilter] = useState<'ACTIVE' | 'ALL' | 'CLOSED'>('ACTIVE');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [submittingAssignment, setSubmittingAssignment] = useState<AssignmentItem | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const activeAssignmentsCount = assignments.filter(
    (a) => a.category === 'ASSIGNMENT' && !a.isOverdue
  ).length;
  const closedAssignmentsCount = assignments.filter(
    (a) => a.category === 'ASSIGNMENT' && a.isOverdue
  ).length;
  const allAssignmentsCount = assignments.filter(
    (a) => a.category === 'ASSIGNMENT'
  ).length;
  const lectureNotesCount = assignments.filter(
    (a) => a.category === 'STUDY_MATERIAL'
  ).length;

  // Filter items by category & assignment status filter (status filter applies specially to assignments)
  const categoryItems = assignments.filter((item) => {
    if (item.category !== activeCategory) return false;
    if (activeCategory === 'ASSIGNMENT') {
      if (assignmentStatusFilter === 'ACTIVE') return !item.isOverdue;
      if (assignmentStatusFilter === 'CLOSED') return item.isOverdue;
    }
    return true;
  });

  // Extract unique subjects for chips
  const subjectList = Array.from(new Set(categoryItems.map((item) => item.subjectName))).filter(Boolean);

  // Filter by subject & search term
  const filteredItems = categoryItems.filter((item) => {
    const matchesSubject = selectedSubject === 'ALL' || item.subjectName === selectedSubject;
    const matchesSearch =
      searchTerm.trim() === '' ||
      item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subjectCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  // Sort assignments: Active items due soonest first
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (activeCategory === 'ASSIGNMENT') {
      if (a.isOverdue !== b.isOverdue) {
        return a.isOverdue ? 1 : -1;
      }
      return (a.dueDateTimestamp || 0) - (b.dueDateTimestamp || 0);
    }
    return (b.dueDateTimestamp || 0) - (a.dueDateTimestamp || 0);
  });

  const handleDownload = async (item: AssignmentItem) => {
    setDownloadingId(item.detailId);
    try {
      const url = `/api/download?detailId=${encodeURIComponent(item.detailId)}&assignId=${encodeURIComponent(
        item.assignmentId || ''
      )}&cookies=${encodeURIComponent(sessionCookies)}`;
      
      const res = await fetch(url);
      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.error || 'Download failed on university portal');
      }

      const blob = await res.blob();
      const contentDisposition = res.headers.get('content-disposition');
      let filename = `${item.subjectCode || 'COER'}_${item.detailId}.pdf`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) filename = match[1];
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (e: unknown) {
      console.error('Download error:', e);
      const msg = e instanceof Error ? e.message : 'Unable to download file. Please check connection.';
      alert(msg);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-4 py-2 pb-24 md:pb-8 w-full">
      {/* Top Controls: Subtab Switcher & Search/Filter (consolidated row on desktop/tablet) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
        {/* Subtab Segmented Switcher */}
        <div className="retro-card p-1.5 flex gap-1.5 md:w-80 shrink-0">
          <button
            onClick={() => {
              setActiveCategory('ASSIGNMENT');
              setSelectedSubject('ALL');
            }}
            className={`flex-1 py-2 rounded-sm font-mono text-xs font-black flex items-center justify-center gap-1.5 transition-all border ${
              activeCategory === 'ASSIGNMENT'
                ? 'bg-[#fbbf24] text-[#000000] border-[#000000] shadow-[2px_2px_0px_#000000]'
                : 'bg-[#080a0d] text-[#94a3b8] border-[#2d3545] hover:text-[#f8fafc]'
            }`}
          >
            <span>⚡ ACTIVE DUE</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-black border ${
                activeCategory === 'ASSIGNMENT'
                  ? 'bg-[#000000] text-[#fbbf24] border-[#000000]'
                  : 'bg-[#1b202b] text-[#94a3b8] border-[#2d3545]'
              }`}
            >
              {activeAssignmentsCount}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('STUDY_MATERIAL');
              setSelectedSubject('ALL');
            }}
            className={`flex-1 py-2 rounded-sm font-mono text-xs font-black flex items-center justify-center gap-1.5 transition-all border ${
              activeCategory === 'STUDY_MATERIAL'
                ? 'bg-[#06b6d4] text-[#000000] border-[#000000] shadow-[2px_2px_0px_#000000]'
                : 'bg-[#080a0d] text-[#94a3b8] border-[#2d3545] hover:text-[#f8fafc]'
            }`}
          >
            <BookOpen size={13} />
            <span>NOTES</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-black border ${
                activeCategory === 'STUDY_MATERIAL'
                  ? 'bg-[#000000] text-[#06b6d4] border-[#000000]'
                  : 'bg-[#1b202b] text-[#94a3b8] border-[#2d3545]'
              }`}
            >
              {lectureNotesCount}
            </span>
          </button>
        </div>

        {/* Search Input & Filter Module */}
        <div className="flex items-center gap-2 flex-1 md:max-w-md">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                activeCategory === 'ASSIGNMENT'
                  ? 'Search active assignments, topics...'
                  : 'Search lecture notes & materials...'
              }
              className="w-full bg-[#080a0d] border-2 border-[#000000] rounded px-3 py-2 pl-8 text-xs text-[#f8fafc] font-mono placeholder-[#64748b] focus:outline-none focus:border-[#fbbf24] shadow-[2px_2px_0px_#000000] transition-colors"
            />
          </div>

          {activeCategory === 'ASSIGNMENT' && (
            <div className="relative shrink-0">
              <select
                value={assignmentStatusFilter}
                onChange={(e) => setAssignmentStatusFilter(e.target.value as 'ACTIVE' | 'ALL' | 'CLOSED')}
                className="appearance-none bg-[#080a0d] hover:bg-[#13171f] active:bg-[#13171f] border-2 border-[#000000] rounded px-2.5 py-2 pr-7 font-mono text-[11px] font-bold text-[#fbbf24] shadow-[2px_2px_0px_#000000] focus:outline-none focus:border-[#fbbf24] cursor-pointer"
              >
                <option value="ACTIVE" className="bg-[#13171f] text-[#fbbf24]">
                  ⚡ Active ({activeAssignmentsCount})
                </option>
                <option value="ALL" className="bg-[#13171f] text-[#f8fafc]">
                  📂 All ({allAssignmentsCount})
                </option>
                <option value="CLOSED" className="bg-[#13171f] text-[#f43f5e]">
                  🔒 Closed ({closedAssignmentsCount})
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-[#fbbf24]">
                <ChevronDown size={13} className="stroke-[2.5]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subject Filter Chips */}
      {subjectList.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedSubject('ALL')}
            className={`px-2.5 py-1 rounded-sm font-mono text-[10px] font-black shrink-0 transition-colors border ${
              selectedSubject === 'ALL'
                ? 'bg-[#f8fafc] text-[#000000] border-[#000000] shadow-[1.5px_1.5px_0px_#000000]'
                : 'bg-[#080a0d] text-[#94a3b8] border-[#2d3545]'
            }`}
          >
            ALL ({categoryItems.length})
          </button>
          {subjectList.map((sub, idx) => {
            const count = categoryItems.filter((i) => i.subjectName === sub).length;
            const isSelected = selectedSubject === sub;
            return (
              <button
                key={`${sub}-${idx}`}
                onClick={() => setSelectedSubject(sub)}
                className={`px-2.5 py-1 rounded-sm font-mono text-[10px] font-black shrink-0 transition-colors border ${
                  isSelected
                    ? 'bg-[#fbbf24] text-[#000000] border-[#000000] shadow-[1.5px_1.5px_0px_#000000]'
                    : 'bg-[#080a0d] text-[#94a3b8] border-[#2d3545]'
                }`}
              >
                {sub} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Items Multi-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {sortedItems.map((item, idx) => {
          const isDownloading = downloadingId === item.detailId;

          if (activeCategory === 'STUDY_MATERIAL') {
            // Lecture Notes Card (Zero deadlines, zero pass marks)
            return (
              <div key={`note-${item.detailId || item.assignmentId}-${idx}`} className="retro-card overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="retro-card-header py-1.5 px-3">
                    <span className="font-mono text-[10px] font-black text-[#000000] bg-[#06b6d4] px-1.5 py-0.2 rounded border border-[#000000]">
                      {item.subjectCode || 'NOTES'}
                    </span>
                    <span className="retro-badge safe text-[9px]">
                      STUDY MATERIAL
                    </span>
                  </div>

                  <div className="p-3 space-y-2">
                    <div className="text-[10px] text-[#94a3b8] font-mono truncate font-bold">
                      {item.subjectName}
                    </div>
                    <h3 className="font-mono text-xs font-bold text-[#f8fafc] leading-snug">
                      {item.topic}
                    </h3>
                  </div>
                </div>

                <div className="p-3 pt-0">
                  <div className="flex items-center justify-between pt-2 border-t border-[#2d3545]">
                    <div className="flex items-center gap-1 text-[10px] font-mono text-[#64748b]">
                      <Calendar size={11} />
                      <span>POSTED: {item.submissionDate}</span>
                    </div>

                    <button
                      onClick={() => handleDownload(item)}
                      disabled={isDownloading}
                      className="btn-retro btn-retro-cyan px-2.5 py-1 text-[10px] flex items-center gap-1.5"
                    >
                      <Download size={11} />
                      <span>{isDownloading ? 'DOWNLOADING...' : 'DOWNLOAD'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          // Active / Overdue Assignment Card
          return (
            <div
              key={`asg-${item.detailId || item.assignmentId}-${idx}`}
              className={`retro-card overflow-hidden flex flex-col justify-between ${
                item.isOverdue ? 'opacity-65 bg-[#0e1218]' : ''
              }`}
            >
              <div>
                {/* Card Titlebar */}
                <div className="retro-card-header py-1.5 px-3">
                  <span className="font-mono text-[10px] font-black text-[#000000] bg-[#06b6d4] px-1.5 py-0.2 rounded border border-[#000000]">
                    {item.subjectCode || 'ASG'}
                  </span>

                  {item.isOverdue ? (
                    <span className="retro-badge ghost text-[9px] flex items-center gap-1">
                      <Lock size={9} />
                      CLOSED
                    </span>
                  ) : (
                    <span className="retro-badge warning text-[9px]">
                      ⚡ DUE: {item.submissionDate}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-3 space-y-2">
                  <div className="text-[10px] text-[#94a3b8] font-mono truncate font-bold">
                    {item.subjectName}
                  </div>
                  <h3 className="font-mono text-xs font-bold text-[#f8fafc] leading-snug">
                    {item.topic}
                  </h3>

                  {/* Inset Metrics Bar (PASS marks removed) */}
                  <div className="retro-inset p-2 grid grid-cols-2 gap-2 text-[10px] font-mono text-center">
                    <div>
                      <span className="text-[#64748b] block text-[9px]">MAX MARKS</span>
                      <strong className="text-[#fbbf24] text-xs">{item.maxMarks}</strong>
                    </div>
                    <div>
                      <span className="text-[#64748b] block text-[9px]">DEADLINE</span>
                      <strong className="text-[#f8fafc] text-xs">{item.submissionDate || 'N/A'}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 pt-0">
                <div className="flex items-center gap-2 pt-2 border-t border-[#2d3545]">
                  <button
                    onClick={() => handleDownload(item)}
                    disabled={isDownloading}
                    className="flex-1 btn-retro py-1.5 text-[10px] text-[#06b6d4] hover:text-[#ffffff] flex items-center justify-center gap-1"
                  >
                    <Download size={11} />
                    <span>{isDownloading ? 'FETCHING...' : 'PROBLEM PDF'}</span>
                  </button>

                  {item.isOverdue ? (
                    <button
                      disabled
                      className="flex-1 btn-retro py-1.5 text-[10px] text-[#64748b] flex items-center justify-center gap-1"
                    >
                      <Lock size={11} />
                      <span>CLOSED</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setSubmittingAssignment(item)}
                      className="flex-1 btn-retro btn-retro-gold py-1.5 text-[10px] flex items-center justify-center gap-1"
                    >
                      <Upload size={11} />
                      <span>SUBMIT</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {sortedItems.length === 0 && (
          <div className="col-span-full retro-card p-6 text-center text-[#94a3b8] font-mono text-xs">
            [NO ASSIGNMENTS MATCHING CRITERIA]
          </div>
        )}
      </div>

      {/* Pre-Flight Submission Safety Shield Modal */}
      {submittingAssignment && (
        <SubmissionSafetyModal
          assignment={submittingAssignment}
          onClose={() => setSubmittingAssignment(null)}
          onSubmitSuccess={(detailId) => {
            alert('Assignment submitted successfully! Detail ID: ' + detailId);
          }}
        />
      )}
    </div>
  );
}
