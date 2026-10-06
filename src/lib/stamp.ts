export function memberStamp(iso: string) {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return iso;
  return `${match[3]}/${match[2]}/${match[1]} ${match[4]}:${match[5]}`;
}
