// Heart rate utility functions

export const getZoneColor = (zoneName: string): string => {
  const colors: Record<string, string> = {
    Resting: '#52c41a',
    Light: '#1890ff',
    Moderate: '#faad14',
    Vigorous: '#ff7a45',
    Maximum: '#f5222d',
  };
  return colors[zoneName] || '#d9d9d9';
};

export const getGradeColor = (grade: string): string => {
  const colors: Record<string, string> = {
    'A+': '#52c41a',
    A: '#73d13d',
    'B+': '#95de64',
    B: '#bae637',
    'C+': '#fadb14',
    C: '#ffc53d',
    D: '#ff7a45',
    F: '#f5222d',
  };
  return colors[grade] || '#d9d9d9';
};

export const getSeverityColor = (severity: string): string => {
  const colors: Record<string, string> = {
    low: '#1890ff',
    medium: '#faad14',
    high: '#f5222d',
  };
  return colors[severity] || '#d9d9d9';
};

export const formatBPM = (value: number): string => {
  return `${Math.round(value)} BPM`;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
