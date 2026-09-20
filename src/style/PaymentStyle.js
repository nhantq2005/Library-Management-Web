const PaymentStyle = {
    pageWrapper: {
        padding: '32px 40px',
        backgroundColor: '#F9FAFB',
        minHeight: '100vh',
        fontFamily: 'Inter, sans-serif'
    },
    container: {maxWidth: '1100px', margin: '0 auto'},
    title: {color: '#111827', fontWeight: '600', letterSpacing: '-0.02em', fontSize: '1.5rem', marginBottom: '4px'},
    subtitle: {fontSize: '0.875rem', color: '#4B5563'},
    backBtn: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        color: '#4B5563',
        borderRadius: '4px',
        padding: '8px 16px',
        fontSize: '0.875rem',
        fontWeight: '500'
    },
    sectionTitle: {color: '#111827', fontWeight: '600', fontSize: '1.1rem', marginBottom: '24px'},
    methodBox: (isSelected) => ({
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: isSelected ? '5px solid #1D559F' : '1px solid #D1D5DB',
        backgroundColor: '#FFFFFF'
    }),
    vnpayLogo: {
        width: '40px',
        height: '40px',
        backgroundColor: '#FFFFFF',
        borderRadius: '4px',
        border: '1px solid #E5E7EB',
        fontWeight: 'bold',
        color: '#005BAA',
        fontSize: '0.7rem'
    },
    methodTitle: {color: '#111827', fontWeight: '600', fontSize: '0.9rem'},
    methodSubtitle: {color: '#6B7280', fontSize: '0.8rem'},
    sectionHeaderTitle: {color: '#111827', fontWeight: '600', fontSize: '1.1rem', margin: 0},
    editLink: {fontSize: '0.75rem', color: '#1D559F', fontWeight: '600', cursor: 'pointer'},
    disabledInput: {backgroundColor: '#F3F4F6', color: '#6B7280', cursor: 'not-allowed'},
    summaryCard: {position: 'sticky', top: '32px'},
    itemList: {maxHeight: '300px', overflowY: 'auto', paddingRight: '4px'},
    itemRow: {borderBottom: '1px solid #E5E7EB'},
    itemTitle: {color: '#1D559F', fontWeight: '500', fontSize: '0.875rem', marginBottom: '4px'},
    itemQuantity: {color: '#6B7280', fontSize: '0.75rem'},
    itemPrice: {fontWeight: '600', color: '#111827', fontSize: '0.875rem', whiteSpace: 'nowrap', marginLeft: '12px'},
    summaryLabel: {color: '#4B5563', fontSize: '0.875rem'},
    summaryValue: {color: '#111827', fontWeight: '500', fontSize: '0.875rem'},
    discountValue: {color: '#059669', fontWeight: '500', fontSize: '0.875rem'},
    totalSection: {borderTop: '1px dashed #D1D5DB'},
    totalLabel: {color: '#111827', fontWeight: '600', fontSize: '1rem'},
    totalAmount: {color: '#1D559F', fontWeight: '700', fontSize: '1.5rem'},
    currency: {fontSize: '1rem', fontWeight: '600'},
    vatText: {color: '#6B7280', fontSize: '0.7rem'},
    payBtn: {
        backgroundColor: '#1D559F',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '4px',
        padding: '12px',
        fontSize: '0.9rem',
        fontWeight: '600'
    },
    termsText: {fontSize: '0.75rem', color: '#6B7280'},
    termsLink: {color: '#1D559F', textDecoration: 'none'}
};

export default PaymentStyle;
