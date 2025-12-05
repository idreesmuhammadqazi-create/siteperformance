/**
 * Display single metric with label and value
 */

export default function MetricCard({ label, value, unit, color }) {
  const displayValue = value === null || value === undefined ? 'N/A' : value;
  const isNA = value === null || value === undefined;

  return (
    <div style={{
      padding: '16px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: color || '#fff',
      minWidth: '200px'
    }}>
      <div style={{
        fontSize: '14px',
        color: '#666',
        marginBottom: '8px'
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: isNA ? '#999' : '#333'
      }}>
        {displayValue}
        {!isNA && unit && (
          <span style={{
            fontSize: '16px',
            fontWeight: 'normal',
            marginLeft: '4px'
          }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
