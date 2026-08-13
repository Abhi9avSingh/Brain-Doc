import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  User,
  Shield,
  Brain,
  Bell,
  Trash2,
  Check,
  Loader2,
  Camera,
} from 'lucide-react';

type SettingsTab = 'profile' | 'security' | 'ai' | 'notifications' | 'privacy';

const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
  { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
  { id: 'ai', label: 'AI Preferences', icon: <Brain className="h-4 w-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
  { id: 'privacy', label: 'Privacy', icon: <Shield className="h-4 w-4" /> },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        'relative h-6 w-11 rounded-full transition-colors',
        enabled ? 'bg-brand-600' : 'bg-ink-200',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
          enabled ? 'translate-x-5' : 'translate-x-0.5',
        )}
      />
    </button>
  );
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    processingAlerts: true,
    weeklyDigest: false,
    productUpdates: true,
    autoSummarize: true,
    citations: true,
    streamingResponses: true,
    privateIndexing: true,
    dataRetention: '90',
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1200);
  };

  return (
    <div className="workspace-settings flex flex-col gap-6 lg:flex-row">
      {/* Tabs sidebar */}
      <div className="lg:w-64 lg:shrink-0">
        <div className="card p-2">
          <div className="flex gap-1 overflow-x-auto lg:flex-col">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-500 hover:bg-ink-50 hover:text-ink-900',
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="card p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-ink-900">Profile</h3>
                <p className="mt-1 text-sm text-ink-500">Manage your account information</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-brand text-2xl font-bold text-white">
                    AM
                  </div>
                  <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white border border-ink-200 text-ink-600 shadow-sm transition-colors hover:bg-ink-50">
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  <h4 className="font-semibold text-ink-900">Alex Morgan</h4>
                  <p className="text-sm text-ink-500">alex.morgan@example.com</p>
                  <button className="mt-1 text-xs text-brand-600 hover:text-brand-700">Change avatar</button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-700">Full name</label>
                  <input type="text" defaultValue="Alex Morgan" className="input-field" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-700">Email</label>
                  <input type="email" defaultValue="alex.morgan@example.com" className="input-field" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-700">Organization</label>
                  <input type="text" placeholder="Your company" className="input-field" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-700">Role</label>
                  <select className="input-field">
                    <option>Individual</option>
                    <option>Team Member</option>
                    <option>Team Admin</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-ink-900">Security</h3>
                <p className="mt-1 text-sm text-ink-500">Keep your account secure</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-700">Current password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-700">New password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-700">Confirm new password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
              </div>

              <div className="rounded-xl bg-ink-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-900">Two-factor authentication</p>
                    <p className="text-xs text-ink-500">Add an extra layer of security</p>
                  </div>
                  <Toggle enabled={false} onChange={() => {}} />
                </div>
              </div>

              <div className="rounded-xl border border-error-200 bg-error-50 p-4">
                <h4 className="font-medium text-error-700">Danger Zone</h4>
                <p className="mt-1 text-sm text-error-600">Permanently delete your account and all data</p>
                <button className="mt-3 rounded-lg bg-error-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-error-600">
                  <Trash2 className="mr-1.5 inline h-3.5 w-3.5" />
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-ink-900">AI Preferences</h3>
                <p className="mt-1 text-sm text-ink-500">Configure how BrainDoc processes your queries</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">AI Model</label>
                <select className="input-field">
                  <option>BrainDoc Standard (Balanced)</option>
                  <option>BrainDoc Pro (Higher accuracy)</option>
                  <option>BrainDoc Lite (Faster responses)</option>
                </select>
                <p className="mt-1.5 text-xs text-ink-400">Higher accuracy models may consume more credits</p>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'autoSummarize', label: 'Auto-summarize documents', description: 'Generate AI summaries when documents are indexed' },
                  { key: 'citations', label: 'Show source citations', description: 'Include source references in AI responses' },
                  { key: 'streamingResponses', label: 'Stream responses', description: 'Display AI responses as they are generated' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between rounded-xl border border-ink-100 p-4">
                    <div>
                      <p className="text-sm font-medium text-ink-900">{item.label}</p>
                      <p className="text-xs text-ink-500">{item.description}</p>
                    </div>
                    <Toggle
                      enabled={settings[item.key as keyof typeof settings] as boolean}
                      onChange={() => toggleSetting(item.key as keyof typeof settings)}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Temperature (Creativity)</label>
                <input type="range" min="0" max="100" defaultValue="30" className="w-full accent-brand-600" />
                <div className="mt-1 flex justify-between text-xs text-ink-400">
                  <span>Precise</span>
                  <span>Balanced</span>
                  <span>Creative</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-ink-900">Notifications</h3>
                <p className="mt-1 text-sm text-ink-500">Manage how you receive updates</p>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'emailNotifications', label: 'Email notifications', description: 'Receive updates via email' },
                  { key: 'processingAlerts', label: 'Processing alerts', description: 'Get notified when documents are indexed' },
                  { key: 'weeklyDigest', label: 'Weekly digest', description: 'Summary of your activity every week' },
                  { key: 'productUpdates', label: 'Product updates', description: 'News about new features and improvements' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between rounded-xl border border-ink-100 p-4">
                    <div>
                      <p className="text-sm font-medium text-ink-900">{item.label}</p>
                      <p className="text-xs text-ink-500">{item.description}</p>
                    </div>
                    <Toggle
                      enabled={settings[item.key as keyof typeof settings] as boolean}
                      onChange={() => toggleSetting(item.key as keyof typeof settings)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-ink-900">Privacy</h3>
                <p className="mt-1 text-sm text-ink-500">Control your data and privacy settings</p>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-ink-100 p-4">
                <div>
                  <p className="text-sm font-medium text-ink-900">Private indexing</p>
                  <p className="text-xs text-ink-500">Documents are encrypted and never shared with third parties</p>
                </div>
                <Toggle
                  enabled={settings.privateIndexing}
                  onChange={() => toggleSetting('privateIndexing')}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Data retention period</label>
                <select
                  value={settings.dataRetention}
                  onChange={(e) => setSettings((prev) => ({ ...prev, dataRetention: e.target.value }))}
                  className="input-field"
                >
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">1 year</option>
                  <option value="forever">No limit</option>
                </select>
                <p className="mt-1.5 text-xs text-ink-400">How long to keep your indexed document data</p>
              </div>

              <div className="rounded-xl bg-ink-50 p-4">
                <h4 className="font-medium text-ink-900">Export your data</h4>
                <p className="mt-1 text-sm text-ink-500">Download all your documents and conversation history</p>
                <button className="btn-secondary mt-3 !py-2">
                  Request Data Export
                </button>
              </div>
            </div>
          )}

          {/* Save bar */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-ink-100 pt-4">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-success-600 animate-fade-in">
                <Check className="h-4 w-4" />
                Saved successfully
              </span>
            )}
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
