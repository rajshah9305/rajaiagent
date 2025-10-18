'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { UserProfile } from '@/types/ui';
import { PageWrapper } from '@/components/shared/PageWrapper';

interface ProfilePageProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  addNotification: (notification: any) => void;
}


export const ProfilePage: React.FC<ProfilePageProps> = ({ 
  userProfile, 
  setUserProfile, 
  addNotification 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile);

  const handleSave = () => {
    setUserProfile(editedProfile);
    setIsEditing(false);
    addNotification({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile has been updated successfully',
      time: 'Just now'
    });
  };

  return (
    <PageWrapper pageKey="profile">
      <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2">Profile</h2>
      <p className="text-gray-600 text-lg mb-8">Manage your account information</p>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/70 backdrop-blur-lg border border-black/10 rounded-xl p-6 sm:p-8 shadow-lg">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{userProfile.name}</h3>
              <p className="text-gray-600">{userProfile.email}</p>
              <p className="text-sm text-gray-500 mt-1">Member since {userProfile.joinDate}</p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-gray-700 block mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-2">Email</label>
                <input 
                  type="email" 
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-2">Company</label>
                <input 
                  type="text" 
                  value={editedProfile.company}
                  onChange={(e) => setEditedProfile({...editedProfile, company: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg"
                >
                  Save Changes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsEditing(false);
                    setEditedProfile(userProfile);
                  }}
                  className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Company</p>
                <p className="font-bold">{userProfile.company}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Account Type</p>
                <p className="font-bold">AWS Bedrock Professional</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg"
              >
                Edit Profile
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};
