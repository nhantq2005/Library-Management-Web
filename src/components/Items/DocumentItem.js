const DocumentItem = ({ document }) => {
  return (
    <div className="document-item">
        <h5 className="document-title">{document.title}</h5>
        <p className="document-author">Tác giả: {document.author}</p>
        <p className="document-category">Danh mục: {document.category}</p>
        <p className="document-publisher">Nhà xuất bản: {document.publisher}</p>
        <p className="document-year">Năm xuất bản: {document.year}</p>
    </div>
  );
}

export default DocumentItem;