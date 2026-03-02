import { useDispatch, useSelector } from 'react-redux';
import { fetchChores } from '../redux/choreSlice';
import { useEffect, useState } from 'react';
import WeekView from '../components/WeekView';
import Navbar from '../components/Navbar';
import ProgressWeekly from '../utils/ProgressWeekly';
import type { RootState, AppDispatch } from '../redux/store';
import type { Chore } from '../types';

function Dashboard(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { chores, loading, error } = useSelector(
    (state: RootState) => state.chores
  );
  const [lowestUser, setLowestUser] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchChores());
  }, [dispatch]);

  useEffect(() => {
    if (!chores || chores.length === 0) {
      setLowestUser(null);
      return;
    }

    const findWorstChild = (choreList: Chore[]): void => {
      const choresByChild: Record<string, Chore[]> = {};

      for (const chore of choreList) {
        const childName = chore.childName?.trim();
        if (!childName) continue;
        if (!choresByChild[childName]) {
          choresByChild[childName] = [];
        }
        choresByChild[childName].push(chore);
      }

      let worstChild: string | null = null;
      let fewestCompletedPercentage = 100;

      for (const child in choresByChild) {
        const childChores = choresByChild[child] ?? [];
        const totalChores = childChores.length;
        const completedCount = childChores.filter(
          (c) => c.status === 'Completed'
        ).length;
        const percentageCompleted = Math.floor(
          (completedCount / totalChores) * 100
        );

        if (percentageCompleted < fewestCompletedPercentage) {
          fewestCompletedPercentage = percentageCompleted;
          worstChild = child;
        }
      }

      setLowestUser(worstChild);
    };

    findWorstChild(chores);
  }, [chores]);

  return (
    <div className='min-h-screen'>
      <Navbar wantedUser={lowestUser} />
      <main id='main-content' className='px-6 py-6 max-w-screen-xl mx-auto'>
        {loading && (
          <p role='status' aria-live='polite'
             className='text-center text-white/70 py-8 text-lg'>
            Loading chores...
          </p>
        )}
        {error && (
          <p role='alert' aria-live='assertive'
             className='text-center text-red-300 py-8'>
            Error: {error}
          </p>
        )}
        <WeekView chores={chores} />
        <ProgressWeekly choreList={chores} />
      </main>
    </div>
  );
}

export default Dashboard;
