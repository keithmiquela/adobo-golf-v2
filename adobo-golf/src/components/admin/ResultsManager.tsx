import { useState, useEffect } from 'react';
import { getResults, createResult, updateResult, deleteResult, getPlayers, getEvents } from '../../services/database';
import type { Result, Player, Event } from '../../types/database';

const ResultsManager = () => {
  const [results, setResults] = useState<any[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    player_id: 0,
    event_id: 0,
    points: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [resultsResult, playersResult, eventsResult] = await Promise.all([
      getResults(),
      getPlayers(),
      getEvents()
    ]);
    
    if (resultsResult.error) {
      console.error('Error loading results:', resultsResult.error);
      alert('Failed to load results');
    } else {
      setResults(resultsResult.data || []);
    }

    if (playersResult.error) {
      console.error('Error loading players:', playersResult.error);
    } else {
      setPlayers(playersResult.data || []);
    }

    if (eventsResult.error) {
      console.error('Error loading events:', eventsResult.error);
    } else {
      setEvents(eventsResult.data || []);
    }
    
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const { error } = await updateResult(editingId, formData);
      if (error) {
        console.error('Error updating result:', error);
        alert('Failed to update result');
      } else {
        alert('Result updated successfully!');
        resetForm();
        loadData();
      }
    } else {
      const { error } = await createResult(formData);
      if (error) {
        console.error('Error creating result:', error);
        alert('Failed to create result');
      } else {
        alert('Result created successfully!');
        resetForm();
        loadData();
      }
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      player_id: item.player_id,
      event_id: item.event_id,
      points: item.points,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this result?')) return;
    
    const { error } = await deleteResult(id);
    if (error) {
      console.error('Error deleting result:', error);
      alert('Failed to delete result');
    } else {
      alert('Result deleted successfully!');
      loadData();
    }
  };

  const resetForm = () => {
    setFormData({ player_id: 0, event_id: 0, points: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading results...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Results</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors"
        >
          Add New Result
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Result' : 'New Result'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Player</label>
                <select
                  required
                  value={formData.player_id}
                  onChange={(e) => setFormData({ ...formData, player_id: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select a player...</option>
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Event</label>
                <select
                  required
                  value={formData.event_id}
                  onChange={(e) => setFormData({ ...formData, event_id: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select an event...</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name} - {event.course_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Points</label>
                <input
                  type="number"
                  required
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Player</th>
              <th className="px-4 py-3 text-left">Event</th>
              <th className="px-4 py-3 text-left">Points</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {results.map((item) => (
              <tr key={item.id} className="hover:bg-gray-750">
                <td className="px-4 py-3">{item.player?.name || 'N/A'}</td>
                <td className="px-4 py-3">{item.event?.name || 'N/A'}</td>
                <td className="px-4 py-3">{item.points}</td>
                <td className="px-4 py-3">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {results.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No results found. Add your first result!
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsManager;
