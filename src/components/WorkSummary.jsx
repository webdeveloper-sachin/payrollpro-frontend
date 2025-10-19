import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import {
    FiClock,
    FiRefreshCw,
    FiDollarSign,
    FiTrendingUp,
    FiAlertTriangle,
    FiCalendar,
    FiEdit,
    FiCheck,
    FiX,
    FiUser,
    FiCoffee,
    FiSun
} from "react-icons/fi";

const WorkSummary = () => {
    const { user } = useContext(AuthContext);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dailyStats, setDailyStats] = useState([]);
    const [monthlySummary, setMonthlySummary] = useState({
        totalHours: 0,
        totalOvertime: 0,
        totalLate: 0,
        totalEarnings: 0,
        totalAbsent: 0,
        workingDays: 0,
        extraDays: 0,
        extraEarnings: 0
    });


    const standardStart = 9; // 9 AM
    const standardEnd = 18; // 6 PM
    const standardHours = 8; // 8 hours standard work day

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Calculate working days (excluding only Sunday)
    const getWorkingDays = () => {
        let workingDays = 0;
        for (let d = 1; d <= daysInMonth; d++) {
            const dateObj = new Date(year, month, d);
            if (dateObj > now) break;
            if (dateObj.getDay() !== 0) workingDays++; // Sunday is weekend
        }
        return workingDays;
    };

    const workingDays = getWorkingDays();
    const perDayRate = user.salary ? user.salary / daysInMonth : 0;
    const hourlyRate = perDayRate / standardHours;

    const fetchAttendance = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get("/api/v1/attendance");
            setAttendance(res.data.data);
            console.log("users data", res)
        } catch (err) {
            setError("Failed to fetch attendance data");
            console.error("Error fetching attendance:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const updateAttendance = (dateStr, markIn, markOut) => {
        setAttendance(prev =>
            prev.map(d =>
                new Date(d.date).toDateString() === dateStr
                    ? { ...d, markIn, markOut }
                    : d
            )
        );
    };

    const toggleHoliday = (dateStr) => {
        setAttendance(prev => {
            const exists = prev.find(d => new Date(d.date).toDateString() === dateStr);
            if (exists) {
                return prev.map(d =>
                    new Date(d.date).toDateString() === dateStr
                        ? { ...d, holiday: !d.holiday }
                        : d
                );
            } else {
                return [...prev, { date: new Date(dateStr), markIn: null, markOut: null, holiday: true }];
            }
        });
    };


    useEffect(() => {
        const daily = [];
        let totalHours = 0;
        let totalOvertime = 0;
        let totalLate = 0;
        let totalEarnings = 0;
        let totalAbsent = 0;
        let extraDays = 0;
        let extraEarnings = 0;

        const attendanceMap = {};
        attendance.forEach(day => {
            attendanceMap[new Date(day.date).toDateString()] = day;
        });

        const today = new Date();

        for (let d = 1; d <= daysInMonth; d++) {
            const dateObj = new Date(year, month, d);
            if (dateObj > today) break;

            const isSunday = dateObj.getDay() === 0;
            const dateStr = dateObj.toDateString();
            const dayData = attendanceMap[dateStr];

            if (isSunday && dayData?.markIn) {
                // Count as extra day, standard 9-5 work
                const workHours = standardHours; // 8 hours
                const totalDailyEarnings = workHours * hourlyRate;

                daily.push({
                    userId: user.id,
                    date: dateObj,
                    workHours,
                    lateHours: 0,
                    overtime: 0,
                    earnings: totalDailyEarnings,
                    lateDeduction: 0,
                    absent: false,
                    holiday: dayData?.holiday || false,
                    weekend: true,
                    markIn: new Date(dayData.markIn),
                    markOut: new Date(dayData.markOut || dateObj.setHours(17, 0, 0, 0))
                });

                extraDays++;
                extraEarnings += totalDailyEarnings;
                totalEarnings += totalDailyEarnings;
                totalHours += workHours;
                continue;
            }

            // Regular weekday calculation
            if (dayData?.holiday || (!dayData?.markIn && isSunday)) {
                daily.push({
                    date: dateObj,
                    workHours: 0,
                    lateHours: 0,
                    overtime: 0,
                    earnings: 0,
                    lateDeduction: 0,
                    absent: !dayData?.holiday && !dayData?.markIn,
                    holiday: dayData?.holiday || false,
                    weekend: isSunday,
                    markIn: dayData?.markIn || null,
                    markOut: dayData?.markOut || null
                });
                if (!dayData?.markIn && !dayData?.holiday && isSunday) totalAbsent++;
                continue;
            }

            if (dayData?.markIn) {
                const markIn = new Date(dayData.markIn);
                const markOut = dayData.markOut ? new Date(dayData.markOut) : new Date(markIn);
                markOut.setHours(standardEnd, 0, 0, 0); // Default end time

                const workHours = Math.max(0, (markOut - markIn) / 1000 / 3600);
                const lateHours = Math.max(0, markIn.getHours() + markIn.getMinutes() / 60 - standardStart);
                const overtime = Math.max(0, markOut.getHours() + markOut.getMinutes() / 60 - standardEnd);

                const baseEarnings = workHours * hourlyRate;
                const overtimeEarnings = overtime * hourlyRate * 1.5;
                const lateDeduction = Math.min(lateHours * hourlyRate, baseEarnings * 0.1);
                const totalDailyEarnings = Math.max(0, baseEarnings + overtimeEarnings - lateDeduction);

                daily.push({
                    date: dateObj,
                    workHours,
                    lateHours,
                    overtime,
                    earnings: totalDailyEarnings,
                    lateDeduction,
                    absent: false,
                    holiday: false,
                    weekend: isSunday,
                    markIn,
                    markOut
                });

                totalHours += workHours;
                totalLate += lateHours;
                totalOvertime += overtime;
                totalEarnings += totalDailyEarnings;
            } else {
                daily.push({
                    date: dateObj,
                    workHours: 0,
                    lateHours: 0,
                    overtime: 0,
                    earnings: 0,
                    lateDeduction: 0,
                    absent: true,
                    holiday: false,
                    weekend: isSunday,
                    markIn: null,
                    markOut: null
                });
                totalAbsent++;
            }
        }

        daily.sort((a, b) => b.date - a.date);

        setDailyStats(daily);
        setMonthlySummary({
            totalHours,
            totalOvertime,
            totalLate,
            totalEarnings,
            totalAbsent,
            workingDays,
            extraDays,
            extraEarnings
        });
    }, [attendance, hourlyRate, daysInMonth, year, month]);



    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(amount);

    const formatHours = (hours) => {
        if (hours === 0) return "0h";
        const whole = Math.floor(hours);
        const minutes = Math.round((hours - whole) * 60);
        return minutes > 0 ? `${whole}h ${minutes}m` : `${whole}h`;
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="glassmorphism rounded-3xl p-6 mb-6 border border-white/40 shadow-lg">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1">
                            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Work Summary
                            </h1>
                            <p className="text-gray-600 mt-2">Track your attendance, hours, and earnings</p>

                            {/* Salary Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                                <div className="bg-white/50 rounded-xl p-3 backdrop-blur-sm">
                                    <p className="text-xs text-gray-600">Monthly Salary</p>
                                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(user.salary || 0)}</p>
                                </div>
                                <div className="bg-white/50 rounded-xl p-3 backdrop-blur-sm">
                                    <p className="text-xs text-gray-600">Daily Rate</p>
                                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(perDayRate)}</p>
                                </div>
                                <div className="bg-white/50 rounded-xl p-3 backdrop-blur-sm">
                                    <p className="text-xs text-gray-600">Hourly Rate</p>
                                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(hourlyRate)}</p>
                                </div>
                                <div className="bg-white/50 rounded-xl p-3 backdrop-blur-sm">
                                    <p className="text-xs text-gray-600">Extra Earnings (Sunday)</p>
                                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(monthlySummary.extraEarnings)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={fetchAttendance}
                                disabled={loading}
                                className="glassmorphism-btn rounded-xl px-6 py-3 border border-white/40 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2"
                            >
                                <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                                <span className="font-medium">Refresh</span>
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="glassmorphism-error rounded-2xl p-4 mb-6 border border-red-200/50 shadow-lg">
                        <div className="flex items-center gap-3">
                            <FiAlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Monthly Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon={<FiClock className="w-5 h-5" />}
                        label="Total Hours"
                        value={formatHours(monthlySummary.totalHours)}
                        color="blue"
                    />
                    <StatCard
                        icon={<FiTrendingUp className="w-5 h-5" />}
                        label="Overtime"
                        value={formatHours(monthlySummary.totalOvertime)}
                        color="green"
                    />
                    <StatCard
                        icon={<FiAlertTriangle className="w-5 h-5" />}
                        label="Late Hours"
                        value={formatHours(monthlySummary.totalLate)}
                        color="orange"
                    />
                    <StatCard
                        icon={<FiDollarSign className="w-5 h-5" />}
                        label="Total Earnings"
                        value={formatCurrency(monthlySummary.totalEarnings)}
                        color="purple"
                    />
                    <StatCard
                        icon={<FiUser className="w-5 h-5" />}
                        label="Working Days"
                        value={`${monthlySummary.workingDays - monthlySummary.totalAbsent}/${monthlySummary.workingDays}`}
                        color="indigo"
                    />
                    <StatCard
                        icon={<FiSun className="w-5 h-5" />}
                        label="Extra Days (Sunday)"
                        value={monthlySummary.extraDays}
                        color="yellow"
                    />
                    <StatCard
                        icon={<FiDollarSign className="w-5 h-5" />}
                        label="Extra Earnings"
                        value={formatCurrency(monthlySummary.extraEarnings)}
                        color="yellow"
                    />
                </div>

                {/* Daily Table */}
                <div className="glassmorphism rounded-3xl border border-white/40 shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/30 bg-white/50">
                        <div className="flex items-center gap-3">
                            <FiCalendar className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-semibold text-gray-800">Daily Breakdown</h2>
                            <span className="text-sm text-gray-600 ml-auto">
                                {dailyStats.length} days
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/50 backdrop-blur-sm">
                                <tr>
                                    <th className="py-4 px-4 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="py-4 px-4 md:px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Work Hours
                                    </th>
                                    <th className="py-4 px-4 md:px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                        Late
                                    </th>
                                    <th className="py-4 px-4 md:px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                        Overtime
                                    </th>
                                    <th className="py-4 px-4 md:px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Earnings
                                    </th>
                                    <th className="py-4 px-4 md:px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="py-4 px-4 md:px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/30">
                                {dailyStats.map((day, idx) => (
                                    <DailyRow
                                        key={idx}
                                        day={day}
                                        hourlyRate={hourlyRate}
                                        onUpdate={updateAttendance}
                                        onToggleHoliday={toggleHoliday}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {dailyStats.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <FiCoffee className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No attendance records found</p>
                            <p className="text-gray-400 text-sm mt-2">Start by marking your attendance</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// const DailyRow = ({ day, hourlyRate, onUpdate, onToggleHoliday }) => {
//     const [editing, setEditing] = useState(false);
//     const [markIn, setMarkIn] = useState("");
//     const [markOut, setMarkOut] = useState("");

//     useEffect(() => {
//         if (day.markIn) {
//             const date = new Date(day.markIn);
//             setMarkIn(date.toTimeString().slice(0, 5));
//         } else setMarkIn("");

//         if (day.markOut) {
//             const date = new Date(day.markOut);
//             setMarkOut(date.toTimeString().slice(0, 5));
//         } else setMarkOut("");
//     }, [day.markIn, day.markOut]);

//     const handleSave = () => {
//         const dateStr = day.date.toISOString().split("T")[0];
//         const markInFull = markIn ? `${dateStr}T${markIn}:00` : null;
//         const markOutFull = markOut ? `${dateStr}T${markOut}:00` : null;
//         onUpdate(day.date.toDateString(), markInFull, markOutFull);
//         setEditing(false);
//     };

//     const handleCancel = () => {
//         setEditing(false);
//         if (day.markIn) setMarkIn(new Date(day.markIn).toTimeString().slice(0, 5));
//         else setMarkIn("");
//         if (day.markOut) setMarkOut(new Date(day.markOut).toTimeString().slice(0, 5));
//         else setMarkOut("");
//     };

//     const formatCurrency = (amount) =>
//         new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

//     const formatHours = (hours) => {
//         if (hours === 0) return "0h";
//         const whole = Math.floor(hours);
//         const minutes = Math.round((hours - whole) * 60);
//         return minutes > 0 ? `${whole}h ${minutes}m` : `${whole}h`;
//     };

//     const getStatusColor = (day) => {
//         if (day.holiday) return "text-purple-600 bg-purple-100";
//         if (day.weekend) return "text-yellow-600 bg-yellow-100"; // Sundays highlighted
//         if (day.absent) return "text-red-600 bg-red-100";
//         return "text-green-600 bg-green-100";
//     };

//     const getStatusText = (day) => {
//         if (day.holiday) return "Holiday";
//         if (day.weekend) return "Sunday";
//         if (day.absent) return "Absent";
//         return "Present";
//     };

//     return (
//         <tr className="hover:bg-white/30 transition-colors duration-150">
//             <td className="py-4 px-4 md:px-6 whitespace-nowrap">
//                 <div className="flex items-center gap-3">
//                     <div className="hidden xs:flex"><FiCalendar className="w-4 h-4 text-gray-400" /></div>
//                     <div>
//                         <div className="text-sm font-medium text-gray-900">
//                             {day.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
//                         </div>
//                         <div className="text-xs text-gray-500 sm:hidden">
//                             {formatHours(day.workHours)} • {formatCurrency(day.earnings)}
//                         </div>
//                     </div>
//                 </div>
//             </td>

//             <td className="py-4 px-4 md:px-6 whitespace-nowrap text-right">
//                 <div className="text-sm font-medium text-gray-900">{formatHours(day.workHours)}</div>
//             </td>

//             <td className="py-4 px-4 md:px-6 whitespace-nowrap text-right hidden sm:table-cell">
//                 <div className={`text-sm font-medium ${day.lateHours > 0 ? "text-orange-600" : "text-gray-500"}`}>
//                     {formatHours(day.lateHours)}
//                 </div>
//             </td>

//             <td className="py-4 px-4 md:px-6 whitespace-nowrap text-right hidden md:table-cell">
//                 <div className={`text-sm font-medium ${day.overtime > 0 ? "text-green-600" : "text-gray-500"}`}>
//                     {formatHours(day.overtime)}
//                 </div>
//             </td>

//             <td className="py-4 px-4 md:px-6 whitespace-nowrap text-right">
//                 <div className={`text-sm font-semibold ${day.earnings > 0 ? "text-gray-900" : "text-gray-500"}`}>
//                     {formatCurrency(day.earnings)}
//                 </div>
//             </td>

//             <td className="py-4 px-4 md:px-6 whitespace-nowrap text-center">
//                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(day)}`}>
//                     {getStatusText(day)}
//                 </span>
//             </td>

//             <td className="py-4 px-4 md:px-6 whitespace-nowrap text-center">
//                 {editing ? (
//                     <div className="flex items-center justify-center gap-2">
//                         <input type="time" value={markIn} onChange={e => setMarkIn(e.target.value)} className="w-20 text-sm border border-gray-300 rounded px-2 py-1" />
//                         <input type="time" value={markOut} onChange={e => setMarkOut(e.target.value)} className="w-20 text-sm border border-gray-300 rounded px-2 py-1" />
//                         <button onClick={handleSave} className="text-green-600 hover:text-green-800 transition-colors"><FiCheck className="w-4 h-4" /></button>
//                         <button onClick={handleCancel} className="text-red-600 hover:text-red-800 transition-colors"><FiX className="w-4 h-4" /></button>
//                     </div>
//                 ) : (
//                     <div className="flex items-center justify-center gap-2">
//                         <button onClick={() => setEditing(true)} className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50" title="Edit timings">
//                             <FiEdit className="w-4 h-4" />
//                         </button>
//                         {!day.weekend && (
//                             <button onClick={() => onToggleHoliday(day.date.toDateString())} className={`p-1 rounded transition-colors ${day.holiday ? "text-purple-600 hover:text-purple-800 hover:bg-purple-50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`} title={day.holiday ? "Remove holiday" : "Mark as holiday"}>
//                                 <FiSun className="w-4 h-4" />
//                             </button>
//                         )}
//                     </div>
//                 )}
//             </td>
//         </tr>
//     );
// };

console.log("first")

const DailyRow = ({ day, hourlyRate, onToggleHoliday }) => {
    const [editing, setEditing] = useState(false);
    const [markIn, setMarkIn] = useState("");
    const [markOut, setMarkOut] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (day.markIn) setMarkIn(new Date(day.markIn).toTimeString().slice(0, 5));
        else setMarkIn("");

        if (day.markOut) setMarkOut(new Date(day.markOut).toTimeString().slice(0, 5));
        else setMarkOut("");
    }, [day.markIn, day.markOut]);


    const handleSave = async () => {
        setLoading(true);
        const dateStr = day.date.toISOString().split("T")[0];

        try {
            let success = false;

            if (markIn) {
                const res = await API.put("/api/v1/attendance/update-mark-in", {
                    userId: user._id || user.id, // use correct key
                    date: dateStr,
                    markIn: `${dateStr}T${markIn}:00`,
                });
                console.log("response", res)
                if (res.status === 200) success = true;
            }

            if (markOut) {
                const res = await API.put("/api/v1/attendance/update-mark-out", {
                    userId: user._id || user.id,
                    date: dateStr,
                    markOut: `${dateStr}T${markOut}:00`,
                });
                if (res.status === 200) success = true;
            }

            if (success) {
                alert("Attendance updated successfully!");
                setEditing(false);
            } else {
                alert("No changes were made!");
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to update attendance");
        } finally {
            setLoading(false);
        }
    };


    const handleCancel = () => {
        setEditing(false);
        if (day.markIn) setMarkIn(new Date(day.markIn).toTimeString().slice(0, 5));
        else setMarkIn("");
        if (day.markOut) setMarkOut(new Date(day.markOut).toTimeString().slice(0, 5));
        else setMarkOut("");
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

    const formatHours = (hours) => {
        if (hours === 0) return "0h";
        const whole = Math.floor(hours);
        const minutes = Math.round((hours - whole) * 60);
        return minutes > 0 ? `${whole}h ${minutes}m` : `${whole}h`;
    };

    const getStatusColor = (day) => {
        if (day.holiday) return "text-purple-600 bg-purple-100";
        if (day.weekend) return "text-yellow-600 bg-yellow-100";
        if (day.absent) return "text-red-600 bg-red-100";
        return "text-green-600 bg-green-100";
    };

    const getStatusText = (day) => {
        if (day.holiday) return "Holiday";
        if (day.weekend) return "Sunday";
        if (day.absent) return "Absent";
        return "Present";
    };

    return (
        <tr className="hover:bg-white/30 transition-colors duration-150">
            <td className="py-4 px-4 md:px-6 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <FiCalendar className="w-4 h-4 text-gray-400" />
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {day.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        </div>
                        <div className="text-xs text-gray-500 sm:hidden">
                            {formatHours(day.workHours)} • {formatCurrency(day.earnings)}
                        </div>
                    </div>
                </div>
            </td>

            <td className="py-4 px-4 md:px-6 whitespace-nowrap text-right">
                <div className="text-sm font-medium text-gray-900">{formatHours(day.workHours)}</div>
            </td>

            <td className="py-4 px-4 md:px-6 whitespace-nowrap text-right hidden sm:table-cell">
                <div className={`text-sm font-medium ${day.lateHours > 0 ? "text-orange-600" : "text-gray-500"}`}>
                    {formatHours(day.lateHours)}
                </div>
            </td>

            <td className="py-4 px-4 md:px-6 whitespace-nowrap text-right hidden md:table-cell">
                <div className={`text-sm font-medium ${day.overtime > 0 ? "text-green-600" : "text-gray-500"}`}>
                    {formatHours(day.overtime)}
                </div>
            </td>

            <td className="py-4 px-4 md:px-6 whitespace-nowrap text-right">
                <div className={`text-sm font-semibold ${day.earnings > 0 ? "text-gray-900" : "text-gray-500"}`}>
                    {formatCurrency(day.earnings)}
                </div>
            </td>

            <td className="py-4 px-4 md:px-6 whitespace-nowrap text-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(day)}`}>
                    {getStatusText(day)}
                </span>
            </td>

            <td className="py-4 px-4 md:px-6 whitespace-nowrap text-center">
                {editing ? (
                    <div className="flex items-center justify-center gap-2">
                        <input
                            type="time"
                            value={markIn}
                            onChange={(e) => setMarkIn(e.target.value)}
                            className="w-20 text-sm border border-gray-300 rounded px-2 py-1"
                            disabled={loading}
                        />
                        <input
                            type="time"
                            value={markOut}
                            onChange={(e) => setMarkOut(e.target.value)}
                            className="w-20 text-sm border border-gray-300 rounded px-2 py-1"
                            disabled={loading}
                        />
                        <button onClick={handleSave} className="text-green-600 hover:text-green-800 transition-colors" disabled={loading}>
                            <FiCheck className="w-4 h-4" />
                        </button>
                        <button onClick={handleCancel} className="text-red-600 hover:text-red-800 transition-colors" disabled={loading}>
                            <FiX className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setEditing(true)} className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50" title="Edit timings">
                            <FiEdit className="w-4 h-4" />
                        </button>
                        {!day.weekend && (
                            <button
                                onClick={() => onToggleHoliday(day.date.toDateString())}
                                className={`p-1 rounded transition-colors ${day.holiday ? "text-purple-600 hover:text-purple-800 hover:bg-purple-50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
                                title={day.holiday ? "Remove holiday" : "Mark as holiday"}
                            >
                                <FiSun className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </td>
        </tr>
    );
};






const StatCard = ({ icon, label, value, color = "blue" }) => {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600",
        green: "from-green-500 to-green-600",
        orange: "from-orange-500 to-orange-600",
        purple: "from-purple-500 to-purple-600",
        indigo: "from-indigo-500 to-indigo-600",
        yellow: "from-yellow-400 to-yellow-500"
    };

    return (
        <div className="glassmorphism rounded-2xl p-6 border border-white/40 shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="grid grid-cols-12 gap-4 items-center">
                {/* Text Content - Takes 9 columns */}
                <div className="col-span-9">
                    <div className="grid grid-rows-2 gap-1">
                        <p className="text-sm font-medium text-gray-600 row-span-1">{label}</p>
                        <p className="text-2xl font-bold text-gray-900 row-span-1">{value}</p>
                    </div>
                </div>

                {/* Icon - Takes 3 columns */}
                <div className="col-span-3 flex justify-end">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} text-white shadow-lg`}>
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default WorkSummary;
