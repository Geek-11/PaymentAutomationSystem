import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Users } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import MentorLayout from '@/components/layout/MentorLayout';
import ChatInterface from '@/components/chat/ChatInterface';
import { mockUsers } from '@/data/mockData';
import { mockMessages } from '@/data/mockMessages';
import toast from 'react-hot-toast';

const Chat = () => {
  const { userId } = useParams();
  const { user } = useAuth();

  const [selectedUserId, setSelectedUserId] = useState(userId || null);
  const [messages, setMessages] = useState([]);

  const chatUsers = user?.role === 'admin' 
    ? mockUsers.filter(u => u.role === 'mentor')
    : mockUsers.filter(u => u.role === 'admin');

  const selectedUser = selectedUserId 
    ? chatUsers.find(u => u.id === selectedUserId) || null
    : null;

  useEffect(() => {
    if (selectedUserId && user) {
      const filtered = mockMessages.filter(
        msg => 
          (msg.senderId === user.id && msg.recipientId === selectedUserId) ||
          (msg.senderId === selectedUserId && msg.recipientId === user.id)
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      setMessages(filtered);
    } else {
      setMessages([]);
    }
  }, [selectedUserId, user]);

  const handleSendMessage = (text, attachments) => {
    if (!selectedUserId || !user) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      recipientId: selectedUserId,
      text,
      attachments: attachments?.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      })),
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, newMessage]);
    toast.success('Message sent');
  };

  const Layout = user?.role === 'admin' ? AdminLayout : MentorLayout;

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Messages</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Communicate securely with {user?.role === 'admin' ? 'mentors' : 'administrators'}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div className="border-r border-gray-200 dark:border-gray-700 md:col-span-1">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium">{user?.role === 'admin' ? 'Mentors' : 'Support'}</h2>
            </div>

            <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
              {chatUsers.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {chatUsers.map((chatUser) => (
                    <li 
                      key={chatUser.id}
                      className={`px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        selectedUserId === chatUser.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => setSelectedUserId(chatUser.id)}
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold">
                            {chatUser.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{chatUser.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {chatUser.email}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No users found</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 md:col-span-3">
            {selectedUser ? (
              <ChatInterface 
                messages={messages}
                recipient={{
                  id: selectedUser.id,
                  name: selectedUser.name,
                  role: selectedUser.role,
                  isOnline: selectedUser.isActive
                }}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <Users className="h-16 w-16 mb-4 opacity-30" />
                <p className="text-lg font-medium mb-2">Select a conversation</p>
                <p className="text-sm">
                  Choose a {user?.role === 'admin' ? 'mentor' : 'administrator'} from the list to start chatting
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;