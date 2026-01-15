import { useState } from 'react';
import PlayersManager from '../components/admin/PlayersManager';
import SeriesManager from '../components/admin/SeriesManager';
import EventsManager from '../components/admin/EventsManager';
import ResultsManager from '../components/admin/ResultsManager';
import PhotosManager from '../components/admin/PhotosManager';

type Tab = 'players' | 'series' | 'events' | 'results' | 'photos';

const Admin = () => {
  const [activeTab, setActiveTab] = useState<Tab>('players');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'players', label: 'Players' },
    { id: 'series', label: 'Series' },
    { id: 'events', label: 'Events' },
    { id: 'results', label: 'Results' },
    { id: 'photos', label: 'Photos' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Database Admin</h1>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white rounded-t-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800 rounded-lg p-6">
          {activeTab === 'players' && <PlayersManager />}
          {activeTab === 'series' && <SeriesManager />}
          {activeTab === 'events' && <EventsManager />}
          {activeTab === 'results' && <ResultsManager />}
          {activeTab === 'photos' && <PhotosManager />}
        </div>
      </div>
    </div>
  );
};

export default Admin;
