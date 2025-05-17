import { useState, useEffect } from 'react';
import Button from '@/components/common/Button';

const MentorForm = ({ mentor, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'mentor',
    isActive: true,
    baseRate: 4000,
    specialization: '',
    joinedAt: new Date().toISOString().split('T')[0],
    paymentDetails: {
      accountNumber: '',
      bankName: '',
      ifscCode: ''
    }
  });

  useEffect(() => {
    if (mentor) {
      const joinedDate = new Date(mentor.joinedAt).toISOString().split('T')[0];
      setFormData({
        ...mentor,
        joinedAt: joinedDate
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        joinedAt: today
      }));
    }
  }, [mentor]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'isActive') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }

    if (name.startsWith('payment.')) {
      const paymentField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        paymentDetails: {
          ...prev.paymentDetails,
          [paymentField]: value
        }
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      id: mentor?.id || `mentor-${Date.now()}`,
      ...formData,
      baseRate: Number(formData.baseRate)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            required
          />
        </div>

        <div>
          <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Specialization
          </label>
          <input
            type="text"
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
          />
        </div>

        <div>
          <label htmlFor="baseRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Base Rate (₹/hour)
          </label>
          <input
            type="number"
            id="baseRate"
            name="baseRate"
            min="0"
            step="100"
            value={formData.baseRate}
            onChange={handleInputChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            required
          />
        </div>

        <div>
          <label htmlFor="joinedAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Joined Date
          </label>
          <input
            type="date"
            id="joinedAt"
            name="joinedAt"
            value={formData.joinedAt}
            onChange={handleInputChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Active Status
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-md font-medium mb-3">Payment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="payment.accountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Account Number
            </label>
            <input
              type="text"
              id="payment.accountNumber"
              name="payment.accountNumber"
              value={formData.paymentDetails.accountNumber || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            />
          </div>

          <div>
            <label htmlFor="payment.bankName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bank Name
            </label>
            <input
              type="text"
              id="payment.bankName"
              name="payment.bankName"
              value={formData.paymentDetails.bankName || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            />
          </div>

          <div>
            <label htmlFor="payment.ifscCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              IFSC Code
            </label>
            <input
              type="text"
              id="payment.ifscCode"
              name="payment.ifscCode"
              value={formData.paymentDetails.ifscCode || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {mentor ? 'Update Mentor' : 'Add Mentor'}
        </Button>
      </div>
    </form>
  );
};

export default MentorForm;