import { useState } from 'react';
import { Calendar } from 'lucide-react';

const DateRangePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const presets = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 15 days', days: 15 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
  ];

  const formatDateForInput = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleFromChange = (e) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;
    onChange({ ...value, from: newDate });
  };

  const handleToChange = (e) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;
    onChange({ ...value, to: newDate });
  };

  const handlePresetClick = (days) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    onChange({ from, to });
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange({ from: null, to: null });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div
        className="flex items-center w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar size={16} className="text-gray-400 mr-2" />
        <span>
          {value.from || value.to ? (
            <>
              {value.from ? formatDateForInput(value.from) : 'Start date'}{' - '}
              {value.to ? formatDateForInput(value.to) : 'End date'}
            </>
          ) : (
            'Select date range'
          )}
        </span>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-4 w-80">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formatDateForInput(value.from)}
                onChange={handleFromChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formatDateForInput(value.to)}
                onChange={handleToChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Presets</h3>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.days}
                  onClick={() => handlePresetClick(preset.days)}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleClear}
              className="text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Clear
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;