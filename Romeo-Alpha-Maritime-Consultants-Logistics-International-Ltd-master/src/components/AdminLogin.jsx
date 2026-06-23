import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/TranslationContext';
import { useNotification } from '../context/NotificationContext';
import { Eye, EyeSlash, User, Lock } from 'iconsax-react';
import { loginUser, verifyAdminRole, saveSession } from '../services/auth';
import '../styles/admin.css';

const AdminLogin = () => {
    const { t } = useTranslation();
    const { notify } = useNotification();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Dev Mock Bypass for Local Preview/Testing
            if (import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                const isTargetAdmin = email === 'admin@romeoalpha.com' || email === 'kvngreechard@gmail.com' || email === 'admin@test.com';
                if (isTargetAdmin) {
                    const userWithMetadata = {
                        id: email === 'admin@romeoalpha.com' ? '4a7dcc84-90c5-4c98-ba41-d21c04c6d405' : 
                            (email === 'kvngreechard@gmail.com' ? '9f0dad12-8d32-4349-93d9-00c1c6dcf4b0' : 'beebe26d-45e2-426a-a7c2-d5d00e44c90d'),
                        email: email,
                        user_metadata: {
                            full_name: email === 'admin@romeoalpha.com' ? 'Captain Smart-Alli' : 
                                       (email === 'kvngreechard@gmail.com' ? 'Olayinka Ayodele' : 'Test Admin')
                        }
                    };
                    saveSession('mock_token', userWithMetadata);
                    notify(t('Login Success'), 'success');
                    navigate('/admin-dashboard');
                    return;
                }
            }

            // 1. Send Login Request
            const authData = await loginUser(email, password);

            // 2. Verify Role
            const { isAdmin, full_name } = await verifyAdminRole(authData.user.id, authData.access_token);

            if (isAdmin) {
                // 3. Save Session - Merge the full_name from our DB into user object
                const userWithMetadata = {
                    ...authData.user,
                    user_metadata: {
                        ...authData.user.user_metadata,
                        full_name: full_name || authData.user.user_metadata?.full_name
                    }
                };
                saveSession(authData.access_token, userWithMetadata);
                notify(t('Login Success'), 'success');
                navigate('/admin-dashboard');
            } else {
                notify(t('Access Denied'), 'error');
            }
        } catch (err) {
            console.error('Login error:', err);
            notify(err.message || t('Login Failed'), 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <h2 className="admin-login-title">{t('Admin Login')}</h2>
                    <p className="admin-login-subtitle">{t('Secure Access')}</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-login-form">

                    <div className="admin-input-group">
                        <label className="admin-label">{t('Email Address')}</label>
                        <div className="admin-input-wrapper">
                            <User size="20" color="#6B82AC" className="admin-input-icon" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="admin-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-input-group">
                        <label className="admin-label">{t('Password')}</label>
                        <div className="admin-input-wrapper">
                            <Lock size="20" color="#6B82AC" className="admin-input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="admin-input"
                                required
                            />
                            <div
                                onClick={() => setShowPassword(!showPassword)}
                                className="admin-password-toggle"
                            >
                                {showPassword ?
                                    <EyeSlash size="20" color="#A0AEC0" /> :
                                    <Eye size="20" color="#A0AEC0" />
                                }
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="admin-btn" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                        {loading ? t('Verifying') : t('Login')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
