import React from 'react'
import { FiClock, FiCalendar, FiLogOut, FiLogIn, FiChevronRight } from 'react-icons/fi'

const AttendanceTable = ({ data = [], loading }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 text-sm">Loading attendance records...</p>
                </div>
            </div>
        )
    }

    if (!data.length) {
        return (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 mx-4">
                <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-lg font-medium">No records yet</p>
                <p className="text-gray-400 text-sm mt-1">Attendance records will appear here once marked</p>
            </div>
        )
    }

    return (
        <div className="bg-white">
            {/* Mobile Header */}
            <div className="px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FiClock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Attendance History</h3>
                        <p className="text-sm text-gray-600">{data.length} records</p>
                    </div>
                </div>
            </div>

            {/* Desktop Table (hidden on mobile) */}
            <div className="hidden md:block">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <FiCalendar className="w-4 h-4" />
                                        <span>Date</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <FiLogIn className="w-4 h-4" />
                                        <span>Check In</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <FiLogOut className="w-4 h-4" />
                                        <span>Check Out</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <FiClock className="w-4 h-4" />
                                        <span>Duration</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((record) => (
                                <DesktopTableRow key={record._id} record={record} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards (visible on mobile) */}
            <div className="md:hidden">
                <div className="space-y-3 p-4">
                    {data.map((record) => (
                        <MobileAttendanceCard key={record._id} record={record} />
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <p className="text-sm text-gray-600 text-center sm:text-left">
                        Total <span className="font-semibold text-gray-900">{data.length}</span> records
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs">Checked In</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-xs">Checked Out</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Desktop Table Row Component
const DesktopTableRow = ({ record }) => {
    const duration = record.markIn && record.markOut
        ? calculateDuration(record.markIn, record.markOut)
        : null

    return (
        <tr className="hover:bg-blue-50 transition-colors duration-150">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                        {new Date(record.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                        {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {record.markIn ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-900 font-medium">
                            {new Date(record.markIn).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </span>
                    </div>
                ) : (
                    <span className="text-sm text-gray-400 italic">Not marked</span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {record.markOut ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-900 font-medium">
                            {new Date(record.markOut).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </span>
                    </div>
                ) : (
                    <span className="text-sm text-gray-400 italic">Not marked</span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {duration ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {duration}
                    </span>
                ) : record.markIn ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Still working
                    </span>
                ) : (
                    <span className="text-sm text-gray-400">-</span>
                )}
            </td>
        </tr>
    )
}

// Mobile Card Component
const MobileAttendanceCard = ({ record }) => {
    const duration = record.markIn && record.markOut
        ? calculateDuration(record.markIn, record.markOut)
        : null

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-colors duration-150">
            {/* Date Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <FiCalendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900">
                        {new Date(record.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                </div>
                <FiChevronRight className="w-4 h-4 text-gray-400" />
            </div>

            {/* Check In & Check Out */}
            <div className="grid grid-cols-2 gap-4 mb-3">
                {/* Check In */}
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-500 font-medium">CHECK IN</span>
                    </div>
                    {record.markIn ? (
                        <span className="text-sm font-medium text-gray-900 block">
                            {new Date(record.markIn).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </span>
                    ) : (
                        <span className="text-xs text-gray-400 italic">Not marked</span>
                    )}
                </div>

                {/* Check Out */}
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-gray-500 font-medium">CHECK OUT</span>
                    </div>
                    {record.markOut ? (
                        <span className="text-sm font-medium text-gray-900 block">
                            {new Date(record.markOut).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </span>
                    ) : (
                        <span className="text-xs text-gray-400 italic">Not marked</span>
                    )}
                </div>
            </div>

            {/* Duration & Status */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                {duration ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {duration} worked
                    </span>
                ) : record.markIn ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Still working
                    </span>
                ) : (
                    <span className="text-xs text-gray-400">No check-in</span>
                )}

                <span className="text-xs text-gray-500">
                    {new Date(record.date).toLocaleDateString('en-US', { year: 'numeric' })}
                </span>
            </div>
        </div>
    )
}

// Helper function to calculate duration between markIn and markOut
const calculateDuration = (markIn, markOut) => {
    const start = new Date(markIn)
    const end = new Date(markOut)
    const diffMs = end - start
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (hours === 0) {
        return `${minutes}m`
    }
    return `${hours}h ${minutes}m`
}

export default AttendanceTable