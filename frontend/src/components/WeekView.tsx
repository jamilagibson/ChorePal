import DayCard from '../components/DayCard';
import type { Chore, ChoreDay } from '../types';

interface WeekViewProps {
  chores: Chore[];
}

const daysOfWeek: ChoreDay[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const WeekView = ({ chores }: WeekViewProps): React.JSX.Element => {
  return (
    <section aria-label='Weekly chore schedule'>
      <h2 className='text-xl font-bold text-white/90 mb-4 tracking-wide uppercase'>
        This Week
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {daysOfWeek.map((day) => {
          const choresForDay = chores.filter(
            (chore) => chore.day?.toLowerCase() === day
          );
          return <DayCard key={day} day={day} chores={choresForDay} />;
        })}
        <div aria-hidden='true' />
      </div>
    </section>
  );
};

export default WeekView;
