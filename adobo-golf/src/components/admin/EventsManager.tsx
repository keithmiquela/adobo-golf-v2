import { useState, useEffect } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent, getSeries } from '../../services/database';
import type { Event, Series } from '../../types/database';

const EventsManager = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    course_name: '',
    start_at: '',
    end_at: '',
    series_id: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [eventsResult, seriesResult] = await Promise.all([
      getEvents(),
      getSeries()
    ]);
    
    if (eventsResult.error) {
      console.error('Error loading events:', eventsResult.error);
      alert('Failed to load events');
    } else {
      setEvents(eventsResult.data || []);
    }

    if (seriesResult.error) {
      console.error('Error loading series:', seriesResult.error);
    } else {
      setSeriesList(seriesResult.data || []);
    }
    
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const { error } = await updateEvent(editingId, formData);
      if (error) {
        console.error('Error updating event:', error);
        alert('Failed to update event');
      } else {
        alert('Event updated successfully!');
        resetForm();
        loadData();
      }
    } else {
      const { error } = await createEvent(formData);
      if (error) {
        console.error('Error creating event:', error);
        alert('Failed to create event');
      } else {
        alert('Event created successfully!');
        resetForm();
        loadData();
      }
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      name: item.name,
      course_name: item.course_name,
      start_at: item.start_at,
      end_at: item.end_at,
      series_id: item.series_id,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    const { error } = await deleteEvent(id);
    if (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    } else {
      alert('Event deleted successfully!');
      loadData();
    }
  };

  const resetForm = () => {
    setFormData({ name: '', course_name: '', start_at: '', end_at: '', series_id: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Events</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors"
        >
          Add New Event
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Event' : 'New Event'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  value={formData.course_name}
                  onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Series</label>
                <select
                  required
                  value={formData.series_id}
                  onChange={(e) => setFormData({ ...formData, series_id: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select a series...</option>
                  {seriesList.map((series) => (
                    <option key={series.id} value={series.id}>
                      {series.name}
                    </option>
                  ))}
                </select>
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

      {/* Events Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Event Name</th>
              <th className="px-4 py-3 text-left">Course</th>
              <th className="px-4 py-3 text-left">Series</th>
              <th className="px-4 py-3 text-left">Start Date</th>
              <th className="px-4 py-3 text-left">End Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {events.map((item) => (
              <tr key={item.id} className="hover:bg-gray-750">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.course_name}</td>
                <td className="px-4 py-3">{item.series?.name || 'N/A'}</td>
                <td className="px-4 py-3">
                  {new Date(item.start_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {new Date(item.end_at).toLocaleDateString()}
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
        {events.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No events found. Add your first event!
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsManager;
