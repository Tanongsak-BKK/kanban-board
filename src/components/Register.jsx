import { useState } from 'react';
import { useKanban } from '../context/KanbanContext';

export default function Register({ onSwitchToLogin }) {
    const { login, register } = useKanban();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            register(username.trim(), password);
            login(username.trim(), password);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div id="auth-screen" className="flex-1 flex items-center justify-center bg-slate-100 h-screen w-full">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
                <div className="flex justify-center mb-4 text-indigo-600">
                    <i className="ph ph-user-plus text-6xl"></i>
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Create Account</h1>
                <p className="text-slate-500 mb-6">Sign up to start managing your boards</p>
                
                {error && <div className="mb-4 text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}

                <form id="register-form" onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <input 
                            type="text" 
                            id="reg-username" 
                            required 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            id="reg-password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                        <input 
                            type="password" 
                            id="reg-confirm-password" 
                            required 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                        />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                        Register
                    </button>
                    <div className="text-center text-sm text-slate-500 mt-4">
                        Already have an account?{' '}
                        <button type="button" onClick={onSwitchToLogin} className="text-indigo-600 font-medium hover:underline">
                            Login here
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
