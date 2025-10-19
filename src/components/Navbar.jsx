import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { FiLogOut, FiUser, FiMenu, FiX, FiHome, FiSettings } from 'react-icons/fi'
import { GiFireworkRocket } from 'react-icons/gi'
import { MdWork, MdWorkHistory } from 'react-icons/md'
import { FcWorkflow } from 'react-icons/fc'

const Navbar = () => {
    const { user, logout } = useContext(AuthContext)
    const nav = useNavigate()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        nav('/login')
        setIsMobileMenuOpen(false)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    return (
        <>
            <nav className="bg-white  border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link
                                to="/"
                                className="flex items-center space-x-2"
                                onClick={closeMobileMenu}
                            >
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">P</span>
                                </div>
                                <span className="font-bold text-xl text-gray-900 hidden sm:block">PayrollPro</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-4">
                            {user ? (
                                <>
                                    <Link
                                        to="/"
                                        className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                                    >
                                        <FiHome className="w-4 h-4" />
                                        <span>Dashboard</span>
                                    </Link>

                                    <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                                        <div className="flex items-center space-x-2 px-3 py-2 text-gray-700">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <FiUser className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <Link to="profile">
                                                <div className="flex flex-col">

                                                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                                                    <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                                                </div>
                                            </Link>
                                        </div>

                                        {user.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                                            >
                                                <FiSettings className="w-4 h-4" />
                                                <span>Admin</span>
                                            </Link>
                                        )}
                                        <Link
                                            to="/working-summary"
                                            className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                                        >
                                            <MdWorkHistory className="w-4 h-4" />
                                            <span>Summary</span>
                                        </Link>


                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
                                        >
                                            <FiLogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
                            >
                                {isMobileMenuOpen ? (
                                    <FiX className="w-6 h-6" />
                                ) : (
                                    <FiMenu className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200 shadow-xl">
                        <div className="px-4 py-6 space-y-6">
                            {user ? (
                                <>
                                    {/* User Info */}
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <FiUser className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                        </div>
                                    </div>

                                    {/* Navigation Links */}
                                    <div className="space-y-2">
                                        <Link
                                            to="/"
                                            onClick={closeMobileMenu}
                                            className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200"
                                        >
                                            <FiHome className="w-5 h-5" />
                                            <span>Dashboard</span>
                                        </Link>

                                        {user.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                onClick={closeMobileMenu}
                                                className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200"
                                            >
                                                <FiSettings className="w-5 h-5" />
                                                <span>Admin Panel</span>
                                            </Link>
                                        )}
                                        <Link
                                            to="/working-summary"
                                            className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                                        >
                                            <MdWorkHistory className="w-4 h-4" />
                                            <span>Summary</span>
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200 text-left"
                                        >
                                            <FiLogOut className="w-5 h-5" />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-3">
                                    <Link
                                        to="/login"
                                        onClick={closeMobileMenu}
                                        className="block w-full text-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={closeMobileMenu}
                                        className="block w-full text-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-sm"
                                    >
                                        Create Account
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    )
}

export default Navbar