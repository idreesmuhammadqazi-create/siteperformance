/**
 * Horizontal chart visualization of resource loading
 */

import { useMemo } from 'react';

export default function Waterfall({ resources }) {
  // Calculate timeline
  const { maxTime, scale } = useMemo(() => {
    if (!resources || resources.length === 0) {
      return { maxTime: 0, scale: 1 };
    }

    const maxEndTime = Math.max(...resources.map(r => r.startTime + r.duration));
    const roundedMax = Math.ceil(maxEndTime / 1000) * 1000; // Round to nearest second
    const chartWidth = 800; // pixels
    const calculatedScale = chartWidth / roundedMax;

    return {
      maxTime: roundedMax,
      scale: calculatedScale
    };
  }, [resources]);

  // Get color for resource type
  const getResourceColor = (type) => {
    const colors = {
      script: '#ffeb3b',
      stylesheet: '#9c27b0',
      image: '#4caf50',
      font: '#2196f3',
      document: '#ff9800',
      xhr: '#e91e63',
      other: '#9e9e9e'
    };
    return colors[type] || colors.other;
  };

  // Extract filename from URL
  const getFileName = (url) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split('/').pop() || urlObj.hostname;
      return filename || url;
    } catch {
      return url;
    }
  };

  if (!resources || resources.length === 0) {
    return <div style={{ padding: '16px', color: '#666' }}>No resources found</div>;
  }

  // Generate time markers
  const timeMarkers = [];
  const markerInterval = 500; // 500ms intervals
  for (let i = 0; i <= maxTime; i += markerInterval) {
    timeMarkers.push(i);
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: '800px' }}>
        {/* Timeline header */}
        <div style={{
          display: 'flex',
          marginLeft: '220px',
          marginBottom: '8px',
          position: 'relative',
          height: '20px'
        }}>
          {timeMarkers.map(time => (
            <div
              key={time}
              style={{
                position: 'absolute',
                left: `${time * scale}px`,
                fontSize: '12px',
                color: '#666'
              }}
            >
              {(time / 1000).toFixed(1)}s
            </div>
          ))}
        </div>

        {/* Resource rows */}
        {resources.map((resource, index) => {
          const fileName = getFileName(resource.name);
          const barLeft = resource.startTime * scale;
          const barWidth = Math.max(resource.duration * scale, 2); // Minimum 2px width
          const color = getResourceColor(resource.type);

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '4px',
                height: '24px'
              }}
            >
              {/* Resource name */}
              <div
                style={{
                  width: '200px',
                  paddingRight: '12px',
                  fontSize: '12px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
                title={resource.name}
              >
                {fileName}
              </div>

              {/* Timeline container */}
              <div style={{
                position: 'relative',
                flex: 1,
                height: '20px',
                borderLeft: '1px solid #ddd'
              }}>
                {/* Resource bar */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${barLeft}px`,
                    width: `${barWidth}px`,
                    height: '16px',
                    backgroundColor: color,
                    border: '1px solid rgba(0,0,0,0.2)',
                    borderRadius: '2px',
                    cursor: 'pointer'
                  }}
                  title={`${resource.name}\nType: ${resource.type}\nSize: ${(resource.size / 1024).toFixed(2)} KB\nDuration: ${resource.duration}ms\nStart: ${resource.startTime}ms`}
                />
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div style={{
          marginTop: '24px',
          marginLeft: '220px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '12px'
        }}>
          {['script', 'stylesheet', 'image', 'font', 'document', 'xhr', 'other'].map(type => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: getResourceColor(type),
                border: '1px solid rgba(0,0,0,0.2)',
                borderRadius: '2px'
              }} />
              <span>{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
