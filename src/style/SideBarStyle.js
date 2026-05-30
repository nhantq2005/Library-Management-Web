const navLinkBaseStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
};

export const sidebarStyles = {
    sidebarContainerStyle: {
        width: '260px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#f4f6f8',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        zIndex: 100,
    },

    sidebarHeaderLogoAreaStyle: {
        display: 'flex',
        alignItems: 'center',
        padding: '24px 20px',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '20px'
    },

    logoIconWrapperStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1D559F',
        color: 'white',
        width: '38px',
        height: '38px',
        borderRadius: '10px',
        marginRight: '12px',
        boxShadow: '0 4px 10px rgba(198, 198, 198, 0.3)'
    },

    sidebarLogoStyle: {
        margin: 0,
        fontSize: '1.6rem',
        fontWeight: '800',
        letterSpacing: '-0.5px'
    },

    sidebarHeaderProfileStyle: {
        padding: '24px 24px 16px 24px',
    },

    userProfileStyle: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },

    userAvatarStyle: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        objectFit: 'cover',
    },

    userInfoH4Style: {
        margin: 0,
        fontSize: '14px',
        color: '#111827',
        fontWeight: '600',
    },

    userInfoPStyle: {
        margin: '4px 0 0 0',
        fontSize: '12px',
        color: '#6b7280',
    },

    navMenuStyle: {
        listStyle: 'none',
        padding: '0 16px',
        margin: '16px 0 0 0',
        flex: 1,
    },

    navItemStyle: {
        marginBottom: '4px',
    },

    navLinkBaseStyle,
    navLinkNormalStyle: {
        ...navLinkBaseStyle,
        color: '#4b5563',
        backgroundColor: 'transparent',
    },
    navLinkActiveStyle: {
        ...navLinkBaseStyle,
        backgroundColor: '#dbeafe',
        color: '#1e40af',
    },

    actionSectionStyle: {
        padding: '0 16px',
        margin: '24px 0',
    },

    btnPrimaryStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '12px',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },

    sidebarFooterStyle: {
        padding: '16px',
        marginTop: 'auto',
    },

    dividerStyle: {
        height: '1px',
        backgroundColor: '#e5e7eb',
        margin: '0 16px 16px 16px',
    }
}