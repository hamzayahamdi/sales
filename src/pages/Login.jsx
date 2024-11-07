import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import salesLogo from '../sales.svg';
import * as THREE from 'three';
import RINGS from 'vanta/dist/vanta.rings.min';
import { Helmet } from 'react-helmet-async';

const Login = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [vantaEffect, setVantaEffect] = useState(null);
    const vantaRef = useRef(null);
    const navigate = useNavigate();

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
                    color: 0xFFFFFF,
                    backgroundAlpha: 1,
                    spacing: 10,
                    showDots: false,
                    color1: 0xFFFFFF,
                    color2: 0xFFFFFF
                })
            );
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Bypass password check for testing
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
        
        // Original password check code (commented out)
        
        if (password === import.meta.env.VITE_MASTER_PASSWORD) {
            localStorage.setItem('isAuthenticated', 'true');
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
                {/* Animated Background */}
                <div ref={vantaRef} className="absolute inset-0 -z-10" />

                {/* Main Container - Centered */}
                <div className="w-full min-h-screen flex items-center justify-center px-4">
                    {/* Login container */}
                    <div className="relative w-full max-w-[340px] sm:max-w-md">
                        <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200">
                            <div className="p-6 sm:p-8">
                                {/* Logo */}
                                <div className="flex justify-center mb-8 sm:mb-12">
                                    <img 
                                        src={salesLogo} 
                                        alt="Sales Logo" 
                                        className="h-16 sm:h-20 w-auto"
                                    />
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-6">
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
                                                    autoComplete="current-password"
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

                        {/* Copyright */}
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