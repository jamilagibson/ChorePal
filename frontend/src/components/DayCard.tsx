import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import AddChoreForm from './AddChore';
import { useDispatch } from 'react-redux';
import { completeChore, deleteChore } from '../redux/choreSlice';
import { fetchChoreImage } from '../api';
import type { AppDispatch } from '../redux/store';
import type { Chore } from '../types';

interface DayCardProps {
  day: string;
  chores: Chore[];
}

// ChorePal brand colours for confetti particles
const CONFETTI_COLORS = ['#ff6600', '#4c8b83', '#1a2b4c', '#cc5200', '#b4e9f3'];

const DayCard = ({ day, chores }: DayCardProps): React.JSX.Element => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [images, setImages] = useState<Record<string, string>>({});
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  // Reads prefers-reduced-motion — WCAG 2.3.3 (Animation from Interactions)
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const fetchImages = async (): Promise<void> => {
      const newImages: Record<string, string> = {};
      for (const chore of chores) {
        if (chore.image && !images[chore._id]) {
          const imgData = await fetchChoreImage(chore.image);
          if (imgData?.imageSource) {
            newImages[chore._id] = imgData.imageSource;
          }
        }
      }
      setImages((prev) => ({ ...prev, ...newImages }));
    };

    fetchImages();
  }, [chores]);

  const handleDropdownChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    chore: Chore
  ): void => {
    const value = e.target.value;

    if (value === 'Completed') {
      dispatch(completeChore(chore));

      // Announce completion to screen readers via aria-live region below
      setAnnouncement(`${chore.choreName} marked complete`);

      if (!shouldReduceMotion) {
        // Confetti burst — branded colours, ~800ms particle life at 60fps
        void confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: CONFETTI_COLORS,
          ticks: 60,
        });

        // Trigger scale pulse on the chore row, clear after animation completes
        setJustCompletedId(chore._id);
        setTimeout(() => setJustCompletedId(null), 800);
      }
    } else if (value === 'Delete') {
      dispatch(deleteChore(chore._id));
      setAnnouncement(`${chore.choreName} deleted`);
    }
  };

  return (
    <div className='bg-linear-to-r from-gray-300 via-gray-500 to-gray-700 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 text-blue-900 dark:text-gray-100 rounded-2xl shadow-lg p-5 flex flex-col gap-5 mt-6 w-90'>

      {/* Visually hidden aria-live region — announces state changes to screen readers */}
      <div
        role='status'
        aria-live='polite'
        aria-atomic='true'
        className='sr-only'
      >
        {announcement}
      </div>

      <h2 className='text-2xl font-bold tracking-wide'>{day.toUpperCase()}</h2>

      <div className='bg-surfaceLight dark:bg-gray-800/60 rounded-xl p-4 flex flex-col gap-3'>
        {chores.length > 0 ? (
          <ul className='list-disc list-inside text-primaryDark dark:text-gray-100 space-y-1'>
            {chores.map((chore) => (
              <motion.li
                key={chore._id}
                // Scale pulse on completion; skipped when prefers-reduced-motion is set
                animate={
                  !shouldReduceMotion && justCompletedId === chore._id
                    ? { scale: [1, 1.06, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.4, ease: 'easeOut' }}
                // transition-colors gives a smooth hue shift from orange → green
                className={`text-base font-semibold flex items-center gap-2 transition-colors duration-300 ${
                  chore.status === 'Completed'
                    ? 'text-green-900 dark:text-green-400'
                    : 'text-orange-800 dark:text-orange-300'
                }`}
              >
                {images[chore._id] && (
                  <img
                    src={images[chore._id]}
                    alt={`${chore.choreName} icon`}
                    className='w-8 h-8 rounded-full object-cover align-middle inline mr-2'
                  />
                )}
                {chore.childName} – {chore.choreName} –
                <select
                  onChange={(e) => handleDropdownChange(e, chore)}
                  value={chore.status}
                  aria-label={`Action for ${chore.choreName}`}
                >
                  <option
                    value='Pending'
                    disabled={chore.status === 'Completed'}
                  >
                    Select
                  </option>
                  <option value='Completed'>Completed</option>
                  <option value='Delete'>Delete</option>
                </select>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className='text-sm text-black/70 dark:text-white/60 italic'>No chores assigned.</p>
        )}

        <button
          onClick={() => setShowAddForm(true)}
          aria-label={`Add new chore for ${day}`}
          className='self-start bg-accentOrange text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-accentOrangeDark transition duration-200'
        >
          Add New Chore
        </button>

        {showAddForm && (
          <AddChoreForm day={day} onClose={() => setShowAddForm(false)} />
        )}
      </div>
    </div>
  );
};

export default DayCard;
