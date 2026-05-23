const HomeStyles = {
    container: {
        marginTop: '1.5rem',
    },
    headerTitle: {
        color: '#0284c7',
        marginBottom: '1.5rem',
        fontWeight: 'bold',
        fontSize: '1.75rem',
    },
    card: {
        height: '100%',
        boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
        border: 'none',
        borderRadius: '12px',
        position: 'relative',
    },
    badgeWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        margin: '0.5rem',
        zIndex: 1,
    },
    cardImage: {
        height: '220px',
        objectFit: 'cover',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
    },
    cardBody: {
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: '1rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    authorText: {
        color: '#6c757d',
        fontSize: '0.875rem',
        marginBottom: '0.25rem',
    },
    statsContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.875rem',
        color: '#6c757d',
        marginBottom: '0.5rem',
    },
    priceText: {
        color: '#dc3545',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
    },
    dateText: {
        fontSize: '0.875rem',
        fontStyle: 'italic',
        marginBottom: '0.5rem',
    },
    actionContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginTop: '1rem',
    },
    buttonRow: {
        display: 'flex',
        gap: '0.5rem',
    },
    loadingContainer: {
        textAlign: 'center',
        margin: '3rem 0',
    }
};

export default HomeStyles;