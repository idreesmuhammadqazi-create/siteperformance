/**
 * Error message display component
 */

export default function ErrorMessage({ message }) {
  return (
    <div style={{
      backgroundColor: '#ffebee',
      border: '1px solid #f44336',
      borderRadius: '8px',
      padding: '16px',
      color: '#d32f2f',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <span style={{ fontSize: '20px' }}>✕</span>
      <span>{message}</span>
    </div>
  );
}
