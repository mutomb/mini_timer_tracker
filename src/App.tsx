import React, { useState, useRef, useEffect } from 'react';

interface TimeEntry {
  id: number;
  taskName: string;
  hours: number;
}

const App: React.FC = () => {
  // State variables
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [taskName, setTaskName] = useState('');
  const [hours, setHours] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const toggleTimer = () => {
    if (isTimerRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsTimerRunning(false);
      setHours(prev => prev + timerSeconds / 3600);
      setTimerSeconds(0);
    } else {
      setIsTimerRunning(true);
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
  };

  const handleAddOrUpdateEntry = () => {
    if (taskName.trim() === '' || hours <= 0) {
      alert('Please enter a valid task name and hours.');
      return;
    }

    if (isEditing && editId !== null) {
      setEntries(prev =>
        prev.map(entry =>
          entry.id === editId ? { ...entry, taskName, hours } : entry
        )
      );
      setIsEditing(false);
      setEditId(null);
    } else {
      const newEntry: TimeEntry = {
        id: Date.now(),
        taskName,
        hours,
      };
      setEntries(prev => [...prev, newEntry]);
    }
    setTaskName('');
    setHours(0);
  };

  const handleEdit = (entry: TimeEntry) => {
    setTaskName(entry.taskName);
    setHours(entry.hours);
    setIsEditing(true);
    setEditId(entry.id);
  };

  const handleDelete = (id: number) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const totalHours = entries.reduce((total, e) => total + e.hours, 0);

  return (
    <div className='app-container'>
      <div className='sections-wrapper'>
        {/* Add Entry Section */}
        <div className='section-container'>
          <h2>Add New Time Entry</h2>
          <div className='form-group full-width'>
            <label htmlFor='taskName'>Task Name</label>
            <input
              id='taskName'
              type='text'
              placeholder='Enter task name'
              value={taskName}
              onChange={e => setTaskName(e.target.value)}
            />
          </div>
          <div className='form-group full-width'>
            <label htmlFor='hours'>Hours Worked</label>
            <input
              id='hours'
              type='number'
              placeholder='Enter hours'
              value={hours}
              onChange={e => setHours(parseFloat(e.target.value))}
            />
          </div>
          <div className='button-group'>
            <button onClick={handleAddOrUpdateEntry}>
              {isEditing ? 'Update Entry' : 'Add Entry'}
            </button>
            {isEditing && (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditId(null);
                  setTaskName('');
                  setHours(0);
                }}
                className='cancel-btn'
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Timer Section */}
        <div className='section-container'>
          <h2>Timer</h2>
          <div className='timer-controls'>
            <button
              onClick={toggleTimer}
              className={`timer-btn ${isTimerRunning ? 'stop' : 'start'}`}
            >
              {isTimerRunning ? 'Stop Timer' : 'Start Timer'}
            </button>
            <span className='timer-display'>
              {' '}
              {Math.floor(timerSeconds)} seconds
            </span>
          </div>
        </div>

        {/* Entries List */}
        <div className='section-container'>
          <h2>Time Entries</h2>
          {entries.length === 0 ? (
             <div className="no-entries-container">
              <p>No time entries yet. Add your first entry!</p>
              <div className="plus-sign">+</div>
            </div>) : (
            <ul className='entries-list'>
              {entries.map(entry => (
                <li key={entry.id} className='entry-item'>
                  <div>
                    <strong>{entry.taskName}</strong>: {entry.hours.toFixed(3)} hours
                  </div>
                  <div className='entry-actions'>
                    <button
                      onClick={() => handleEdit(entry)}
                      className='edit-btn'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className='delete-btn'
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <h3 id='totalHours'>Total Hours: {totalHours.toFixed(3)}</h3>
        </div>
      </div>
    </div>
  );
};

export default App;
