/**
 * Table view of resource loading data
 */

import { useState, useMemo } from 'react';

export default function WaterfallTable({ resources }) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // Get color for resource type
  const getResourceColor = (type) => {
    const colors = {
      script: 'rgba(255, 235, 59, 0.1)',
      stylesheet: 'rgba(156, 39, 176, 0.1)',
      image: 'rgba(76, 175, 80, 0.1)',
      font: 'rgba(33, 150, 243, 0.1)',
      document: 'rgba(255, 152, 0, 0.1)',
      xhr: 'rgba(233, 30, 99, 0.1)',
      other: 'rgba(158, 158, 158, 0.1)'
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

  // Format bytes to KB/MB
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 KB';
    const kb = bytes / 1024;
    if (kb >= 1024) {
      return `${(kb / 1024).toFixed(2)} MB`;
    }
    return `${kb.toFixed(2)} KB`;
  };

  // Handle column header click
  const handleSort = (column) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        // Reset to no sort
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Sort resources
  const sortedResources = useMemo(() => {
    if (!sortColumn) return resources;

    return [...resources].sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      // For name column, use filename
      if (sortColumn === 'name') {
        aVal = getFileName(a.name);
        bVal = getFileName(b.name);
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [resources, sortColumn, sortDirection]);

  if (!resources || resources.length === 0) {
    return <div style={{ padding: '16px', color: '#666' }}>No resources found</div>;
  }

  const getSortIndicator = (column) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th
              onClick={() => handleSort('name')}
              style={{
                padding: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                borderBottom: '2px solid #ddd',
                userSelect: 'none'
              }}
            >
              Name{getSortIndicator('name')}
            </th>
            <th
              onClick={() => handleSort('type')}
              style={{
                padding: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                borderBottom: '2px solid #ddd',
                userSelect: 'none'
              }}
            >
              Type{getSortIndicator('type')}
            </th>
            <th
              onClick={() => handleSort('size')}
              style={{
                padding: '12px',
                textAlign: 'right',
                cursor: 'pointer',
                borderBottom: '2px solid #ddd',
                userSelect: 'none'
              }}
            >
              Size{getSortIndicator('size')}
            </th>
            <th
              onClick={() => handleSort('duration')}
              style={{
                padding: '12px',
                textAlign: 'right',
                cursor: 'pointer',
                borderBottom: '2px solid #ddd',
                userSelect: 'none'
              }}
            >
              Duration{getSortIndicator('duration')}
            </th>
            <th
              onClick={() => handleSort('startTime')}
              style={{
                padding: '12px',
                textAlign: 'right',
                cursor: 'pointer',
                borderBottom: '2px solid #ddd',
                userSelect: 'none'
              }}
            >
              Start Time{getSortIndicator('startTime')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedResources.map((resource, index) => {
            const fileName = getFileName(resource.name);
            const bgColor = getResourceColor(resource.type);

            return (
              <tr
                key={index}
                style={{
                  backgroundColor: bgColor,
                  borderBottom: '1px solid #eee'
                }}
              >
                <td
                  style={{
                    padding: '12px',
                    maxWidth: '400px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  title={resource.name}
                >
                  {fileName}
                </td>
                <td style={{ padding: '12px' }}>
                  {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  {formatSize(resource.size)}
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  {resource.duration} ms
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  {(resource.startTime / 1000).toFixed(2)} s
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
