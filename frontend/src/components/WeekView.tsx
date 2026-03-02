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
      <div className='grid grid-cols-4 gap-x-5 gap-y-5'>
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
