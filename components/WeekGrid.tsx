import { DayCard } from '@/components/DayCard';
import type { StudyDay } from '@/lib/types';

interface WeekGridProps {
  days: StudyDay[];
}

export function WeekGrid({ days }: WeekGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {days.map((day, index) => (
        <DayCard key={day.id} day={day} index={index} />
      ))}
    </div>
  );
}
