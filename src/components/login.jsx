import { useState } from 'react';
import { useKanban } from '../context/KanbanContext';

export default function Login({ onSwitchToRegister }) {
    const { login } = useKanban();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        try {
            login(username.trim(), password);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div id="auth-screen" className="flex-1 flex items-center justify-center bg-slate-100 h-screen w-full">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
                <div className="flex justify-center mb-4 text-indigo-600">
                    <i className="ph ph-kanban text-6xl"></i>
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome to Kanban</h1>
                <p className="text-slate-500 mb-6">Log in to manage your boards</p>
                
                {error && <div className="mb-4 text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}

                <form id="login-form" onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            required 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                        />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                        Login
                    </button>
                    <div className="text-center text-sm text-slate-500 mt-4">
                        Don't have an account?{' '}
                        <button type="button" onClick={onSwitchToRegister} className="text-indigo-600 font-medium hover:underline">
                            Register here
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
