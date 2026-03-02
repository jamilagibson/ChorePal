import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchChores } from '../redux/choreSlice';
import { getImageFilenameForChore } from '../utils/choreImageMap';
import type { AppDispatch } from '../redux/store';

interface AddChoreFormProps {
  day: string;
  onClose: () => void;
}

const AddChoreForm = ({ day, onClose }: AddChoreFormProps): React.JSX.Element => {
  const [choreName, setChoreName] = useState('');
  const [childName, setChildName] = useState('');
  const [isWeekly, setIsWeekly] = useState(false);
  const [formError, setFormError] = useState('');
  const firstInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    firstInputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (choreName.trim() === '' || childName.trim() === '') {
      setFormError('Please fill in both Chore Name and Child Name.');
      return;
    }
    setFormError('');

    const imageFilename = getImageFilenameForChore(choreName);
    const formData = {
      choreName,
      childName,
      day,
      isWeekly,
      isCompleted: false,
      rating: null,
      image: imageFilename,
    };

    try {
      await axios.post('http://localhost:3000/chores', formData);
      dispatch(fetchChores());
      onClose();
    } catch (err) {
      console.error('Failed to add chore:', err);
    }
  };

  return (
    <div className='bg-white dark:bg-gray-800 dark:text-white p-4 rounded shadow-md mt-4'>
      <h3 className='font-semibold mb-2'>Add New Chore for {day.toUpperCase()}</h3>
      {formError && (
        <p
          id='add-chore-error'
          role='alert'
          aria-live='assertive'
          className='text-red-700 dark:text-red-400 text-sm mb-2'
        >
          ⚠ {formError}
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-3'
        aria-describedby={formError ? 'add-chore-error' : undefined}
      >
        <div className='flex flex-col gap-1'>
          <label htmlFor='chore-name'>Chore Name:</label>
          <input
            ref={firstInputRef}
            id='chore-name'
            type='text'
            value={choreName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setChoreName(e.target.value)
            }
            className='border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            required
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='child-name'>Child Name:</label>
          <input
            id='child-name'
            type='text'
            value={childName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setChildName(e.target.value)
            }
            className='border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            required
          />
          <label className='flex items-center gap-2'>
            <input
              type='checkbox'
              checked={isWeekly}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setIsWeekly(e.target.checked)
              }
            />
            Weekly chore?
          </label>
        </div>
        <div className='flex gap-2'>
          <button
            type='submit'
            className='bg-accentOrange text-white px-4 py-2 rounded-full hover:bg-accentOrangeDark font-semibold transition'
          >
            Save
          </button>
          <button
            type='button'
            onClick={onClose}
            className='bg-gray-300 dark:bg-gray-600 dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddChoreForm;
