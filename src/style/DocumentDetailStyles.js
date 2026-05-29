const DocumentDetailStyles = {
    pageWrapper: { backgroundColor: '#F9FAFB', minHeight: '100vh', padding: '32px 40px', fontFamily: 'Inter, sans-serif' },
    container: { maxWidth: '1050px', padding: 0 },
    backButton: { color: '#4B5563', fontSize: '0.875rem', fontWeight: '500' },
    card: { backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '32px' },
    
    bookImage: { borderRadius: '4px', border: '1px solid #E5E7EB', width: '100%', maxHeight: '420px', objectFit: 'cover' },
    docTitle: { color: '#111827', fontSize: '1.75rem', letterSpacing: '-0.02em' },
    priceText: { color: '#DC2626', fontSize: '1.5rem' },
    
    badge: (bgColor, textColor) => ({ 
        backgroundColor: bgColor, 
        color: textColor, 
        padding: '4px 10px', 
        borderRadius: '2px', 
        fontSize: '0.75rem', 
        fontWeight: '600', 
        textTransform: 'uppercase', 
        letterSpacing: '0.02em' 
    }),

    infoLabel: { fontWeight: '600', color: '#6B7280' },
    infoValue: { color: '#111827' },
    hr: { borderColor: '#E5E7EB', opacity: 1 },
    
    descHeader: { fontSize: '0.75rem', color: '#6B7280', letterSpacing: '0.05em' },
    descText: { fontSize: '0.875rem', color: '#4B5563', lineHeight: '1.6', textAlign: 'justify', margin: 0 },
    noteText: { fontSize: '0.75rem', fontStyle: 'italic' },

    btnChecking: { backgroundColor: '#F3F4F6', color: '#6B7280', borderRadius: '4px', fontSize: '0.875rem', padding: '10px 24px' },
    btnViewAllowed: { backgroundColor: '#059669', color: '#FFFFFF', borderRadius: '4px', padding: '10px 24px', fontSize: '0.875rem', fontWeight: '500', border: 'none' },
    btnViewLocked: { backgroundColor: '#6B7280', color: '#FFFFFF', borderRadius: '4px', padding: '10px 24px', fontSize: '0.875rem', fontWeight: '500', border: 'none' },
    btnBuy: { backgroundColor: '#DC2626', color: '#FFFFFF', borderRadius: '4px', padding: '10px 24px', fontSize: '0.875rem', fontWeight: '500', border: 'none' },
    btnBorrow: { backgroundColor: '#1D559F', color: '#FFFFFF', borderRadius: '4px', padding: '10px 24px', fontSize: '0.875rem', fontWeight: '500', border: 'none' },

    reviewTitle: { color: '#111827', fontWeight: '600', fontSize: '1.1rem' },
    reviewBox: { backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '4px' },
    labelStyle: { fontSize: '0.75rem', fontWeight: '600', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' },
    inputStyle: { backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '10px 14px', fontSize: '0.875rem', color: '#111827', boxShadow: 'none' },
    submitReviewBtn: { backgroundColor: '#1D559F', color: '#FFFFFF', border: 'none', borderRadius: '4px', padding: '8px 20px', fontSize: '0.875rem', fontWeight: '500' },
    emptyReviewText: { fontSize: '0.875rem' }
};

export default DocumentDetailStyles;