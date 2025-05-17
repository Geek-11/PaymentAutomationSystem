import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import MentorLayout from '@/components/layout/MentorLayout';
import Button from '@/components/common/Button';
import { Save, Lock, User, CreditCard, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const MentorProfile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    bio: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifyOnSession: true,
    notifyOnPayout: true
  });
  
  const [activeTab, setActiveTab] = useState('personal');
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.id));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfile({
            ...profile,
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            specialization: userData.specialization || '',
            bio: userData.bio || '',
            accountNumber: userData.paymentDetails?.accountNumber || '',
            bankName: userData.paymentDetails?.bankName || '',
            ifscCode: userData.paymentDetails?.ifscCode || '',
            notifyOnSession: userData.notifications?.sessions ?? true,
            notifyOnPayout: userData.notifications?.payouts ?? true
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);
  
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setProfile({
      ...profile,
      [name]: type === 'checkbox' ? e.target.checked : value
    });
  };
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        name: profile.name,
        phone: profile.phone,
        specialization: profile.specialization,
        bio: profile.bio,
        paymentDetails: {
          accountNumber: profile.accountNumber,
          bankName: profile.bankName,
          ifscCode: profile.ifscCode
        },
        notifications: {
          sessions: profile.notifyOnSession,
          payouts: profile.notifyOnPayout
        },
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };
  
  const handleChangePassword = () => {
    if (!profile.currentPassword) {
      toast.error('Current password is required');
      return;
    }
    
    if (profile.newPassword !== profile.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    // In a real app, this would change password via Firebase Auth
    toast.success('Password changed successfully');
    
    setProfile({
      ...profile,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  if (isLoading) {
    return (
      <MentorLayout>
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-500"></div>
        </div>
      </MentorLayout>
    );
  }
  
  return (
    <MentorLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your personal information and preferences
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'personal'
                  ? 'border-purple-600 text-purple-600 dark:border-purple-500 dark:text-purple-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <User size={16} className="inline-block mr-2" />
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'payment'
                  ? 'border-purple-600 text-purple-600 dark:border-purple-500 dark:text-purple-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <CreditCard size={16} className="inline-block mr-2" />
              Payment Details
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'security'
                  ? 'border-purple-600 text-purple-600 dark:border-purple-500 dark:text-purple-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Lock size={16} className="inline-block mr-2" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'notifications'
                  ? 'border-purple-600 text-purple-600 dark:border-purple-500 dark:text-purple-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <MessageSquare size={16} className="inline-block mr-2" />
              Notifications
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {/* Personal Information */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="h-24 w-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xl font-semibold">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
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
                    value={profile.email}
                    readOnly
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-gray-100 px-3 py-2"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
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
                    value={profile.specialization}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={profile.bio}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
          
          {/* Payment Details */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium mb-4">Bank Account Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={profile.accountNumber}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={profile.bankName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    id="ifscCode"
                    name="ifscCode"
                    value={profile.ifscCode}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
                  />
                </div>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Note: Your bank details are securely stored and only used for processing your payments.
              </p>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>
                  <Save size={16} className="mr-2" />
                  Save Payment Details
                </Button>
              </div>
            </div>
          )}
          
          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium mb-4">Change Password</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={profile.currentPassword}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={profile.newPassword}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={profile.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleChangePassword}>
                  <Lock size={16} className="mr-2" />
                  Change Password
                </Button>
              </div>
            </div>
          )}
          
          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium mb-4">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyOnSession"
                    name="notifyOnSession"
                    checked={profile.notifyOnSession}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notifyOnSession" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Notify me about new session assignments
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyOnPayout"
                    name="notifyOnPayout"
                    checked={profile.notifyOnPayout}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notifyOnPayout" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Notify me about new payouts
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>
                  <Save size={16} className="mr-2" />
                  Save Preferences
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MentorLayout>
  );
};

export default MentorProfile;