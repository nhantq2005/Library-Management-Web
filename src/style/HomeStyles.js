const HomeStyles = {
    container: {
        marginTop: '2rem',
        marginBottom: '4rem',
    },
    headerTitle: {
        fontSize: '1.5rem',
        fontWeight: '800',
        letterSpacing: '-0.5px',
        color: '#1e293b'
    },
    scrollContainer: {
        display: 'flex',
        flexWrap: 'nowrap',
        gap: '1.25rem',
        paddingBottom: '1.5rem',
        paddingLeft: '0.5rem',
        paddingRight: '0.5rem',
        overflowX: 'auto',
        overflowY: 'hidden',
        WebkitOverflowScrolling: 'touch',
        scrollSnapType: 'x mandatory'
    },
    cardWrapper: {
        flex: '0 0 auto',
        width: '240px', 
        scrollSnapAlign: 'start'
    },
    card: {
        height: '100%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)', 
        border: '1px solid #f1f5f9', 
        borderRadius: '16px',
        cursor: 'pointer',
        backgroundColor: '#ffffff',
        transition: 'all 0.25s ease'
    },
    badgeWrapper: {
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 2,
    },
    badge: {
        fontSize: '0.75rem',
        padding: '6px 12px',
        borderRadius: '8px',
        fontWeight: '600',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    cardImage: {
        height: '220px',
        objectFit: 'cover',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        backgroundColor: '#f8fafc',
    },
    cardBody: {
        display: 'flex',
        flexDirection: 'column',
        padding: '1.25rem',
    },
    cardTitle: {
        fontWeight: '700',
        fontSize: '1.05rem',
        color: '#0f172a',
        marginBottom: '0.4rem',
        lineHeight: '1.4',
        minHeight: '2.8rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
    },
    authorText: {
        color: '#64748b',
        fontSize: '0.85rem',
        marginBottom: '1rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    statsContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '0.75rem',
        marginBottom: '0.75rem',
        borderBottom: '1px dashed #e2e8f0' 
    },
    statText: {
        fontSize: '0.8rem',
        color: '#64748b',
        fontWeight: '500'
    },
    priceText: {
        fontWeight: '800',
        fontSize: '1.1rem',
        marginBottom: '0.25rem'
    },
    dateText: {
        fontSize: '0.75rem',
        color: '#94a3b8',
        fontWeight: '500'
    }
};

export default HomeStyles;