export const librarianDashboardStyle = {
  dashboardMainContent: {
    padding: '24px',
    backgroundColor: '#f8fafc',
    fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
    minWidth: 0,
    boxSizing: 'border-box',
    overflowX: 'hidden',
  },

  dashboardTitle: {
    color: '#1e293b',
    marginBottom: '24px',
    fontSize: '1.8rem',
    fontWeight: 600,
  },

  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
    marginBottom: '24px',
  },

  chartCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },

  chartCardTitle: {
    marginTop: 0,
    color: '#475569',
    fontSize: '1.1rem',
    marginBottom: '20px',
    textAlign: 'center',
  },

  tableSection: {
    width: '100%',
  },

  statCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },

  statCardTitle: {
    marginTop: 0,
    color: '#e11d48',
    fontSize: '1.2rem',
    marginBottom: '16px',
  },

  tableResponsive: {
    overflowX: 'auto',
  },

  overdueTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },

  overdueTableCell: {
    padding: '14px 16px',
    textAlign: 'left',
    borderBottom: '1px solid #e2e8f0',
  },

  overdueTableHeader: {
    backgroundColor: '#f1f5f9',
    color: '#334155',
    fontWeight: 600,
  },

  overdueTableRowHover: {
    backgroundColor: '#f8fafc',
  },

  textDanger: {
    color: '#ef4444',
    fontWeight: 'bold',
  },

  badgeUser: {
    background: '#e0f2fe',
    color: '#0369a1',
    padding: '4px 10px',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: 500,
  },

  loadingSpinner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    fontSize: '1.2rem',
    color: '#64748b',
  },

  responsiveChartsGrid: {
    gridTemplateColumns: '1fr',
  }
};
