import React, { useContext, useState, useEffect } from 'react'
import API from '../api/axios'
import { AuthContext } from '../context/AuthContext'
import AttendanceTable from '../components/AttendanceTable'
import { FiUser, FiClock, FiLogIn, FiLogOut, FiAlertCircle, FiCheckCircle, FiRefreshCw } from 'react-icons/fi'

const Dashboard = () => {
    const { user } = useContext(AuthContext)
    const [attendance, setAttendance] = useState([])
    const [loading, setLoading] = useState(false)
    const [markLoading, setMarkLoading] = useState(null)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const fetchAttendance = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await API.get('/api/v1/attendance')
            setAttendance(res.data.data)
        } catch (err) {
            setError('Failed to load attendance records')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAttendance()
    }, [])

    const handleMarkIn = async () => {
        setMarkLoading('in')
        setError(null)
        setSuccess(null)
        try {
            await API.post('/api/v1/attendance/mark-in')
            setSuccess('Successfully marked in for today!')
            fetchAttendance()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to mark in. Please try again.')
        } finally {
            setMarkLoading(null)
        }
    }

    const handleMarkOut = async () => {
        setMarkLoading('out')
        setError(null)
        setSuccess(null)
        try {
            await API.post('/api/v1/attendance/mark-out')
            setSuccess('Successfully marked out for today!')
            fetchAttendance()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to mark out. Please try again.')
        } finally {
            setMarkLoading(null)
        }
    }

    const clearMessages = () => {
        setError(null)
        setSuccess(null)
    }

    // Auto-clear messages after 5 seconds
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(clearMessages, 5000)
            return () => clearTimeout(timer)
        }
    }, [error, success])

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                            <div className="w-16 h-16 bg-white text-blue-500 bg-opacity-20 rounded-2xl flex items-center justify-center">
                                <FiUser className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
                                <p className="text-blue-100 opacity-90 capitalize">Role: {user.role}</p>
                            </div>
                        </div>

                        {/* Current Time Display */}
                        <div className="bg-white text-blue-500 bg-opacity-10 rounded-lg px-4 py-3 text-center">
                            <div className="flex items-center justify-center space-x-2 mb-1">
                                <FiClock className="w-4 h-4" />
                                <span className="text-sm font-medium">Current Time</span>
                            </div>
                            <div className="text-lg font-mono font-bold">
                                {new Date().toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: true
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages Section */}
                <div className="space-y-3">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3 animate-fade-in">
                            <div className="flex-shrink-0">
                                <FiAlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-red-800 text-sm font-medium">{error}</p>
                            </div>
                            <button
                                onClick={clearMessages}
                                className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
                            >
                                <FiAlertCircle className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start space-x-3 animate-fade-in">
                            <div className="flex-shrink-0">
                                <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-green-800 text-sm font-medium">{success}</p>
                            </div>
                            <button
                                onClick={clearMessages}
                                className="flex-shrink-0 text-green-500 hover:text-green-700 transition-colors"
                            >
                                <FiCheckCircle className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mark In Card */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <FiLogIn className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Mark In</h3>
                                <p className="text-sm text-gray-500">Start your work day</p>
                            </div>
                        </div>
                        <button
                            onClick={handleMarkIn}
                            disabled={markLoading}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none"
                        >
                            {markLoading === 'in' ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Marking In...</span>
                                </>
                            ) : (
                                <>
                                    <FiLogIn className="w-5 h-5" />
                                    <span>Mark In</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Mark Out Card */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                <FiLogOut className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Mark Out</h3>
                                <p className="text-sm text-gray-500">End your work day</p>
                            </div>
                        </div>
                        <button
                            onClick={handleMarkOut}
                            disabled={markLoading}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none"
                        >
                            {markLoading === 'out' ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Marking Out...</span>
                                </>
                            ) : (
                                <>
                                    <FiLogOut className="w-5 h-5" />
                                    <span>Mark Out</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Attendance History Section */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FiClock className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">Attendance History</h3>
                                    <p className="text-sm text-gray-500">Your daily check-in and check-out records</p>
                                </div>
                            </div>
                            <button
                                onClick={fetchAttendance}
                                disabled={loading}
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                            >
                                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        <AttendanceTable data={attendance} loading={loading} />
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-blue-600">{attendance.length}</div>
                        <div className="text-xs text-gray-500 mt-1">Total Records</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {attendance.filter(a => a.markIn && a.markOut).length}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Completed Days</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                            {attendance.filter(a => a.markIn && !a.markOut).length}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Pending Mark Out</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-red-600">
                            {attendance.filter(a => !a.markIn).length}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Absent Days</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard