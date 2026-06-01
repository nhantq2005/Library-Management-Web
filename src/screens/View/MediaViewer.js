import React from 'react';
import { Button, Container } from 'react-bootstrap';

const videoTypes = ['mp4', 'mov', 'webm', 'avi', 'mkv'];
const audioTypes = ['mp3', 'wav', 'm4a', 'aac', 'ogg'];

const MediaViewer = ({ src, title, fileType, onBack }) => {
    const normalizedType = (fileType || '').toLowerCase();
    const isVideo = videoTypes.includes(normalizedType);
    const isAudio = audioTypes.includes(normalizedType);

    if (!src) {
        return <div className="text-center py-4">Đang tải nội dung...</div>;
    }

    return (
        <div style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%)', minHeight: '100vh', padding: '32px 0' }}>
            <Container style={{ maxWidth: '1050px', padding: 0 }}>
                <Button variant="outline-secondary" className="mb-3" onClick={onBack} style={{ borderRadius: '6px' }}>
                    &larr; Quay lại chi tiết tài liệu
                </Button>
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #E5E7EB', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)' }}>
                    <div className="mb-3" style={{ color: '#0F172A', fontWeight: 700 }}>
                        {title} {normalizedType ? `(${normalizedType.toUpperCase()})` : ''}
                    </div>
                    {isVideo ? (
                        <video
                            src={src}
                            controls
                            controlsList="nodownload noplaybackrate"
                            disablePictureInPicture
                            onContextMenu={(e) => e.preventDefault()}
                            style={{ width: '100%', maxHeight: '75vh', borderRadius: '10px', backgroundColor: '#000' }}
                        />
                    ) : isAudio ? (
                        <audio
                            src={src}
                            controls
                            controlsList="nodownload noplaybackrate"
                            onContextMenu={(e) => e.preventDefault()}
                            style={{ width: '100%' }}
                        />
                    ) : (
                        <div style={{ color: '#334155' }}>
                            Định dạng này chưa được hỗ trợ để phát trực tiếp.
                        </div>
                    )}
                    <div className="mt-3" style={{ color: '#64748B', fontSize: '0.875rem' }}>
                        Player này chỉ ẩn nút tải xuống trong giao diện.
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default MediaViewer;