const PaymentResultStyle = {
    pageWrapper: {
        minHeight: '100vh',
        backgroundColor: '#F9FAFB',
        padding: '60px 20px',
        fontFamily: 'Inter, sans-serif'
    },
    container: {maxWidth: '600px', margin: '0 auto'},
    card: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '40px 32px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    },
    loadingText: {color: '#1D559F', fontWeight: '600', fontSize: '1.1rem', marginTop: '24px'},
    successIconBg: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#DCFCE7',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    failIconBg: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#FEE2E2',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    successIcon: {color: '#166534', fontSize: '2rem'},
    failIcon: {color: '#991B1B', fontSize: '2rem'},
    title: {color: '#111827', fontWeight: '700', fontSize: '1.5rem', marginTop: '24px', letterSpacing: '-0.02em'},
    subtitle: {color: '#6B7280', fontSize: '0.95rem', marginBottom: '32px'},
    infoBox: {backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '24px'},
    infoRowBorder: {borderBottom: '1px solid #E5E7EB'},
    infoLabel: {color: '#6B7280', fontWeight: '500', fontSize: '0.875rem'},
    infoValue: {color: '#111827', fontWeight: '600', fontSize: '0.875rem'},
    totalLabel: {color: '#111827', fontWeight: '600', fontSize: '1rem'},
    totalValue: {color: '#1D559F', fontWeight: '700', fontSize: '1.25rem'}
};

export default PaymentResultStyle;