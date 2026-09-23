import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  UserAcademicConfig,
  TimetableSession,
  BatchFilter,
  TimelineOccurrence,
} from './types/timetable';
import { getStoredConfig, saveStoredConfig, clearStoredConfig, clearAllCachedTimetables } from './utils/storage';
import {
  loadTimetableForDivision,
  calculateOccurrences,
  TimetableLoadResult,
} from './services/timetableService';
import { getSpecialDayStatus } from './data/academicCalendarData';
import { useLiveClock } from './hooks/useLiveClock';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroEvent } from './components/dashboard/HeroEvent';
import { DaySelector } from './components/dashboard/DaySelector';
import { DayTimeline } from './components/dashboard/DayTimeline';
import { WeekGrid } from './components/timetable/WeekGrid';
import { TimetableSearchFilter } from './components/timetable/TimetableSearchFilter';
import { ClassDetailModal } from './components/timetable/ClassDetailModal';
import { AcademicCalendarView } from './components/academic/AcademicCalendarView';
import { IdentityPickerModal } from './components/settings/IdentityPickerModal';
import { AboutModal } from './components/settings/AboutModal';
import { PDFUploadModal } from './components/upload/PDFUploadModal';
import { MobileNavigation } from './components/layout/MobileNavigation';
import { MobileInstallModal } from './components/ui/MobileInstallModal';
import { OfflineBanner } from './components/ui/OfflineBanner';
import { FuturisticLoader } from './components/ui/FuturisticLoader';
import { LandingHero } from './components/dashboard/LandingHero';
import { getTodayDateString } from './utils/timeUtils';
import { generateSamplePreviewSchedule } from './data/samplePreviewData';
import { SlidersHorizontal, AlertTriangle } from 'lucide-react';

export default function App() {
  const clock = useLiveClock();

  // 1. User Academic Configuration
  const [config, setConfig] = useState<UserAcademicConfig | null>(() => getStoredConfig());
  const [isIdentityPickerOpen, setIsIdentityPickerOpen] = useState<boolean>(() => !getStoredConfig());
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(() => !getStoredConfig());

  // Clear previous sample events on mount as requested
  useEffect(() => {
    clearAllCachedTimetables();
  }, []);

  // 2. Navigation State
  const [activeTab, setActiveTab] = useState<'command' | 'timetable' | 'week' | 'calendar'>('command');

  // 3. Day Offset State (0 = Today, 1 = Tomorrow, ..., 6)
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);

  // 4. Search and Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSessionType, setSelectedSessionType] = useState<string>('ALL');
  const [batchFilter, setBatchFilter] = useState<BatchFilter>('ALL');

  // 5. Modals State
  const [selectedDetailSession, setSelectedDetailSession] = useState<TimetableSession | null>(null);
  const [selectedDetailDateMs, setSelectedDetailDateMs] = useState<number | undefined>(undefined);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isMobileInstallOpen, setIsMobileInstallOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // 6. Timetable Data State
  const [timetableData, setTimetableData] = useState<TimetableLoadResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Online / Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Compute active division slug from config
  const divisionSlug = useMemo(() => {
    if (!config) return 'FY-CSAI-B';
    return `FY-${config.branch}-${config.division}`;
  }, [config]);

  // Load timetable data whenever divisionSlug changes
  const loadSchedule = useCallback(async () => {
    if (!config) return;
    setIsLoading(true);
    try {
      const result = await loadTimetableForDivision(
        divisionSlug,
        config.batch,
        batchFilter === 'ALL' ? config.batch : batchFilter
      );
      setTimetableData(result);
    } catch (err) {
      console.error('Failed loading timetable data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [divisionSlug, config, batchFilter]);

  useEffect(() => {
    if (config) {
      loadSchedule();
    }
  }, [config, divisionSlug, loadSchedule]);

  // Save new configuration
  const handleSaveConfig = (newConfig: UserAcademicConfig) => {
    saveStoredConfig(newConfig);
    setConfig(newConfig);
    setBatchFilter(newConfig.batch);
    setIsIdentityPickerOpen(false);
    setIsFirstVisit(false);
  };

  // Reset configuration
  const handleResetConfig = () => {
    clearStoredConfig();
    setIsIdentityPickerOpen(true);
  };

  // Selected date object for the day timeline
  const selectedDate = useMemo(() => {
    return new Date(
      clock.now.getFullYear(),
      clock.now.getMonth(),
      clock.now.getDate() + selectedDayOffset
    );
  }, [clock.now, selectedDayOffset]);

  // Calculate timeline occurrences (current, next, upcoming classes)
  const occurrences = useMemo(() => {
    if (!timetableData || !config) return [];
    return calculateOccurrences(timetableData.sessions, config.batch, clock.now, 14);
  }, [timetableData, config, clock.now]);

  // Current class (happening right now)
  const currentClass = useMemo(() => {
    return occurrences.find((o) => o.state === 'CURRENT') || null;
  }, [occurrences]);

  // Next class
  const nextClass = useMemo(() => {
    return occurrences.find((o) => o.state === 'NEXT') || null;
  }, [occurrences]);

  // After class (the class following the current/next class)
  const afterClass = useMemo(() => {
    if (currentClass) {
      return occurrences.find((o) => o.startDate.getTime() >= currentClass.endDate.getTime()) || null;
    }
    if (nextClass) {
      return occurrences.find((o) => o.startDate.getTime() >= nextClass.endDate.getTime()) || null;
    }
    return null;
  }, [occurrences, currentClass, nextClass]);

  // Today's special day status (holidays / exams)
  const todaySpecial = useMemo(() => {
    return getSpecialDayStatus(getTodayDateString(clock.now));
  }, [clock.now]);

  // Open class detail modal
  const handleOpenDetails = (session: TimetableSession, dateMs: number) => {
    setSelectedDetailSession(session);
    setSelectedDetailDateMs(dateMs);
  };

  // Load sample demo schedule for on-demand UI preview
  const handleLoadDemoSchedule = useCallback(() => {
    if (!config || !timetableData) return;
    const demoSessions = generateSamplePreviewSchedule(divisionSlug);
    const filtered = demoSessions.filter((s) => {
      if (batchFilter === 'ALL') return true;
      if (!s.batch) return true;
      return s.batch === batchFilter;
    });
    setTimetableData({
      ...timetableData,
      sessions: demoSessions,
      filteredSessions: filtered,
      isCached: true,
      cachedAt: new Date().toISOString(),
      dataSource: 'Sample Form FF957 Division Template (Preview)',
    });
  }, [config, timetableData, divisionSlug, batchFilter]);

  // Filtered sessions for the search / timetable page
  const searchFilteredSessions = useMemo(() => {
    if (!timetableData || !config) return [];
    let list = timetableData.sessions;

    // Filter by batch
    if (batchFilter !== 'ALL') {
      list = list.filter((s) => !s.batch || s.batch === batchFilter);
    }

    // Filter by session type
    if (selectedSessionType !== 'ALL') {
      list = list.filter((s) => s.sessionType === selectedSessionType);
    }

    // Filter by search query (subject, code, faculty, room)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.subjectName.toLowerCase().includes(q) ||
          s.subjectCode.toLowerCase().includes(q) ||
          s.room.toLowerCase().includes(q) ||
          s.facultyInitials.toLowerCase().includes(q) ||
          (s.facultyName && s.facultyName.toLowerCase().includes(q))
      );
    }

    return list;
  }, [timetableData, config, batchFilter, selectedSessionType, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0b0d11] text-zinc-100 relative subtle-grid">
      {/* Subtle ambient spatial light */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 right-1/4 h-[600px] w-[600px] rounded-full bg-white/[0.015] blur-[150px]" />
        <div className="absolute top-1/2 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.012] blur-[140px]" />
      </div>

      {/* Top Header */}
      {config && (
        <Header
          config={config}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenIdentityPicker={() => setIsIdentityPickerOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenUpload={() => setIsUploadModalOpen(true)}
          liveTimeIST={config.timeFormat === '24' ? clock.timeFormatted24 : clock.timeFormatted12}
          liveDateIST={clock.dateFormatted}
        />
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-3 sm:px-6 py-6">
        {/* If no configuration exists yet (First Visit), show Landing Hero and setup trigger */}
        {!config && (
          <div className="py-6 sm:py-12">
            <LandingHero
              onInitialize={() => setIsIdentityPickerOpen(true)}
              onExploreDefault={() => {
                // Initialize with default template (user can change anytime)
                handleSaveConfig({
                  version: '1.0',
                  program: 'BTECH',
                  branch: 'CSAI',
                  academicYear: '2026-27',
                  semester: 1,
                  division: 'B',
                  batch: '1',
                  timeFormat: '12',
                  lastUpdated: new Date().toISOString(),
                });
              }}
            />
          </div>
        )}

        {/* Populated App Experience */}
        {config && (
          <>
            {/* Offline & Cache Banner */}
            <OfflineBanner
              isCached={timetableData?.isCached || false}
              cachedAt={timetableData?.cachedAt}
              sourceVersion={timetableData?.sourceVersion}
              isOnline={isOnline}
            />

            {isLoading && (
              <FuturisticLoader
                label="STREAMING TIMETABLE RECORDS"
                divisionSlug={divisionSlug}
              />
            )}

            {!isLoading && timetableData && (
              <>
                {/* 1. COMMAND DASHBOARD TAB */}
                {activeTab === 'command' && (
                  <div className="space-y-6">
                    {/* Hero Event: Current / Next Class with live countdown & door plate */}
                    <HeroEvent
                      currentClass={currentClass}
                      nextClass={nextClass}
                      afterClass={afterClass}
                      todaySpecial={todaySpecial}
                      now={clock.now}
                      onOpenDetails={handleOpenDetails}
                      userBatch={config.batch}
                      totalEventsCount={timetableData.sessions.length}
                      onOpenUpload={() => setIsUploadModalOpen(true)}
                      divisionSlug={divisionSlug}
                      onLoadDemoEvents={handleLoadDemoSchedule}
                    />

                    {/* Day Navigator */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider">
                          Schedule Timeline
                        </span>
                        <span className="text-xs font-mono text-zinc-400">
                          {selectedDayOffset === 0 ? 'Today' : `+${selectedDayOffset} days`}
                        </span>
                      </div>
                      <DaySelector
                        selectedOffset={selectedDayOffset}
                        onSelectOffset={(offset) => setSelectedDayOffset(offset)}
                        now={clock.now}
                        sessions={timetableData.sessions}
                        userBatch={config.batch}
                      />
                    </div>

                    {/* Day Schedule Timeline */}
                    <div>
                      <DayTimeline
                        sessions={timetableData.sessions}
                        userBatch={config.batch}
                        date={selectedDate}
                        now={clock.now}
                        isToday={selectedDayOffset === 0}
                        onOpenDetails={handleOpenDetails}
                        timeFormat={config.timeFormat}
                      />
                    </div>
                  </div>
                )}

                {/* 2. TIMELINE & SEARCH TAB */}
                {activeTab === 'timetable' && (
                  <div className="space-y-5">
                    <TimetableSearchFilter
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      selectedSessionType={selectedSessionType}
                      onSessionTypeChange={setSelectedSessionType}
                      selectedBatchFilter={batchFilter}
                      onBatchFilterChange={setBatchFilter}
                      userBatch={config.batch}
                    />

                    <div className="glass-surface rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-xl">
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                        <h3 className="font-['Cabinet_Grotesk'] text-lg font-bold text-white">
                          Schedule Records
                        </h3>
                        <span className="font-mono text-xs text-zinc-400">
                          {searchFilteredSessions.length} sessions found
                        </span>
                      </div>

                      {searchFilteredSessions.length === 0 ? (
                        <div className="py-12 text-center text-xs text-zinc-400">
                          <AlertTriangle className="h-6 w-6 text-amber-400 mx-auto mb-2 opacity-80" />
                          <p>No timetable sessions match your search query.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {searchFilteredSessions.map((s) => {
                            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            return (
                              <div
                                key={s.id}
                                onClick={() => handleOpenDetails(s, clock.now.getTime())}
                                className="glass-surface glass-surface-hover flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl transition-all cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-12 text-center py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] font-mono text-xs font-semibold text-zinc-300">
                                    {dayNames[s.weekday]}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-xs font-semibold text-white">
                                        {s.subjectCode}
                                      </span>
                                      <span className="text-xs text-zinc-600">·</span>
                                      <span className="text-xs text-zinc-200 font-semibold">
                                        {s.subjectName}
                                      </span>
                                    </div>
                                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                      {s.facultyName || `Faculty (${s.facultyInitials})`} · {s.sessionType}
                                      {s.batch ? ` · Batch ${s.batch}` : ' · All Batches'}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-3 font-mono text-xs text-zinc-300">
                                  <span className="text-zinc-400">
                                    {Math.floor(s.startTime / 60)}:{String(s.startTime % 60).padStart(2, '0')} – {Math.floor(s.endTime / 60)}:{String(s.endTime % 60).padStart(2, '0')}
                                  </span>
                                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] font-medium text-white">
                                    Room {s.room}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. WEEKLY GRID TAB */}
                {activeTab === 'week' && (
                  <WeekGrid
                    sessions={timetableData.sessions}
                    userBatch={config.batch}
                    now={clock.now}
                    onOpenDetails={handleOpenDetails}
                    timeFormat={config.timeFormat}
                  />
                )}

                {/* 4. ACADEMIC CALENDAR TAB */}
                {activeTab === 'calendar' && <AcademicCalendarView />}
              </>
            )}
          </>
        )}
      </main>

      {/* Class Detail Modal */}
      {selectedDetailSession && timetableData && config && (
        <ClassDetailModal
          session={selectedDetailSession}
          dateMs={selectedDetailDateMs}
          allSessions={timetableData.sessions}
          onClose={() => setSelectedDetailSession(null)}
          userBatch={config.batch}
          divisionSlug={divisionSlug}
        />
      )}

      {/* Academic Identity Configuration Modal */}
      {isIdentityPickerOpen && (
        <IdentityPickerModal
          currentConfig={config}
          onSave={handleSaveConfig}
          onClose={() => setIsIdentityPickerOpen(false)}
          isFirstVisit={isFirstVisit}
        />
      )}

      {/* PDF Timetable Ingestion Portal Modal */}
      {isUploadModalOpen && config && (
        <PDFUploadModal
          divisionSlug={divisionSlug}
          userBatch={config.batch}
          onClose={() => setIsUploadModalOpen(false)}
          onTimetableImported={(importedSessions) => {
            if (timetableData) {
              const filtered = importedSessions.filter((s) => {
                if (batchFilter === 'ALL') return true;
                if (!s.batch) return true;
                return s.batch === batchFilter;
              });
              setTimetableData({
                ...timetableData,
                sessions: importedSessions,
                filteredSessions: filtered,
                isCached: true,
                cachedAt: new Date().toISOString(),
                dataSource: 'Uploaded Timetable PDF (Form FF957 Verified)',
              });
            }
          }}
        />
      )}

      {/* Creator Credit About Modal */}
      {isAboutOpen && (
        <AboutModal
          onClose={() => setIsAboutOpen(false)}
        />
      )}

      {/* Mobile Home Screen / PWA Bookmark Guide Modal */}
      <MobileInstallModal
        isOpen={isMobileInstallOpen}
        onClose={() => setIsMobileInstallOpen(false)}
      />

      {/* Mobile Bottom Navigation Bar (Thumb-optimized for phones) */}
      {config && (
        <MobileNavigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenMobileInstall={() => setIsMobileInstallOpen(true)}
        />
      )}

      {/* Footer with Attribution Graphic */}
      <Footer
        onOpenAbout={() => setIsAboutOpen(true)}
        onResetConfig={handleResetConfig}
        version="1.0.0"
      />
    </div>
  );
}
