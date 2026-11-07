import { DailyActivity } from '../types';

export const getLocalDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDaysAgoDateString = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return getLocalDateString(d);
};

export const isDayActive = (act?: DailyActivity): boolean => {
  if (!act) return false;
  // A day counts if user read at least 1 page OR at least 5 minutes
  return act.pages >= 1 || act.minutes >= 5;
};

export const calculateStreak = (
  history: Record<string, DailyActivity>
): { currentStreak: number; longestStreak: number } => {
  const todayStr = getLocalDateString();
  const yesterdayStr = getDaysAgoDateString(1);

  const todayActive = isDayActive(history[todayStr]);
  const yesterdayActive = isDayActive(history[yesterdayStr]);

  let currentStreak = 0;

  if (todayActive) {
    // Start counting backwards from today
    currentStreak = 1;
    let daysBack = 1;
    while (true) {
      const pastDateStr = getDaysAgoDateString(daysBack);
      if (isDayActive(history[pastDateStr])) {
        currentStreak++;
        daysBack++;
      } else {
        break;
      }
    }
  } else if (yesterdayActive) {
    // Haven't read today yet, but yesterday was active, so streak is unbroken
    currentStreak = 1;
    let daysBack = 2;
    while (true) {
      const pastDateStr = getDaysAgoDateString(daysBack);
      if (isDayActive(history[pastDateStr])) {
        currentStreak++;
        daysBack++;
      } else {
        break;
      }
    }
  } else {
    currentStreak = 0;
  }

  // Calculate longest streak across all recorded history
  const allDates = Object.keys(history)
    .filter((d) => isDayActive(history[d]))
    .sort();

  let longestStreak = currentStreak;
  let tempStreak = 0;
  let lastDate: Date | null = null;

  for (const dateStr of allDates) {
    const currentDate = new Date(dateStr + 'T00:00:00');
    if (!lastDate) {
      tempStreak = 1;
    } else {
      const diffTime = currentDate.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    lastDate = currentDate;
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  return { currentStreak, longestStreak };
};

/**
 * Calculates estimated remaining reading time
 * Islamic study reading pace: ~2 minutes per page (تدبر وتأمل)
 */
export const calculateEstimatedTime = (
  remainingPages: number,
  avgMinutesPerPage: number = 2
): { minutes: number; formatted: string } => {
  if (remainingPages <= 0) {
    return { minutes: 0, formatted: 'مكتمل بحمد الله' };
  }

  const totalMinutes = Math.round(remainingPages * avgMinutesPerPage);

  if (totalMinutes < 60) {
    return {
      minutes: totalMinutes,
      formatted: `قرابة ${totalMinutes} دقيقة للختم`,
    };
  }

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (mins === 0) {
    return {
      minutes: totalMinutes,
      formatted: `قرابة ${hours} ${hours === 1 ? 'ساعة' : hours === 2 ? 'ساعتين' : 'ساعات'} للختم`,
    };
  }

  return {
    minutes: totalMinutes,
    formatted: `قرابة ${hours} س و ${mins} د للختم`,
  };
};
