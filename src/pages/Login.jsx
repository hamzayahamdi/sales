import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { MdAdminPanelSettings, MdAccountBalance, MdStorefront } from 'react-icons/md';
import salesLogo from '../sales.svg';
import * as THREE from 'three';
import RINGS from 'vanta/dist/vanta.rings.min';
import { Helmet } from 'react-helmet-async';
import { Transition } from '@headlessui/react';
import { HiShieldCheck } from 'react-icons/hi';
import { RiAdminFill } from 'react-icons/ri';
import { BsShieldFillCheck } from 'react-icons/bs';

const users = [
    {
        id: 'admin',
        name: 'Administrateur',
        role: 'admin',
        icon: BsShieldFillCheck,
        password: import.meta.env.VITE_ADMIN_PASSWORD,
        store: 'all',
        color: 'from-[#599AED] to-[#3B82F6]'
    },
    {
        id: 'comptabilite',
        name: 'Comptabilité',
        role: 'comptabilite',
        icon: MdAccountBalance,
        password: import.meta.env.VITE_COMPTA_PASSWORD,
        store: 'all',
        color: 'from-emerald-500 to-emerald-600'
    },
    {
        id: 'casa',
        name: 'Manager Casa',
        role: 'store_manager',
        icon: MdStorefront,
        password: import.meta.env.VITE_CASA_PASSWORD,
        store: '1',
        color: 'from-violet-500 to-violet-600'
    },
    {
        id: 'rabat',
        name: 'Manager Rabat & Outlet',
        role: 'store_manager',
        icon: MdStorefront,
        password:import.meta.env.VITE_RABAT_PASSWORD,
        store: '2',
        color: 'from-amber-500 to-amber-600'
    },
    {
        id: 'tanger',
        name: 'Manager Tanger',
        role: 'store_manager',
        icon: MdStorefront,
        password: import.meta.env.VITE_TANGER_PASSWORD,
        store: '5',
        color: 'from-pink-500 to-pink-600'
    },
    {
        id: 'marrakech',
        name: 'Manager Marrakech',
        role: 'store_manager',
        icon: MdStorefront,
        password: import.meta.env.VITE_MARRAKECH_PASSWORD,
        store: '6',
        color: 'from-cyan-500 to-cyan-600'
    }
];

const Login = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [vantaEffect, setVantaEffect] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const vantaRef = useRef(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const metaViewport = document.querySelector('meta[name=viewport]');
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        return () => metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    }, []);

    useEffect(() => {
        if (!vantaEffect) {
            setVantaEffect(
                RINGS({
                    el: vantaRef.current,
                    THREE: THREE,
                    mouseControls: false,
                    touchControls: false,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    backgroundColor: 0x1E293B,
                    color: 0xFFFFFF
                })
            );
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!selectedUser) {
            setError('Veuillez sélectionner un utilisateur');
            return;
        }

        if (password === selectedUser.password) {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userRole', selectedUser.role);
            localStorage.setItem('userStore', selectedUser.store);
            localStorage.setItem('userName', selectedUser.name);
            navigate('/dashboard');
        } else {
            setError('Mot de passe incorrect');
            setPassword('');
        }
    };

    return (
        <>
            <Helmet>
                <title>Login | Sales Analytics</title>
            </Helmet>
            <div className="fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden">
                <div ref={vantaRef} className="absolute inset-0 -z-10" />

                <div className="w-full min-h-screen flex items-center justify-center px-4">
                    <div className="relative w-full max-w-[340px] sm:max-w-md">
                        <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200">
                            <div className="p-6 sm:p-8">
                                <div className="flex justify-center mb-8 sm:mb-12">
                                    <img 
                                        src={salesLogo} 
                                        alt="Sales Logo" 
                                        className="h-16 sm:h-20 w-auto"
                                    />
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* User Selector Dropdown */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 ml-1">
                                            Utilisateur
                                        </label>
                                        <div className="relative" ref={dropdownRef}>
                                            <button
                                                type="button"
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                className={`
                                                    w-full px-4 py-3 flex items-center justify-between
                                                    bg-white border border-gray-200 rounded-lg
                                                    focus:ring-2 focus:ring-[#599AED] focus:border-transparent
                                                    transition-all duration-200
                                                `}
                                            >
                                                {selectedUser ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className={`
                                                            w-8 h-8 rounded-lg bg-gradient-to-br ${selectedUser.color}
                                                            flex items-center justify-center text-white
                                                        `}>
                                                            <selectedUser.icon className="w-5 h-5" />
                                                        </div>
                                                        <span className="text-gray-900">{selectedUser.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">Sélectionnez un utilisateur</span>
                                                )}
                                                <FaChevronDown className={`
                                                    w-4 h-4 text-gray-400 transition-transform duration-200
                                                    ${isDropdownOpen ? 'rotate-180' : ''}
                                                `} />
                                            </button>

                                            <Transition
                                                show={isDropdownOpen}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                                className="absolute z-10 w-full mt-2"
                                            >
                                                <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                                                    {users.map((user) => (
                                                        <button
                                                            key={user.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setIsDropdownOpen(false);
                                                            }}
                                                            className={`
                                                                w-full px-4 py-3 flex items-center gap-3
                                                                hover:bg-gray-50 transition-colors
                                                                ${selectedUser?.id === user.id ? 'bg-gray-50' : ''}
                                                            `}
                                                        >
                                                            <div className={`
                                                                w-8 h-8 rounded-lg bg-gradient-to-br ${user.color}
                                                                flex items-center justify-center text-white
                                                            `}>
                                                                <user.icon className="w-5 h-5" />
                                                            </div>
                                                            <span className="text-gray-900">{user.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </Transition>
                                        </div>
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-2">
                                        <label 
                                            htmlFor="password" 
                                            className="block text-sm font-medium text-gray-700 ml-1"
                                        >
                                            Mot de passe
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute -inset-0.5 bg-[#599AED] rounded-lg opacity-30 group-hover:opacity-100 transition duration-500 group-hover:blur"></div>
                                            <div className="relative flex items-center">
                                                <FaLock className="absolute left-3 text-gray-400" />
                                                <input
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="block w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#599AED] focus:border-transparent transition-all duration-200"
                                                    placeholder="Entrez votre mot de passe"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                                >
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="relative w-full bg-[#599AED] text-white font-medium py-3 rounded-lg hover:bg-[#4080d4] transition-all duration-200"
                                    >
                                        Se connecter
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="absolute -bottom-12 sm:-bottom-16 left-0 right-0 text-center">
                            <p className="text-xs sm:text-sm text-white">
                                © {new Date().getFullYear()} Sketch Design. Tous droits réservés.
                            </p>
                            <p className="text-xs text-white/80 mt-1">
                                Développé avec ❤️ par l'équipe Sketch Design
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;