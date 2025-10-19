import React, { useEffect, useState } from 'react'
import API from '../api/axios'

const AdminPanel = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchUsers = async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await API.get('/api/v1/admin/users')
            setUsers(res.data.data)
        } catch (err) {
            setError('Failed to fetch users')
            console.error('Error fetching users:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="glassmorphism p-8 rounded-2xl backdrop-blur-lg border border-white/30 shadow-lg">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-gray-600 mt-4 text-center">Loading users...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="glassmorphism-error backdrop-blur-lg border border-red-200/50 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3 flex-1">
                                <h3 className="text-lg font-semibold text-red-800">Error</h3>
                                <p className="text-red-700 mt-2">{error}</p>
                                <button
                                    onClick={fetchUsers}
                                    className="mt-4 glassmorphism-error-btn text-red-800 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <div className="glassmorphism backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-lg">
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Admin Panel
                        </h1>
                        <p className="text-gray-600 mt-2">Manage system users and their roles</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                    <div className="glassmorphism backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="p-3 bg-blue-500/20 rounded-xl backdrop-blur-sm">
                                    <svg className="h-6 w-6 md:h-8 md:w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-xl md:text-2xl font-semibold text-gray-900">{users.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="glassmorphism backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="p-3 bg-green-500/20 rounded-xl backdrop-blur-sm">
                                    <svg className="h-6 w-6 md:h-8 md:w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Admins</p>
                                <p className="text-xl md:text-2xl font-semibold text-gray-900">
                                    {users.filter(u => u.role === 'admin').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="glassmorphism backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="p-3 bg-purple-500/20 rounded-xl backdrop-blur-sm">
                                    <svg className="h-6 w-6 md:h-8 md:w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Users</p>
                                <p className="text-xl md:text-2xl font-semibold text-gray-900">
                                    {users.filter(u => u.role === 'user').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="glassmorphism backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg overflow-hidden">
                    <div className="px-4 md:px-6 py-4 border-b border-white/30 bg-white/50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold text-gray-800">User Management</h2>
                                <p className="text-gray-600 text-sm mt-1">All registered users in the system</p>
                            </div>
                            <button
                                onClick={fetchUsers}
                                className="glassmorphism-btn backdrop-blur-sm border border-white/50 px-4 py-2 text-sm font-medium rounded-xl text-white transition-all duration-200 hover:scale-105 active:scale-95 self-start sm:self-auto"
                            >
                                <div className="flex items-center justify-center">
                                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Refresh
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/50 backdrop-blur-sm">
                                <tr>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xs:table-cell">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/30">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-white/30 transition-all duration-200">
                                        <td className="px-4 md:px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                                    <span className="text-white font-medium text-sm">
                                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500 sm:hidden">{user.email}</div>
                                                    <div className="text-xs text-gray-400 mt-1">ID: {user._id.slice(-8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm border border-white/30 ${user.role === 'admin'
                                                ? 'bg-red-500/20 text-red-700'
                                                : user.role === 'moderator'
                                                    ? 'bg-purple-500/20 text-purple-700'
                                                    : 'bg-green-500/20 text-green-700'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden xs:table-cell">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-700 backdrop-blur-sm border border-white/30">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="px-4 md:px-6 py-4 border-t border-white/30 bg-white/50 backdrop-blur-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{users.length}</span> users
                            </p>
                            <div className="flex space-x-2 self-end sm:self-auto">
                                <button className="glassmorphism-btn-secondary backdrop-blur-sm border border-white/50 px-3 py-1 text-sm rounded-xl transition-all duration-200 hover:scale-105 active:scale-95">
                                    Previous
                                </button>
                                <button className="glassmorphism-btn-secondary backdrop-blur-sm border border-white/50 px-3 py-1 text-sm rounded-xl transition-all duration-200 hover:scale-105 active:scale-95">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add these styles to your global CSS or use a CSS-in-JS solution */}
            <style jsx>{`
                .glassmorphism {
                    background: rgba(255, 255, 255, 0.25);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.18);
                }
                
                .glassmorphism-error {
                    background: rgba(254, 226, 226, 0.7);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(254, 226, 226, 0.5);
                }
                
                .glassmorphism-error-btn {
                    background: rgba(254, 226, 226, 0.8);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(254, 226, 226, 0.6);
                }
                
                .glassmorphism-btn {
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8));
                    backdrop-filter: blur(10px);
                }
                
                .glassmorphism-btn-secondary {
                    background: rgba(255, 255, 255, 0.3);
                    backdrop-filter: blur(10px);
                    color: rgba(55, 65, 81, 1);
                }
                
                @media (max-width: 480px) {
                    .xs\\:table-cell {
                        display: table-cell;
                    }
                }
                
                @media (max-width: 640px) {
                    .xs\\:table-cell {
                        display: none;
                    }
                }
            `}</style>
        </div>
    )
}

export default AdminPanel