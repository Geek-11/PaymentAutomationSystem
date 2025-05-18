import { useState, useRef, useEffect } from 'react';
import { Send, FileText, PaperclipIcon } from 'lucide-react';
import Button from '@/components/common/Button';
import { formatDate } from '@/utils/format';

const ChatInterface = ({
  messages,
  recipient,
  onSendMessage
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = () => {
    if (newMessage.trim() || attachments.length > 0) {
      onSendMessage(newMessage, attachments);
      setNewMessage('');
      setAttachments([]);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };
  
  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };
  
  return (
    <div className="flex flex-col h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Chat header */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold">
            {recipient.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div className="ml-3">
          <div className="text-base font-medium">{recipient.name}</div>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <div className={`h-2 w-2 rounded-full mr-2 ${recipient.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            {recipient.isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId !== recipient.id;
              const showDate = 
                index === 0 || 
                new Date(message.timestamp).toDateString() !== 
                new Date(messages[index - 1].timestamp).toDateString();
              
              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <div className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                        {formatDate(message.timestamp)}
                      </div>
                    </div>
                  )}
                  <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${isCurrentUser ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'} rounded-lg px-4 py-3 shadow`}>
                      {message.text && <p className="whitespace-pre-wrap break-words mb-1">{message.text}</p>}
                      
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2">
                          {message.attachments.map((attachment, i) => (
                            <div 
                              key={i} 
                              className="flex items-center text-sm bg-blue-700/20 dark:bg-blue-300/10 p-2 rounded mt-1"
                            >
                              <FileText size={14} className="mr-2" />
                              <span className="truncate">{attachment.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>No messages yet.</p>
              <p className="text-sm">Start the conversation by sending a message.</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="p-2 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div 
                key={index}
                className="flex items-center bg-white dark:bg-gray-700 px-2 py-1 rounded text-xs"
              >
                <FileText size={12} className="mr-1" />
                <span className="truncate max-w-[100px]">{file.name}</span>
                <button 
                  onClick={() => removeAttachment(index)}
                  className="ml-1 text-gray-500 hover:text-red-500"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Message input */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 resize-none"
              placeholder="Type your message..."
              rows={2}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="absolute bottom-2 right-2">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <PaperclipIcon size={16} />
              </label>
            </div>
          </div>
          <Button 
            onClick={handleSend}
            disabled={!newMessage.trim() && attachments.length === 0}
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;