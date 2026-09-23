import React from 'react';
import { getSpecialDayStatus } from '../../data/academicCalendarData';
import { padZero, WEEKDAY_NAMES } from '../../utils/timeUtils';
import { TimetableSession, BatchNumber } from '../../types/timetable';
import { Sparkles, FileText } from 'lucide-react';

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
      weekdayName: offset === 0 ? 'Today' : offset === 1 ? 'Tmrw' : WEEKDAY_NAMES[d.getDay()].slice(0, 3),
    };
  });

  return (
    <div className="relative">
      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
        {days.map((item) => {
          const isSelected = selectedOffset === item.offset;
          const isHoliday = item.special.kind === 'holiday';
          const isExam = item.special.kind === 'exam';

          return (
            <button
              key={item.offset}
              onClick={() => onSelectOffset(item.offset)}
              className={`flex flex-col items-center justify-between min-w-[76px] sm:min-w-[88px] py-3 px-2 rounded-2xl border transition-all cursor-pointer text-center ${
                isSelected
                  ? 'bg-white text-zinc-950 border-white shadow-lg font-semibold scale-[1.02]'
                  : 'glass-surface glass-surface-hover text-zinc-400 hover:text-white'
              }`}
            >
              <span className={`text-[10px] font-mono uppercase tracking-wider ${
                isSelected ? 'text-zinc-600' : 'text-zinc-400'
              }`}>
                {item.weekdayName}
              </span>

              <span className="font-['Cabinet_Grotesk'] text-xl font-bold my-0.5">
                {item.date.getDate()}
              </span>

              <div className="flex items-center gap-1 text-[10px] font-mono">
                {isHoliday ? (
                  <span className={isSelected ? 'text-rose-600 font-semibold' : 'text-rose-400 font-semibold'}>
                    Recess
                  </span>
                ) : isExam ? (
                  <span className={isSelected ? 'text-amber-700 font-semibold' : 'text-amber-400 font-semibold'}>
                    Exam
                  </span>
                ) : item.classCount > 0 ? (
                  <span className={isSelected ? 'text-zinc-700' : 'text-zinc-400'}>
                    {item.classCount} {item.classCount === 1 ? 'session' : 'sessions'}
                  </span>
                ) : (
                  <span className={isSelected ? 'text-zinc-400' : 'text-zinc-500'}>Free</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
