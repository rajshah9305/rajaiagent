'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Save, Check, SlidersHorizontal, Bell, ShieldCheck } from 'lucide-react';
import { Settings } from '@/types/ui';
import { useAPI } from '@/hooks/useAPI';
import { PageWrapper } from '@/components/shared/PageWrapper';

interface SettingsPageProps {
  addNotification: (notification: any) => void;
}


export const SettingsPage: React.FC<SettingsPageProps> = ({ addNotification }) => {
  const [settings, setSettings] = useState<Settings>({
    awsAccessKeyId: '',
    awsSecretAccessKey: '',
    awsRegion: 'us-east-1',
    bedrockRoleArn: '',
    enableEmailNotifications: true,
    enableSlackNotifications: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const api = useAPI();

  const loadSettings = useCallback(async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await api.updateSettings(settings);
      setShowSuccess(true);
      addNotification({
        type: 'success',
        title: 'Settings Saved',
        message: 'Your AWS configuration has been updated',
        time: 'Just now'
      });
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save settings',
        time: 'Just now'
      });
    } finally {
      setIsSaving(false);
    }
  }, [settings, api, addNotification]);

  if (isLoading) {
    return (
      <PageWrapper pageKey="settings">
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper pageKey="settings">
      <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2">Settings</h2>
      <p className="text-gray-600 text-lg mb-8">Configure AWS Bedrock and application preferences</p>
      
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="bg-white/70 backdrop-blur-lg border border-black/10 rounded-xl p-6 sm:p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <SlidersHorizontal className="w-6 h-6 mr-3 text-emerald-600"/>
            AWS Bedrock Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="font-bold text-gray-700 block mb-2">AWS Access Key ID</label>
              <input 
                type="text" 
                value={settings.awsAccessKeyId}
                onChange={(e) => setSettings({...settings, awsAccessKeyId: e.target.value})}
                placeholder="AKIAIOSFODNN7EXAMPLE" 
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-2">AWS Secret Access Key</label>
              <input 
                type="password" 
                value={settings.awsSecretAccessKey}
                onChange={(e) => setSettings({...settings, awsSecretAccessKey: e.target.value})}
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" 
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-2">AWS Region</label>
              <select 
                value={settings.awsRegion}
                onChange={(e) => setSettings({...settings, awsRegion: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="us-east-1">US East (N. Virginia)</option>
                <option value="us-west-2">US West (Oregon)</option>
                <option value="eu-west-1">EU (Ireland)</option>
                <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                <option value="ap-northeast-1">Asia Pacific (Tokyo)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-2">Bedrock IAM Role ARN</label>
              <input 
                type="text" 
                value={settings.bedrockRoleArn}
                onChange={(e) => setSettings({...settings, bedrockRoleArn: e.target.value})}
                placeholder="arn:aws:iam::123456789012:role/BedrockAgentRole" 
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-sm text-gray-600 mt-2">Required for agent creation and execution</p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-lg border border-black/10 rounded-xl p-6 sm:p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <Bell className="w-6 h-6 mr-3 text-emerald-600"/>
            Notification Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-bold text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive execution updates via email</p>
              </div>
              <button
                onClick={() => setSettings({...settings, enableEmailNotifications: !settings.enableEmailNotifications})}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  settings.enableEmailNotifications ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.enableEmailNotifications ? 'translate-x-7' : 'translate-x-0'
                }`}></span>
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-bold text-gray-900">Slack Notifications</p>
                <p className="text-sm text-gray-600">Send alerts to Slack channel</p>
              </div>
              <button
                onClick={() => setSettings({...settings, enableSlackNotifications: !settings.enableSlackNotifications})}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  settings.enableSlackNotifications ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.enableSlackNotifications ? 'translate-x-7' : 'translate-x-0'
                }`}></span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg flex items-center space-x-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Configuration</span>
              </>
            )}
          </motion.button>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 text-emerald-600"
            >
              <Check className="w-5 h-5" />
              <span className="font-semibold">Saved successfully!</span>
            </motion.div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900 mb-2">Security Notice</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                Your AWS credentials are stored securely as environment variables. Never commit credentials to version control. For production deployments, use environment variables in your hosting platform (e.g., Vercel, AWS Systems Manager).
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};