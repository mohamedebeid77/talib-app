import { useState, useEffect, useCallback } from 'react';
import initialBooksData from '../data/books.json';
import { Book, BookProgress, UserStats, UserNote, AppTheme, ReaderTheme, DailyActivity } from '../types';
import { getLocalDateString, getDaysAgoDateString, calculateStreak } from '../utils/streakUtils';

const STORAGE_KEY_PROGRESS = 'talib_progress_v3';
const STORAGE_KEY_STATS = 'talib_stats_v3';
const STORAGE_KEY_THEME = 'talib_theme_v3';
const STORAGE_KEY_NOTES = 'talib_notes_v3';

const getInitialHistory = (): Record<string, DailyActivity> => {
  const today = getLocalDateString();
  return {
    [today]: {
      date: today,
      minutes: 0,
      pages: 0,
      books_read: [],
    },
  };
};

const getInitialStats = (): UserStats => {
  const todayStr = getLocalDateString();
  return {
    streak_days: 0,
    longest_streak: 0,
    last_active_date: todayStr,
    minutes_read_today: 0,
    pages_read_today: 0,
    total_minutes_read: 0,
    active_book_id: 'usul-thalatha',
    activity_history: getInitialHistory(),
  };
};

const getInitialProgress = (): Record<string, BookProgress> => {
  return {
    'usul-thalatha': {
      book_id: 'usul-thalatha',
      current_page: 1,
      total_pages: 28,
      is_finished: false,
      last_read_timestamp: Date.now(),
    },
  };
};

export const useAppStore = () => {
  const [books, setBooks] = useState<Book[]>(initialBooksData as Book[]);
  
  const [progress, setProgress] = useState<Record<string, BookProgress>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      return saved ? JSON.parse(saved) : getInitialProgress();
    } catch {
      return getInitialProgress();
    }
  });

  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATS);
      if (saved) {
        const parsed: UserStats = JSON.parse(saved);
        // Recalculate today's real streak dynamically relative to current date
        const todayStr = getLocalDateString();
        const history = parsed.activity_history || {};
        const { currentStreak, longestStreak } = calculateStreak(history);
        const todayAct = history[todayStr] || { minutes: 0, pages: 0, books_read: [] };

        return {
          ...parsed,
          streak_days: currentStreak,
          longest_streak: Math.max(longestStreak, parsed.longest_streak || 0),
          last_active_date: todayStr,
          minutes_read_today: todayAct.minutes,
          pages_read_today: todayAct.pages,
        };
      }
      return getInitialStats();
    } catch {
      return getInitialStats();
    }
  });

  const [theme, setThemeState] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      return (saved as AppTheme) || 'midnight';
    } catch {
      return 'midnight';
    }
  });

  const [readerTheme, setReaderTheme] = useState<ReaderTheme>('dark');
  const [celebrationBook, setCelebrationBook] = useState<Book | null>(null);

  const [notes, setNotes] = useState<UserNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
    } catch (e) {
      console.error(e);
    }
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
    } catch (e) {
      console.error(e);
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
      document.body.setAttribute('data-theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
    } catch (e) {
      console.error(e);
    }
  }, [notes]);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
  };

  /**
   * Real reading activity logger
   * Accurately updates daily minutes, pages, and streak
   */
  const recordReadingSession = useCallback((bookId: string, addedMinutes: number, addedPages: number = 0) => {
    const todayStr = getLocalDateString();

    setStats((prev) => {
      const history = { ...prev.activity_history };
      const currentDay = history[todayStr] || {
        date: todayStr,
        minutes: 0,
        pages: 0,
        books_read: [],
      };

      const updatedDay: DailyActivity = {
        ...currentDay,
        minutes: currentDay.minutes + addedMinutes,
        pages: currentDay.pages + addedPages,
        books_read: currentDay.books_read.includes(bookId)
          ? currentDay.books_read
          : [...currentDay.books_read, bookId],
      };

      history[todayStr] = updatedDay;

      // Recalculate streak in real-time
      const { currentStreak, longestStreak } = calculateStreak(history);

      return {
        ...prev,
        active_book_id: bookId,
        minutes_read_today: updatedDay.minutes,
        pages_read_today: updatedDay.pages,
        total_minutes_read: prev.total_minutes_read + addedMinutes,
        streak_days: currentStreak,
        longest_streak: Math.max(longestStreak, prev.longest_streak),
        activity_history: history,
      };
    });
  }, []);

  const updateBookProgress = (bookId: string, page: number, totalPages?: number, isFinished?: boolean) => {
    const book = books.find((b) => b.id === bookId);
    const total = totalPages || book?.pages || 30;
    const finished = isFinished !== undefined ? isFinished : page >= total;

    // Check if pages advanced to count real reading
    const prevPage = progress[bookId]?.current_page || 0;
    const pagesAdvanced = Math.max(0, page - prevPage);
    if (pagesAdvanced > 0) {
      recordReadingSession(bookId, 1, pagesAdvanced);
    }

    setProgress((prev) => ({
      ...prev,
      [bookId]: {
        book_id: bookId,
        current_page: Math.min(page, total),
        total_pages: total,
        is_finished: finished,
        last_read_timestamp: Date.now(),
      },
    }));

    // Trigger celebration if newly finished
    if (finished && !progress[bookId]?.is_finished && book) {
      setCelebrationBook(book);
    }
  };

  const markBookFinished = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    const pages = book?.pages || 30;
    updateBookProgress(bookId, pages, pages, true);
    if (book) {
      setCelebrationBook(book);
    }
  };

  const addNote = (bookId: string, pageNumber: number, content: string) => {
    const newNote: UserNote = {
      id: 'note-' + Date.now(),
      book_id: bookId,
      page_number: pageNumber,
      content,
      created_at: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const attachLocalPdf = (bookId: string, fileName: string) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, pdf_filename: fileName } : b))
    );
  };

  const getLevelProgress = (levelNum: number): { completed: number; total: number; percentage: number } => {
    const levelBooks = books.filter((b) => b.level === levelNum);
    const total = levelBooks.length;
    if (total === 0) return { completed: 0, total: 0, percentage: 0 };

    const completed = levelBooks.filter((b) => progress[b.id]?.is_finished).length;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  };

  const getOverallProgress = (): number => {
    const coreBooks = books.filter((b) => b.level <= 3);
    if (coreBooks.length === 0) return 0;
    const finished = coreBooks.filter((b) => progress[b.id]?.is_finished).length;
    return Math.round((finished / coreBooks.length) * 100);
  };

  // Reset to authentic 0-day clean streak
  const resetToRealStreak = () => {
    const todayStr = getLocalDateString();
    const freshStats: UserStats = {
      streak_days: 0,
      longest_streak: 0,
      last_active_date: todayStr,
      minutes_read_today: 0,
      pages_read_today: 0,
      total_minutes_read: 0,
      active_book_id: 'usul-thalatha',
      activity_history: {
        [todayStr]: {
          date: todayStr,
          minutes: 0,
          pages: 0,
          books_read: [],
        },
      },
    };
    setStats(freshStats);
  };

  // Simulation tool for testing streak accumulation (adds active reading to yesterday/earlier)
  const simulateStreakIncrement = () => {
    setStats((prev) => {
      const history = { ...prev.activity_history };
      const daysBack = (prev.streak_days || 0) + 1;
      const pastDate = getDaysAgoDateString(daysBack);
      history[pastDate] = {
        date: pastDate,
        minutes: 20,
        pages: 6,
        books_read: ['usul-thalatha'],
      };
      const { currentStreak, longestStreak } = calculateStreak(history);
      return {
        ...prev,
        streak_days: currentStreak,
        longest_streak: Math.max(longestStreak, prev.longest_streak),
        activity_history: history,
      };
    });
  };

  // Export JSON backup
  const exportBackup = (): string => {
    return JSON.stringify({
      version: 3,
      exported_at: new Date().toISOString(),
      stats,
      progress,
      notes,
      theme,
      readerTheme,
    }, null, 2);
  };

  // Import JSON backup
  const importBackup = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.stats) setStats(data.stats);
      if (data.progress) setProgress(data.progress);
      if (data.notes) setNotes(data.notes);
      if (data.theme) setThemeState(data.theme);
      if (data.readerTheme) setReaderTheme(data.readerTheme);
      return true;
    } catch {
      return false;
    }
  };

  return {
    books,
    progress,
    stats,
    theme,
    readerTheme,
    notes,
    celebrationBook,
    setCelebrationBook,
    setTheme,
    setReaderTheme,
    updateBookProgress,
    recordReadingSession,
    markBookFinished,
    addNote,
    deleteNote,
    attachLocalPdf,
    getLevelProgress,
    getOverallProgress,
    resetToRealStreak,
    simulateStreakIncrement,
    exportBackup,
    importBackup,
  };
};
