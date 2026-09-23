import React from 'react';
import { getSpecialDayStatus } from '../../data/academicCalendarData';
import { padZero, WEEKDAY_NAMES } from '../../utils/timeUtils';
import { TimetableSession, BatchNumber } from '../../types/timetable';
import { Sparkles, Calendar } from 'lucide-react';

interface DaySelectorProps {
  selectedOffset: number;
  onSelectOffset: (offset: number) => void;
  now: Date;
  sessions: TimetableSession[];
  userBatch: BatchNumber;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  selectedOffset,
  onSelectOffset,
  now,
  sessions,
  userBatch,
}) => {
  const days = [0, 1, 2, 3, 4, 5, 6].map((offset) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const yyyy = d.getFullYear();
    const mm = padZero(d.getMonth() + 1);
    const dd = padZero(d.getDate());
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const special = getSpecialDayStatus(dateStr);
    const dayClasses = sessions.filter(
      (s) => s.weekday === d.getDay() && (!s.batch || s.batch === userBatch)
    );

    return {
      offset,
      date: d,
      dateStr,
      special,
      classCount: dayClasses.length,
      isToday: offset === 0,
      weekdayName: offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : WEEKDAY_NAMES[d.getDay()],
      shortWeekday: WEEKDAY_NAMES[d.getDay()].slice(0, 3).toUpperCase(),
    };
  });

  return (
    <div className="relative">
      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin scroll-smooth no-scrollbar">
        {days.map((item) => {
          const isSelected = selectedOffset === item.offset;
          const isHoliday = item.special.kind === 'holiday';
          const isExam = item.special.kind === 'exam';

          return (
            <button
              key={item.offset}
              onClick={() => onSelectOffset(item.offset)}
              className={`group relative flex flex-col items-center justify-between min-w-[80px] sm:min-w-[96px] py-3.5 px-2.5 rounded-2xl border transition-all duration-200 cursor-pointer text-center ${
                isSelected
                  ? 'bg-gradient-to-b from-white to-zinc-100 text-zinc-950 border-white shadow-xl scale-[1.03] z-10'
                  : 'studio-card studio-card-hover text-zinc-400 hover:text-white'
              }`}
            >
              {/* Today Indicator Notch */}
              {item.isToday && (
                <span className={`absolute -top-1 px-1.5 py-0.2 rounded-full text-[8px] font-mono font-bold uppercase tracking-wider ${
                  isSelected 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  Today
                </span>
              )}

              {/* Day Name */}
              <span className={`text-[10px] font-mono font-semibold tracking-wider mt-0.5 ${
                isSelected ? 'text-zinc-600' : 'text-zinc-400 group-hover:text-zinc-300'
              }`}>
                {item.shortWeekday}
              </span>

              {/* Day Number */}
              <span className="font-['Cabinet_Grotesk'] text-2xl font-black my-0.5 tracking-tight">
                {item.date.getDate()}
              </span>

              {/* Status / Session Count */}
              <div className="flex items-center justify-center gap-1 text-[10px] font-mono">
                {isHoliday ? (
                  <span className={isSelected ? 'text-rose-700 font-bold' : 'text-rose-400 font-semibold'}>
                    Recess
                  </span>
                ) : isExam ? (
                  <span className={isSelected ? 'text-amber-800 font-bold' : 'text-amber-400 font-semibold'}>
                    Exam
                  </span>
                ) : item.classCount > 0 ? (
                  <div className="flex items-center gap-1">
                    <span className={`font-semibold ${isSelected ? 'text-zinc-800' : 'text-zinc-300'}`}>
                      {item.classCount}
                    </span>
                    <span className={isSelected ? 'text-zinc-500' : 'text-zinc-500'}>
                      {item.classCount === 1 ? 'class' : 'classes'}
                    </span>
                  </div>
                ) : (
                  <span className={isSelected ? 'text-zinc-400' : 'text-zinc-500'}>Free</span>
                )}
              </div>

              {/* Session Load Dots (Mini visual heat-dots) */}
              {!isHoliday && !isExam && item.classCount > 0 && (
                <div className="flex items-center gap-1 mt-1.5">
                  {Array.from({ length: Math.min(item.classCount, 4) }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-1 w-1 rounded-full ${
                        isSelected ? 'bg-zinc-800' : 'bg-emerald-400/70'
                      }`}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
