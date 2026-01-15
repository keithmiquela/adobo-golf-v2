import { useState, useEffect } from 'react';
import { getSeries, createSeries, updateSeries, deleteSeries } from '../../services/database';
import type { Series } from '../../types/database';

const SeriesManager = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    start_at: '',
    end_at: '',
  });

  useEffect(() => {
    loadSeries();
  }, []);

  const loadSeries = async () => {
    setLoading(true);
    const { data, error } = await getSeries();
    if (error) {
      console.error('Error loading series:', error);
      alert('Failed to load series');
    } else {
      setSeries(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const { error } = await updateSeries(editingId, formData);
      if (error) {
        console.error('Error updating series:', error);
        alert('Failed to update series');
      } else {
        alert('Series updated successfully!');
        resetForm();
        loadSeries();
      }
    } else {
      const { error } = await createSeries(formData);
      if (error) {
        console.error('Error creating series:', error);
        alert('Failed to create series');
      } else {
        alert('Series created successfully!');
        resetForm();
        loadSeries();
      }
    }
  };

  const handleEdit = (item: Series) => {
    setFormData({
      name: item.name,
      start_at: item.start_at,
      end_at: item.end_at,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this series?')) return;
    
    const { error } = await deleteSeries(id);
    if (error) {
      console.error('Error deleting series:', error);
      alert('Failed to delete series');
    } else {
      alert('Series deleted successfully!');
      loadSeries();
    }
  };

  const resetForm = () => {
    setFormData({ name: '', start_at: '', end_at: '' });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading series...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Series</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors"
        >
          Add New Series
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Series' : 'New Series'}
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
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.start_at}
                  onChange={(e) => setFormData({ ...formData, start_at: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.end_at}
                  onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
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

      {/* Series Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Start Date</th>
              <th className="px-4 py-3 text-left">End Date</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {series.map((item) => (
              <tr key={item.id} className="hover:bg-gray-750">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">
                  {new Date(item.start_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {new Date(item.end_at).toLocaleDateString()}
                </td>
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
        {series.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No series found. Add your first series!
          </div>
        )}
      </div>
    </div>
  );
};

export default SeriesManager;
