export const styles = {
    container: { 
        padding: '32px 40px', 
        backgroundColor: '#F9FAFB', 
        minHeight: '100vh', 
        fontFamily: 'Inter, sans-serif' 
    },
    pageTitle: { 
        color: '#111827', 
        fontWeight: '600', 
        letterSpacing: '-0.02em', 
        fontSize: '1.5rem', 
        marginBottom: '4px' 
    },
    pageSubtitle: { 
        fontSize: '0.875rem', 
        color: '#4B5563' 
    },
    card: { 
        backgroundColor: '#FFFFFF', 
        border: '1px solid #E5E7EB', 
        borderRadius: '4px', 
        padding: '24px' 
    },
    cardTitle: { 
        fontSize: '0.75rem', 
        fontWeight: '600', 
        color: '#6B7280', 
        textTransform: 'uppercase', 
        letterSpacing: '0.05em', 
        marginBottom: '8px' 
    },
    sectionTitle: { 
        color: '#111827', 
        fontWeight: '600', 
        fontSize: '1.1rem', 
        margin: 0 
    },
    input: { 
        backgroundColor: '#F9FAFB', 
        border: '1px solid #E5E7EB', 
        borderRadius: '4px', 
        padding: '8px 12px', 
        fontSize: '0.875rem', 
        color: '#111827', 
        boxShadow: 'none' 
    },
    tableContainer: { 
        margin: '0 -24px', 
        flexGrow: 1, 
        overflowX: 'auto',
        overflowY: 'auto',
        maxHeight: '350px' 
    },
    th: { 
        padding: '12px 20px', 
        fontSize: '0.75rem', 
        fontWeight: '600', 
        color: '#6B7280', 
        textTransform: 'uppercase', 
        letterSpacing: '0.05em', 
        borderBottom: '1px solid #E5E7EB', 
        backgroundColor: '#FFFFFF',
        position: 'sticky', 
        top: 0,
        zIndex: 1
    },
    td: { 
        padding: '16px 20px', 
        fontSize: '0.875rem', 
        color: '#111827', 
        verticalAlign: 'middle', 
        borderBottom: '1px solid #E5E7EB' 
    },
    badgeBase: { 
        padding: '4px 8px', 
        borderRadius: '2px', 
        fontSize: '0.7rem', 
        fontWeight: '600', 
        textTransform: 'uppercase', 
        letterSpacing: '0.05em', 
        display: 'inline-block' 
    },
    badgeMethod: { backgroundColor: '#F3F4F6', color: '#4B5563' },
    badgeSuccess: { backgroundColor: '#DCFCE7', color: '#166534' },
    badgeFailed: { backgroundColor: '#FEE2E2', color: '#991B1B' },
    badgePending: { backgroundColor: '#FEF08A', color: '#854D0E' }
};