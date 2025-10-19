import React, { useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const ProfileUpdateForm = () => {
    const { user, setUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        salary: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [fetching, setFetching] = useState(true);

    // Fetch latest user profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setFetching(true);
                const res = await API.get('/api/v1/auth/profile');
                const data = res.data.user;
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    password: '',
                    salary: data.salary || ''
                });
                setUser(data); // update context with fresh data
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch profile');
            } finally {
                setFetching(false);
            }
        };

        fetchProfile();
    }, [setUser]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await API.put('/api/v1/auth/update-profile', formData);
            setSuccess(res.data.message);
            setUser(res.data.user); // update context with updated user
            setFormData(prev => ({ ...prev, password: '' }));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-4 bg-white bg-opacity-50 backdrop-blur-md rounded-2xl mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Update Profile</h2>

            {error && (
                <div className="flex items-center bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-3">
                    <FiAlertCircle className="w-5 h-5 mr-2" /> {error}
                </div>
            )}

            {success && (
                <div className="flex items-center bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded mb-3">
                    <FiCheckCircle className="w-5 h-5 mr-2" /> {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Password (leave blank to keep)</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Salary</label>
                    <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                    {loading && (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    )}
                    <span>Update Profile</span>
                </button>
            </form>
        </div>
    );
};

export default ProfileUpdateForm;
