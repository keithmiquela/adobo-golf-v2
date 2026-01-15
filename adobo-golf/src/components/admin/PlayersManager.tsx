import { useState, useEffect } from 'react';
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from '../../services/database';
import type { Player } from '../../types/database';

const PlayersManager = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ghin_no: '',
    handicap_index: 0,
  });

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    setLoading(true);
    const { data, error } = await getPlayers();
    if (error) {
      console.error('Error loading players:', error);
      alert('Failed to load players');
    } else {
      setPlayers(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const { error } = await updatePlayer(editingId, formData);
      if (error) {
        console.error('Error updating player:', error);
        alert('Failed to update player');
      } else {
        alert('Player updated successfully!');
        resetForm();
        loadPlayers();
      }
    } else {
      const { error } = await createPlayer(formData);
      if (error) {
        console.error('Error creating player:', error);
        alert('Failed to create player');
      } else {
        alert('Player created successfully!');
        resetForm();
        loadPlayers();
      }
    }
  };

  const handleEdit = (player: Player) => {
    setFormData({
      name: player.name,
      ghin_no: player.ghin_no,
      handicap_index: player.handicap_index,
    });
    setEditingId(player.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this player?')) return;
    
    const { error } = await deletePlayer(id);
    if (error) {
      console.error('Error deleting player:', error);
      alert('Failed to delete player');
    } else {
      alert('Player deleted successfully!');
      loadPlayers();
    }
  };

  const resetForm = () => {
    setFormData({ name: '', ghin_no: '', handicap_index: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading players...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Players</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors"
        >
          Add New Player
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Player' : 'New Player'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GHIN Number</label>
                <input
                  type="text"
                  required
                  value={formData.ghin_no}
                  onChange={(e) => setFormData({ ...formData, ghin_no: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Handicap Index</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.handicap_index}
                  onChange={(e) => setFormData({ ...formData, handicap_index: parseFloat(e.target.value) })}
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

      {/* Players Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">GHIN Number</th>
              <th className="px-4 py-3 text-left">Handicap Index</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {players.map((player) => (
              <tr key={player.id} className="hover:bg-gray-750">
                <td className="px-4 py-3">{player.name}</td>
                <td className="px-4 py-3">{player.ghin_no}</td>
                <td className="px-4 py-3">{player.handicap_index}</td>
                <td className="px-4 py-3">
                  {new Date(player.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(player)}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(player.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {players.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No players found. Add your first player!
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayersManager;
