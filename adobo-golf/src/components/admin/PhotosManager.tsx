import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { getPhotos, createPhoto, updatePhoto, deletePhoto, getEvents } from '../../services/database';
import { uploadImage } from '../../services/storage/client';
import { createSupabaseClient } from '../../services/supabase';
import type { Photo } from '../../types/database';

const PhotosManager = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    event_id: 0,
    storage_bucket: 'photos',
    storage_path: '',
  });
  
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [photosResult, eventsResult] = await Promise.all([
      getPhotos(),
      getEvents()
    ]);
    
    if (photosResult.error) {
      console.error('Error loading photos:', photosResult.error);
      alert('Failed to load photos');
    } else {
      setPhotos(photosResult.data || []);
    }

    if (eventsResult.error) {
      console.error('Error loading events:', eventsResult.error);
    } else {
      setEvents(eventsResult.data || []);
    }
    
    setLoading(false);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let storagePath = formData.storage_path;

      // If we have a new image, upload it
      if (imageInputRef.current?.files?.[0]) {
        const file = imageInputRef.current.files[0];
        const { imageUrl, error } = await uploadImage({
          file,
          bucket: formData.storage_bucket,
          folder: 'event-photos'
        });

        if (error) {
          alert('Failed to upload image: ' + error);
          setUploading(false);
          return;
        }

        // Extract the path from the URL
        const urlParts = imageUrl.split(`/${formData.storage_bucket}/`);
        storagePath = urlParts[1] || imageUrl;
      }

      const photoData = {
        ...formData,
        storage_path: storagePath,
      };

      if (editingId) {
        const { error } = await updatePhoto(editingId, photoData);
        if (error) {
          console.error('Error updating photo:', error);
          alert('Failed to update photo');
        } else {
          alert('Photo updated successfully!');
          resetForm();
          loadData();
        }
      } else {
        const { error } = await createPhoto(photoData);
        if (error) {
          console.error('Error creating photo:', error);
          alert('Failed to create photo');
        } else {
          alert('Photo created successfully!');
          resetForm();
          loadData();
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }

    setUploading(false);
  };

  const handleEdit = (item: any) => {
    setFormData({
      name: item.name,
      event_id: item.event_id,
      storage_bucket: item.storage_bucket,
      storage_path: item.storage_path,
    });
    setEditingId(item.id);
    setShowForm(true);
    
    // Show the existing image
    const imageUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${item.storage_bucket}/${item.storage_path}`;
    setImagePreview(imageUrl);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this photo? The image file will remain in storage.')) return;
    
    const { error } = await deletePhoto(id);
    if (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo');
    } else {
      alert('Photo deleted successfully!');
      loadData();
    }
  };

  const resetForm = () => {
    setFormData({ name: '', event_id: 0, storage_bucket: 'photos', storage_path: '' });
    setEditingId(null);
    setShowForm(false);
    setImagePreview('');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const getImageUrl = (photo: any) => {
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${photo.storage_bucket}/${photo.storage_path}`;
  };

  if (loading) {
    return <div className="text-center py-8">Loading photos...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Photos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors"
        >
          Add New Photo
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md my-8">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Photo' : 'New Photo'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Photo Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
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
                <label className="block text-sm font-medium mb-1">
                  {editingId ? 'Replace Image (optional)' : 'Image File'}
                </label>
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  required={!editingId}
                  onChange={handleImageChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              {imagePreview && (
                <div>
                  <label className="block text-sm font-medium mb-1">Preview</label>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded"
                  />
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={uploading}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {photos.map((item) => (
          <div key={item.id} className="bg-gray-700 rounded-lg overflow-hidden">
            <img
              src={getImageUrl(item)}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold mb-1 truncate">{item.name}</h3>
              <p className="text-sm text-gray-400 mb-2 truncate">
                {item.event?.name || 'No event'}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {photos.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No photos found. Add your first photo!
        </div>
      )}
    </div>
  );
};

export default PhotosManager;
