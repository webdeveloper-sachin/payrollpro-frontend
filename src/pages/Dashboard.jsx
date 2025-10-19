import React, { useContext, useState, useEffect } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import AttendanceTable from "../components/AttendanceTable";
import {
    FiUser,
    FiClock,
    FiLogIn,
    FiLogOut,
    FiRefreshCw,
    FiCheckCircle,
    FiAlertCircle,
} from "react-icons/fi";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [markLoading, setMarkLoading] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [currentTime, setCurrentTime] = useState("");

    const fetchAttendance = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get("/api/v1/attendance");
            setAttendance(res.data.data);
        } catch (err) {
            setError("Failed to load attendance records");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const handleMarkIn = async () => {
        setMarkLoading("in");
        setError(null);
        setSuccess(null);
        try {
            await API.post("/api/v1/attendance/mark-in");
            setSuccess("Marked In successfully!");
            fetchAttendance();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to mark in");
        } finally {
            setMarkLoading(null);
        }
    };

    const handleMarkOut = async () => {
        setMarkLoading("out");
        setError(null);
        setSuccess(null);
        try {
            await API.post("/api/v1/attendance/mark-out");
            setSuccess("Marked Out successfully!");
            fetchAttendance();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to mark out");
        } finally {
            setMarkLoading(null);
        }
    };

    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError(null);
                setSuccess(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    const time = () => {
        let date = new Date();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let seconds = date.getSeconds();
        let AM_PM = hour < 12 ? "AM" : "PM"
        let timer = `${hour < 10 ? `0${hour}` : hour} :${minute < 10 ? `0${minute}` : minute} :${seconds < 10 ? `0${seconds}` : seconds} ${AM_PM}`;
        return timer
    }

    useEffect(() => {
        setCurrentTime(time());
        const timer = setInterval(() => {
            setCurrentTime(time());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-3 space-y-4">
            {/* Header */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiUser className="text-blue-600 w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-800">
                            Hello, {user.name}
                        </h1>
                        <p className="text-xs text-gray-500 capitalize">
                            Role: {user.role}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FiClock className="w-4 h-4" />
                    <span>
                        {/* {new Date().toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                        })} */}
                        {time()}
                    </span>
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="flex items-center space-x-2 bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                    <FiAlertCircle />
                    <span>{error}</span>
                </div>
            )}
            {success && (
                <div className="flex items-center space-x-2 bg-green-100 text-green-700 p-3 rounded-lg text-sm">
                    <FiCheckCircle />
                    <span>{success}</span>
                </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={handleMarkIn}
                    disabled={markLoading}
                    className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg disabled:bg-green-300"
                >
                    {markLoading === "in" ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                        <FiLogIn />
                    )}
                    <span>Mark In</span>
                </button>

                <button
                    onClick={handleMarkOut}
                    disabled={markLoading}
                    className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg disabled:bg-red-300"
                >
                    {markLoading === "out" ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                        <FiLogOut />
                    )}
                    <span>Mark Out</span>
                </button>
            </div>

            {/* Attendance History */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <FiClock className="text-blue-500 w-4 h-4" />
                        <h3 className="text-sm font-semibold text-gray-800">
                            Attendance History
                        </h3>
                    </div>
                    <button
                        onClick={fetchAttendance}
                        disabled={loading}
                        className="flex items-center space-x-1 text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-md"
                    >
                        <FiRefreshCw className={`${loading ? "animate-spin" : ""}`} />
                        <span>Refresh</span>
                    </button>
                </div>
                <AttendanceTable data={attendance} loading={loading} />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
                <StatCard
                    label="Total Records"
                    color="text-blue-600"
                    value={attendance.length}
                />
                <StatCard
                    label="Completed Days"
                    color="text-green-600"
                    value={attendance.filter((a) => a.markIn && a.markOut).length}
                />
                <StatCard
                    label="Pending Mark Out"
                    color="text-yellow-600"
                    value={attendance.filter((a) => a.markIn && !a.markOut).length}
                />
                <StatCard
                    label="Absent Days"
                    color="text-red-600"
                    value={attendance.filter((a) => !a.markIn).length}
                />
            </div>
        </div>
    );
};

// Small stat box component
const StatCard = ({ label, value, color }) => (
    <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
        <div className={`text-xl font-bold ${color}`}>{value}</div>
        <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
);

export default Dashboard;
