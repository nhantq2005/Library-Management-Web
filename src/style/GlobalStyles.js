const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    body {
      font-family: 'Inter', sans-serif;
      background-color: #f9fafb;
      color: #1f2937;
    }
    a { text-decoration: none; }
    a:hover { color: #154078; }
    .btn-primary { background-color: #1D559F !important; border-color: #1D559F !important; }
    .btn-primary:hover { background-color: #154078 !important; border-color: #154078 !important; }
    .card { transition: transform 0.2s, box-shadow 0.2s; border-radius: 8px; border: 1px solid #e5e7eb; }
    .card:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
  `}</style>
);

export default GlobalStyles;
