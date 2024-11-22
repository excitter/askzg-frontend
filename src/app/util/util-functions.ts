export function currentDate(): string {
  const d = new Date();
  return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();
}

export function currentYear(): number {
  return new Date().getFullYear();
}

const statusMap: Map<string, string> = new Map<string, string>()
  .set('MEMBER', 'Član')
  .set('RECRUIT', 'Regrut')
  .set('INACTIVE', 'Nije u klubu');

export function toStatusName(key: string) {
  return statusMap.get(key);
}
