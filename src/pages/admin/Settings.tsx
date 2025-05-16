import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Button from '@/components/common/Button';
import { Save, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';

// Default settings
const defaultSettings = {
  general: {
    companyName: 'EdTech Company',
    email: 'admin@edutech.com',
    phone: '+1 (555) 123-4567',
    address: '123 Education Lane, Tech City, TC 10001'
  },
  payout: {
    defaultPlatformFee: 5,
    defaultGstPercentage: 18,
    autoPayout: false,
    payoutDay: 1,
    payoutBankDetails: {
      accountName: 'EdTech Company',
      accountNumber: 'XXXX-XXXX-XXXX-1234',
      bankName: 'Bank of Tech',
      ifscCode: 'TECH0001234'
    }
  },
  sessions: {
    sessionTypes: ['live', 'evaluation', 'recording'],
    defaultDuration: 60,
    allowMentorRateOverride: true,
    minimumSessionLength: 30
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    payoutNotifications: true,
    sessionReminders: true
  }
};

const Settings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [activeTab, setActiveTab] = useState('general');
  
  const handleInputChange = (
    section: string,
    field: string,
    value: string | number | boolean
  ) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section as keyof typeof settings],
        [field]: value
      }
    });
  };
  
  const handleNestedInputChange = (
    section: string,
    nestedSection: string,
    field: string,
    value: string | number | boolean
  ) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section as keyof typeof settings],
        [nestedSection]: {
          ...settings[section as keyof typeof settings][nestedSection],
          [field]: value
        }
      }
    });
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would save settings to the database/API
    toast.success('Settings saved successfully');
  };
  
  const handleResetSettings = () => {
    setSettings(defaultSettings);
    toast.success('Settings reset to defaults');
  };
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Configure system settings and preferences
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'general'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('payout')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'payout'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Payout Settings
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'sessions'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Session Configuration
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'notifications'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Notifications
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium border-b border-gray-200 dark:border-gray-700 pb-2">Company Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    value={settings.general.companyName}
                    onChange={(e) => handleInputChange('general', 'companyName', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={settings.general.email}
                    onChange={(e) => handleInputChange('general', 'email', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    value={settings.general.phone}
                    onChange={(e) => handleInputChange('general', 'phone', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <textarea
                    id="address"
                    rows={2}
                    value={settings.general.address}
                    onChange={(e) => handleInputChange('general', 'address', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Payout Settings */}
          {activeTab === 'payout' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium border-b border-gray-200 dark:border-gray-700 pb-2">Payout Configuration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="defaultPlatformFee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Default Platform Fee (%)
                  </label>
                  <input
                    type="number"
                    id="defaultPlatformFee"
                    min="0"
                    max="100"
                    step="0.1"
                    value={settings.payout.defaultPlatformFee}
                    onChange={(e) => handleInputChange('payout', 'defaultPlatformFee', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="defaultGstPercentage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Default GST Percentage (%)
                  </label>
                  <input
                    type="number"
                    id="defaultGstPercentage"
                    min="0"
                    max="100"
                    step="0.1"
                    value={settings.payout.defaultGstPercentage}
                    onChange={(e) => handleInputChange('payout', 'defaultGstPercentage', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoPayout"
                    checked={settings.payout.autoPayout}
                    onChange={(e) => handleInputChange('payout', 'autoPayout', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autoPayout" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Enable Automatic Monthly Payouts
                  </label>
                </div>
                
                <div>
                  <label htmlFor="payoutDay" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payout Day of Month
                  </label>
                  <input
                    type="number"
                    id="payoutDay"
                    min="1"
                    max="31"
                    value={settings.payout.payoutDay}
                    onChange={(e) => handleInputChange('payout', 'payoutDay', parseInt(e.target.value))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  />
                </div>
              </div>
              
              <h3 className="text-md font-medium mt-8 mb-4">Company Bank Details (for Receipts)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Account Name
                  </label>
                  <input
                    type="text"
                    id="accountName"
                    value={settings.payout.payoutBankDetails.accountName}
                    onChange={(e) => handleNestedInputChange('payout', 'payoutBankDetails', 'accountName', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    value={settings.payout.payoutBankDetails.accountNumber}
                    onChange={(e) => handleNestedInputChange('payout', 'payoutBankDetails', 'accountNumber', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    id="bankName"
                    value={settings.payout.payoutBankDetails.bankName}
                    onChange={(e) => handleNestedInputChange('payout', 'payoutBankDetails', 'bankName', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    id="ifscCode"
                    value={settings.payout.payoutBankDetails.ifscCode}
                    onChange={(e) => handleNestedInputChange('payout', 'payoutBankDetails', 'ifscCode', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Session Settings */}
          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium border-b border-gray-200 dark:border-gray-700 pb-2">Session Configuration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="sessionTypes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Session Types (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="sessionTypes"
                    value={settings.sessions.sessionTypes.join(', ')}
                    onChange={(e) => handleInputChange('sessions', 'sessionTypes', e.target.value.split(', '))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="defaultDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Default Session Duration (minutes)
                  </label>
                  <input
                    type="number"
                    id="defaultDuration"
                    min="15"
                    step="15"
                    value={settings.sessions.defaultDuration}
                    onChange={(e) => handleInputChange('sessions', 'defaultDuration', parseInt(e.target.value))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="minimumSessionLength" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Minimum Session Length (minutes)
                  </label>
                  <input
                    type="number"
                    id="minimumSessionLength"
                    min="15"
                    step="15"
                    value={settings.sessions.minimumSessionLength}
                    onChange={(e) => handleInputChange('sessions', 'minimumSessionLength', parseInt(e.target.value))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowMentorRateOverride"
                    checked={settings.sessions.allowMentorRateOverride}
                    onChange={(e) => handleInputChange('sessions', 'allowMentorRateOverride', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allowMentorRateOverride" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Allow Mentors to Override Default Rate
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium border-b border-gray-200 dark:border-gray-700 pb-2">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Enable Email Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    checked={settings.notifications.smsNotifications}
                    onChange={(e) => handleInputChange('notifications', 'smsNotifications', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Enable SMS Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="payoutNotifications"
                    checked={settings.notifications.payoutNotifications}
                    onChange={(e) => handleInputChange('notifications', 'payoutNotifications', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="payoutNotifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Send Payout Notifications to Mentors
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sessionReminders"
                    checked={settings.notifications.sessionReminders}
                    onChange={(e) => handleInputChange('notifications', 'sessionReminders', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="sessionReminders" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Send Session Reminders
                  </label>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-end gap-3">
            <Button 
              variant="outline"
              onClick={handleResetSettings}
              leftIcon={<RefreshCcw size={16} />}
            >
              Reset to Defaults
            </Button>
            <Button
              onClick={handleSaveSettings}
              leftIcon={<Save size={16} />}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;