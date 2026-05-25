import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuth({
    redirectTo = '/brinquedotecas',
    required = true
} = {}) {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);

    const loadSession = useCallback(() => {
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (!storedToken || !storedUser) {
                if (required) {
                    navigate(redirectTo);
                }

                setLoading(false);
                return;
            }

            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        } catch (error) {
            console.error(error);

            localStorage.removeItem('token');
            localStorage.removeItem('user');

            if (required) {
                navigate(redirectTo);
            }
        } finally {
            setLoading(false);
        }
    }, [navigate, redirectTo, required]);

    useEffect(() => {
        loadSession();
    }, [loadSession]);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
        setToken('');

        navigate('/brinquedotecas');
    }, [navigate]);

    const hasRole = useCallback(
        (...roles) => roles.includes(user?.perfil),
        [user]
    );

    return {
        user,
        token,
        loading,

        setUser,
        setToken,

        logout,
        hasRole,

        isAuthenticated: !!token
    };
}