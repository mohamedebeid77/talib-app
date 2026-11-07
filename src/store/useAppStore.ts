import { useState, useEffect, useCallback } from 'react';
import initialBooksData from '../data/books.json';
import { Book, BookProgress, UserStats, UserNote, AppTheme, ReaderTheme, DailyActivity } from '../types';
import { getLocalDateString, getDaysAgoDateString, calculateStreak } from '../utils/streakUtils';

const STORAGE_KEY_PROGRESS = 'talib_progress_v2';
const STORAGE_KEY_STATS = 'talib_stats_v2';
const STORAGE_KEY_THEME = 'talib_theme_v2';
const STORAGE_KEY_NOTES = 'talib_notes_v2';

const getInitialHistory = (): Record<string, DailyActivity> => {
  const today = getLocalDateString();
  const yesterday = getDaysAgoDateString(1);
  const dayBefore = getDaysAgoDateString(2);

  return {
    [dayBefore]: {
      date: dayBefore,
      minutes: 15,
      pages: 8,
      books_read: ['usul-thalatha'],
    },
    [yesterday]: {
      date: yesterday,
      minutes: 20,
      pages: 10,
      books_read: ['usul-thalatha'],
    },
    [today]: {
      date: today,
      minutes: 6,
      pages: 3,
      books_read: ['usul-thalatha'],
    },
  };
};

const getInitialStats = (): UserStats => {
  const history = getInitialHistory();
  const todayStr = getLocalDateString();
  const { currentStreak, longestStreak } = calculateStreak(history);
  const todayAct = history[todayStr] || { minutes: 0, pages: 0, books_read: [] };

  return {
    streak_days: currentStreak,
    longest_streak: longestStreak,
    last_active_date: todayStr,
    minutes_read_today: todayAct.minutes,
    pages_read_today: todayAct.pages,
    total_minutes_read: 41,
    active_book_id: 'usul-thalatha',
    activity_history: history,
  };
};

const getInitialProgress = (): Record<string, BookProgress> => {
  return {
    'usul-thalatha': {
      book_id: 'usul-thalatha',
      current_page: 8,
      total_pages: 28,
      is_finished: false,
      last_read_timestamp: Date.now() - 3600000 * 2,
    },
    'qawaid-arbaa': {
      book_id: 'qawaid-arbaa',
      current_page: 0,
      total_pages: 16,
      is_finished: false,
      last_read_timestamp: 0,
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
      return saved ? JSON.parse(saved) : [
        {
          id: 'note-1',
          book_id: 'usul-thalatha',
          page_number: 4,
          content: 'الأصل الأول: معرفة العبد ربه بالآيات والمخلوقات، والفرق بين آيات الله ومصنوعاته.',
          created_at: Date.now() - 86400000,
        }
      ];
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

  const attachLocalPdf = (bookId: string, filename: string, sizeBytes: number, pagesCount: number) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? {
              ...b,
              pdf_filename: filename,
              size_bytes: sizeBytes,
              pages: pagesCount || b.pages,
            }
          : b
      )
    );
  };

  const getOverallProgress = () => {
    const coreBooks = books.filter((b) => b.level <= 3);
    if (!coreBooks.length) return 0;

    let totalWeight = 0;
    let completedWeight = 0;

    coreBooks.forEach((book) => {
      const bookPages = book.pages || 30;
      totalWeight += bookPages;
      const p = progress[book.id];
      if (p) {
        if (p.is_finished) {
          completedWeight += bookPages;
        } else {
          completedWeight += (p.current_page / (p.total_pages || bookPages)) * bookPages;
        }
      }
    });

    return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
  };

  const getLevelProgress = (levelNumber: number) => {
    const levelBooks = books.filter((b) => b.level === levelNumber);
    if (!levelBooks.length) return 0;

    let totalPercentage = 0;
    levelBooks.forEach((b) => {
      const p = progress[b.id];
      if (p) {
        if (p.is_finished) {
          totalPercentage += 100;
        } else {
          const total = p.total_pages || b.pages || 1;
          totalPercentage += Math.min(100, Math.round((p.current_page / total) * 100));
        }
      }
    });

    return Math.round(totalPercentage / levelBooks.length);
  };

  const exportBackup = () => {
    return JSON.stringify(
      {
        version: 2,
        exported_at: new Date().toISOString(),
        progress,
        stats,
        notes,
        theme,
      },
      null,
      2
    );
  };

  const importBackup = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.progress) setProgress(data.progress);
      if (data.stats) setStats(data.stats);
      if (data.notes) setNotes(data.notes);
      if (data.theme) setTheme(data.theme);
      return true;
    } catch (err) {
      console.error('Failed to import backup:', err);
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
    markBookFinished,
    recordReadingSession,
    addNote,
    deleteNote,
    attachLocalPdf,
    getOverallProgress,
    getLevelProgress,
    exportBackup,
    importBackup,
  };
};
