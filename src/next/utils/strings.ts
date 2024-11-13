import { User } from '@/payload-types';

export function toLongDateString(dbString?: string | null): string {
  return dbString
    ? new Date(dbString).toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Europe/Berlin',
      })
    : '';
}

export function toShortDateString(dbString?: string | null): string {
  return dbString
    ? new Date(dbString).toLocaleDateString('de-DE', {
        weekday: 'short',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Europe/Berlin',
      })
    : '';
}

export function toTimeString(dbString?: string | null): string {
  return dbString
    ? new Date(dbString).toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h24',
        timeZone: 'Europe/Berlin',
      })
    : '';
}

export function toInstrumentsString(instruments?: User['instruments'] | null): string {
  const longInstruments = instruments
    ?.sort((a, b) => instrumentsToSortNumber([a]) - instrumentsToSortNumber([b]))
    ?.map((instrument) => {
      switch (instrument) {
        case 'trp':
          return 'trompeten';
        case 'flg':
          return 'flügelhorn';
        case 'hrn':
          return 'horn';
        case 'trb':
          return 'posaune';
        case 'eup':
          return 'euphonium';
        case 'tub':
          return 'tuba';
        case 'org':
          return 'orgel';
        case 'pcs':
          return 'schlagwerk';
        case 'dir':
          return 'dirigat';
      }
    });
  return longInstruments?.join(', ') ?? '';
}

export function instrumentsToSortNumber(instruments?: User['instruments']): number {
  if (instruments?.includes('trp')) {
    return 1;
  }
  if (instruments?.includes('flg')) {
    return 2;
  }
  if (instruments?.includes('hrn')) {
    return 3;
  }
  if (instruments?.includes('trb')) {
    return 4;
  }
  if (instruments?.includes('eup')) {
    return 5;
  }
  if (instruments?.includes('tub')) {
    return 6;
  }
  if (instruments?.includes('org')) {
    return 7;
  }
  if (instruments?.includes('pcs')) {
    return 8;
  }
  if (instruments?.includes('dir')) {
    return 9;
  }
  return 10;
}
