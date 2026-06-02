import moment from "moment";
import DeleteButton from "../DeleteButton";
import { useContext } from "react";
import { MyUserContext } from "../../configs/Context";

const ReviewItem = ({ review, onDelete, isDeleting }) => {
    const [user,] = useContext(MyUserContext);
    const displayDate = review.createdDate || review.updatedDate;

    return (
        <div className="pb-4" style={{ borderBottom: '1px solid #E5E7EB', position: 'relative', paddingRight: '56px', paddingBottom: '44px' }}>
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
                <div className="d-flex align-items-center">
                </div>
            </div>

            <div style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.75rem', color: '#6B7280' }}>
                {displayDate ? moment(displayDate).fromNow() : 'Mới đây'}
            </div>

            {onDelete && review.user?.id === user?.id && (
                <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
                    <DeleteButton
                        onClick={() => {
                            if (window.confirm('Bạn có chắc muốn xóa bình luận này?')) {
                                onDelete(review);
                            }
                        }}
                        isLoading={isDeleting}
                    />
                </div>
            )}

            

            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: '1.5', margin: 0, paddingLeft: '44px' }}>
                {review.comment}
            </p>
        </div>
    )
}

export default ReviewItem;