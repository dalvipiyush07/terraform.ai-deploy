import JSZip from 'jszip';

export const exportAsZip = async (files: { [key: string]: string }, projectName: string) => {
  const zip = new JSZip();
  
  Object.entries(files).forEach(([filename, content]) => {
    zip.file(filename, content);
  });
  
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName}-terraform.zip`;
  a.click();
  URL.revokeObjectURL(url);
};

export const validateTerraform = (code: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!code.trim()) return { valid: true, errors };
  
  const lines = code.split('\n');
  let braceCount = 0;
  
  lines.forEach((line, idx) => {
    braceCount += (line.match(/{/g) || []).length;
    braceCount -= (line.match(/}/g) || []).length;
    
    if (braceCount < 0) {
      errors.push(`Line ${idx + 1}: Unmatched closing brace`);
    }
  });
  
  if (braceCount !== 0) {
    errors.push('Mismatched braces in file');
  }
  
  if (code.includes('resource') && !code.match(/resource\s+"[^"]+"\s+"[^"]+"/)) {
    errors.push('Invalid resource syntax');
  }
  
  return { valid: errors.length === 0, errors };
};

export const copyAllFiles = (files: { [key: string]: string }): void => {
  const content = Object.entries(files)
    .map(([name, code]) => `# ${name}\n\n${code}`)
    .join('\n\n' + '='.repeat(80) + '\n\n');
  
  navigator.clipboard.writeText(content);
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hrs = date.getHours().toString().padStart(2, '0');
  const mins = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hrs}:${mins}`;
};
