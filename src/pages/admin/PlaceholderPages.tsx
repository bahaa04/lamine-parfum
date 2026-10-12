// Simplified placeholder pages for remaining admin sections

import { Building2, Layers, RotateCcw, Settings, BarChart3, Activity, Database, Megaphone } from 'lucide-react';

export function Brands() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-ivory mb-1">Brands</h1>
        <p className="text-white/80">Manage perfume brands</p>
      </div>
      <div className="bg-obsidian rounded-lg border border-gold/20 p-16 text-center">
        <Building2 size={48} className="mx-auto text-white/80 mb-4" />
        <h3 className="text-lg font-semibold text-ivory mb-2">Brands Management</h3>
        <p className="text-white/80">Brand CRUD functionality - Coming soon</p>
      </div>
    </div>
  );
}

export function Collections() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-ivory mb-1">Collections</h1>
        <p className="text-white/80">Group products into curated collections</p>
      </div>
      <div className="bg-obsidian rounded-lg border border-gold/20 p-16 text-center">
        <Layers size={48} className="mx-auto text-white/80 mb-4" />
        <h3 className="text-lg font-semibold text-ivory mb-2">Collections Management</h3>
        <p className="text-white/80">Collection CRUD functionality - Coming soon</p>
      </div>
    </div>
  );
}

export function Returns() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-ivory mb-1">Returns & Refunds</h1>
        <p className="text-white/80">Manage return requests and refunds</p>
      </div>
      <div className="bg-obsidian rounded-lg border border-gold/20 p-16 text-center">
        <RotateCcw size={48} className="mx-auto text-white/80 mb-4" />
        <h3 className="text-lg font-semibold text-ivory mb-2">Returns Management</h3>
        <p className="text-white/80">Return request processing - Coming soon</p>
      </div>
    </div>
  );
}

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-ivory mb-1">Settings</h1>
        <p className="text-white/80">Configure store settings</p>
      </div>
      <div className="bg-obsidian rounded-lg border border-gold/20 p-16 text-center">
        <Settings size={48} className="mx-auto text-white/80 mb-4" />
        <h3 className="text-lg font-semibold text-ivory mb-2">Store Settings</h3>
        <p className="text-white/80">Settings configuration - Coming soon</p>
      </div>
    </div>
  );
}

export function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-ivory mb-1">Analytics</h1>
        <p className="text-white/80">View store performance and insights</p>
      </div>
      <div className="bg-obsidian rounded-lg border border-gold/20 p-16 text-center">
        <BarChart3 size={48} className="mx-auto text-white/80 mb-4" />
        <h3 className="text-lg font-semibold text-ivory mb-2">Analytics Dashboard</h3>
        <p className="text-white/80">Detailed analytics - Coming soon</p>
      </div>
    </div>
  );
}

export function ActivityLogs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-ivory mb-1">Activity Log</h1>
        <p className="text-white/80">View admin actions and system events</p>
      </div>
      <div className="bg-obsidian rounded-lg border border-gold/20 p-16 text-center">
        <Activity size={48} className="mx-auto text-white/80 mb-4" />
        <h3 className="text-lg font-semibold text-ivory mb-2">Activity Log</h3>
        <p className="text-white/80">Activity tracking - Coming soon</p>
      </div>
    </div>
  );
}

export function DataManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-ivory mb-1">Data Management</h1>
        <p className="text-white/80">Import and export data</p>
      </div>
      <div className="bg-obsidian rounded-lg border border-gold/20 p-16 text-center">
        <Database size={48} className="mx-auto text-white/80 mb-4" />
        <h3 className="text-lg font-semibold text-ivory mb-2">Data Management</h3>
        <p className="text-white/80">Import/Export functionality - Coming soon</p>
      </div>
    </div>
  );
}

export function Marketing() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-ivory mb-1">Marketing & Tracking</h1>
        <p className="text-white/80">Configure marketing pixels and tracking</p>
      </div>
      <div className="bg-obsidian rounded-lg border border-gold/20 p-16 text-center">
        <Megaphone size={48} className="mx-auto text-white/80 mb-4" />
        <h3 className="text-lg font-semibold text-ivory mb-2">Marketing Tools</h3>
        <p className="text-white/80">Marketing configuration - Coming soon</p>
      </div>
    </div>
  );
}
