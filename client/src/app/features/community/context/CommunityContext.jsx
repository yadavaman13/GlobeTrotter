import { createContext, useContext } from 'react';

const CommunityContext = createContext(null);

export function CommunityProvider({ children, value }) {
    return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
}

export function useCommunityContext() {
    const context = useContext(CommunityContext);
    if (!context) {
        throw new Error('useCommunityContext must be used within a CommunityProvider');
    }
    return context;
}
