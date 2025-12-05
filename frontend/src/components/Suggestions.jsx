/**
 * Display performance suggestions
 */

export default function Suggestions({ suggestions }) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div style={{ padding: '16px', color: '#666' }}>
        No suggestions available
      </div>
    );
  }

  // Sort suggestions by type priority
  const typePriority = { error: 0, warning: 1, info: 2, success: 3 };
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    return typePriority[a.type] - typePriority[b.type];
  });

  const getTypeStyles = (type) => {
    const styles = {
      error: {
        background: '#ffebee',
        border: '#f44336',
        color: '#d32f2f',
        icon: '⚠'
      },
      warning: {
        background: '#fff3e0',
        border: '#ff9800',
        color: '#e65100',
        icon: '⚠'
      },
      info: {
        background: '#e3f2fd',
        border: '#2196f3',
        color: '#1565c0',
        icon: 'ℹ'
      },
      success: {
        background: '#e8f5e9',
        border: '#4caf50',
        color: '#2e7d32',
        icon: '✓'
      }
    };
    return styles[type] || styles.info;
  };

  return (
    <div>
      {sortedSuggestions.map((suggestion, index) => {
        const typeStyles = getTypeStyles(suggestion.type);
        return (
          <div
            key={index}
            style={{
              backgroundColor: typeStyles.background,
              border: `1px solid ${typeStyles.border}`,
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}
          >
            <span style={{
              fontSize: '20px',
              color: typeStyles.color
            }}>
              {typeStyles.icon}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: 'bold',
                fontSize: '14px',
                color: typeStyles.color,
                marginBottom: '4px'
              }}>
                {suggestion.category}
              </div>
              <div style={{
                fontSize: '14px',
                color: typeStyles.color
              }}>
                {suggestion.message}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
