import React from "react";
import { FiClock, FiCalendar, FiLogIn, FiLogOut } from "react-icons/fi";

const AttendanceTable = ({ data = [], loading }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    if (!data.length) {
        return (
            <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50 mx-4">
                <FiCalendar className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-base font-medium">No records yet</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-3">
            {data.map((record) => {
                const duration =
                    record.markIn && record.markOut
                        ? calculateDuration(record.markIn, record.markOut)
                        : null;

                return (
                    <div
                        key={record._id}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                    >
                        {/* Date */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <FiCalendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-semibold text-gray-900">
                                    {new Date(record.date).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                            <span className="text-xs text-gray-400">
                                {new Date(record.date).getFullYear()}
                            </span>
                        </div>

                        {/* Check In / Out */}
                        <div className="flex justify-between text-sm mb-2">
                            <div>
                                <div className="flex items-center space-x-1">
                                    <FiLogIn className="w-4 h-4 text-green-500" />
                                    <span className="text-gray-500">In:</span>
                                </div>
                                <p className="font-medium text-gray-800 ml-5">
                                    {record.markIn
                                        ? formatTime(record.markIn)
                                        : "Not marked"}
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center space-x-1">
                                    <FiLogOut className="w-4 h-4 text-blue-500" />
                                    <span className="text-gray-500">Out:</span>
                                </div>
                                <p className="font-medium text-gray-800 ml-5">
                                    {record.markOut
                                        ? formatTime(record.markOut)
                                        : "Not marked"}
                                </p>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="pt-2 border-t border-gray-100">
                            {duration ? (
                                <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    {duration} worked
                                </span>
                            ) : record.markIn ? (
                                <span className="text-xs font-medium bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                    Still working
                                </span>
                            ) : (
                                <span className="text-xs text-gray-400">No check-in</span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Helper functions
const calculateDuration = (markIn, markOut) => {
    const start = new Date(markIn);
    const end = new Date(markOut);
    const diffMs = end - start;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours === 0) return `${minutes}m`;
    return `${hours}h ${minutes}m`;
};

const formatTime = (time) =>
    new Date(time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

export default AttendanceTable;
