import React, { createContext, useContext, useEffect, useState } from 'react';

export const MASTER_ADMIN_KEY = 'O@Ue9vKsJC0b#j5viWYds3^f$^&0B@^*ZO@v@^X9p%zp^E714Pwu9qr7hcli8@D#';
const STORAGE_KEY = 'antic_labs_admin_session';

interface AuthContextType {
    isAdmin: boolean;
    authError: string | null;
    loginWithMasterKey: (key: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState<boolean>(() => {
        try {
            return sessionStorage.getItem(STORAGE_KEY) === 'authenticated';
        } catch {
            return false;
        }
    });
    const [authError, setAuthError] = useState<string | null>(null);

    const loginWithMasterKey = (key: string): boolean => {
        setAuthError(null);
        if (key.trim() === MASTER_ADMIN_KEY) {
            setIsAdmin(true);
            try {
                sessionStorage.setItem(STORAGE_KEY, 'authenticated');
            } catch {}
            return true;
        }
        setAuthError('Geçersiz erişim anahtarı.');
        return false;
    };

    const logout = () => {
        setIsAdmin(false);
        setAuthError(null);
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch {}
    };

    return (
        <AuthContext.Provider
            value={{
                isAdmin,
                authError,
                loginWithMasterKey,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
