import moment from "moment";

const ReviewItem = ({ review }) => {
    const displayDate = review.createdDate || review.updatedDate;

    return (
        <div className="pb-4" style={{ borderBottom: '1px solid #E5E7EB' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center">
                    <img 
                        src={review.user?.avatar || `https://ui-avatars.com/api/?name=${review.user?.username || 'U'}&background=EFF6FF&color=1D559F`} 
                        alt={review.user?.username}
                        style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%', 
                            objectFit: 'cover',
                            border: '1px solid #E5E7EB',
                            marginRight: '12px'
                        }} 
                    />
                    <div>
                        <span className="fw-semibold text-dark me-3" style={{ fontSize: '0.875rem' }}>
                            @{review.user?.username}
                        </span>
                        <span style={{ color: '#F59E0B', fontSize: '0.85rem' }}>
                            {'⭐'.repeat(review.rating)}
                        </span>
                    </div>
                </div>
                
                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                    {displayDate ? moment(displayDate).fromNow() : 'Mới đây'}
                </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: '1.5', margin: 0, paddingLeft: '44px' }}>
                {review.comment}
            </p>
        </div>
    )
}

export default ReviewItem;