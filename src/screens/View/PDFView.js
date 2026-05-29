import React from 'react';

const PdfViewer = ({ fileId, totalPages = 15 }) => {
  const baseUrl = "https://res.cloudinary.com/duk4u0tsp/image/upload";

  // Hàm chặn click chuột phải để hạn chế lưu ảnh
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  if (!fileId) {
      return <div className="text-center py-4">Đang tải tài liệu...</div>;
  }

  return (
    <div
      className="pdf-container"
      onContextMenu={handleContextMenu}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%)',
        padding: '32px 0',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: 900,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
      }}>
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNum = index + 1;
          return (
            <div
              key={pageNum}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'none',
              }}
            >
              <div
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 6px 24px 0 rgba(0,0,0,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.08)',
                  border: '1.5px solid #e5e7eb',
                  padding: '24px 0',
                  marginBottom: 8,
                  width: '90%',
                  maxWidth: 800,
                  transition: 'box-shadow 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className="pdf-page"
              >
                <img
                  src={`${baseUrl}/pg_${pageNum}/${fileId}.png`}
                  alt={`Trang ${pageNum}`}
                  style={{
                    width: '100%',
                    maxWidth: 760,
                    display: 'block',
                    margin: '0 auto',
                    background: '#fff',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    border: '1px solid #f3f4f6',
                    transition: 'box-shadow 0.2s',
                  }}
                  onError={e => { e.target.style.display = 'none'; }}
                  draggable={false}
                />
                <div style={{
                  position: 'absolute',
                  top: 8,
                  right: 24,
                  fontSize: 13,
                  color: '#9ca3af',
                  fontWeight: 500,
                  background: 'rgba(243,244,246,0.85)',
                  borderRadius: 6,
                  padding: '2px 10px',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}>
                  Trang {pageNum}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PdfViewer;