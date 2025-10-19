import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { FiUser, FiMail, FiBriefcase, FiDollarSign, FiCalendar, FiSave, FiEdit } from 'react-icons/fi'
import API from '../api/axios'
import WorkSummary from '../components/WorkSummary'

const UserProfile = () => {
    const { user, setUser } = useContext(AuthContext)
    const [editMode, setEditMode] = useState(false)
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        salary: user?.salary || ''
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

    const handleUpdate = async () => {
        try {
            setLoading(true)
            setError(null)
            setSuccess(null)

            const res = await API.post('/api/v1/auth/update-profile', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })

            const updatedUser = res.data.data.user
            setUser(updatedUser)
            setSuccess('Profile updated successfully!')
            setEditMode(false)
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed')
        } finally {
            setLoading(false)
        }
    }

    const memberSince = new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    })

    return (
        <div className="bg-gradient-to-br  flex flex-col items-center justify-center ">
            <div className="w-full max-w-md h-[80vh] sm:max-w-lg border border-gray-100 rounded-xl shadow">
                <div className="bg-white bg-opacity-30 backdrop-blur-md rounded-3xl py-2 w-full">
                    {/* Avatar & Basic Info */}
                    <div className="flex flex-col items-center space-y-4 mb-6">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>

                        <div>
                            {/* Messages */}
                            {success && <p className="text-green-600 mt-2 text-center">{success}</p>}
                            {error && <p className="text-red-600 mt-2 text-center">{error}</p>}

                            {/* Edit / Save Button */}
                            <div className='flex justify-between items-center  gap-4'>
                                <h2 className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {user?.name}
                                </h2>
                                <button
                                    onClick={editMode ? handleUpdate : () => setEditMode(true)}
                                    disabled={loading}
                                    className="w-full  py-2 px-4 rounded-2xl text-white bg-gradient-to-r from-blue-600 to-purple-600 transition-all"
                                >
                                    {editMode ? (
                                        <span className="flex items-center justify-center space-x-2">
                                            <FiSave /> <span>Save Profile</span>
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center space-x-2">
                                            <FiEdit /> <span>Edit Profile</span>
                                        </span>
                                    )}
                                </button>
                                <p className="text-gray-600 capitalize text-center">{user?.role}</p>
                            </div>

                        </div>

                        <div className="flex items-center text-gray-500 text-sm">
                            <FiCalendar className="w-4 h-4 mr-1" /> Member since {memberSince}
                        </div>
                    </div>

                    {/* Profile Fields */}
                    <div className="space-y-4 px-2">
                        {['name', 'email', 'salary'].map((field) => (
                            <div key={field} className="flex items-center space-x-4 bg-white/20 p-3 rounded-xl border border-white/25">
                                <div>
                                    {field === 'name' && <FiUser className="w-5 h-5 text-gray-700" />}
                                    {field === 'email' && <FiMail className="w-5 h-5 text-blue-600" />}
                                    {field === 'salary' && <FiDollarSign className="w-5 h-5 text-green-600" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 capitalize">{field}</p>
                                    {editMode ? (
                                        <input
                                            type={field === 'salary' ? 'number' : 'text'}
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border-b border-gray-300 focus:outline-none text-gray-900"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium">{user[field] || 'N/A'}</p>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Role */}
                        <div className="flex items-center space-x-4 bg-white/20 p-3 rounded-xl border border-white/25">
                            <FiBriefcase className="w-5 h-5 text-purple-600" />
                            <div>
                                <p className="text-sm text-gray-600">Role</p>
                                <p className="text-gray-900 font-medium capitalize">{user?.role}</p>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

        </div>
    )
}

export default UserProfile
