export type BookCategory = 
  | 'عقيدة'
  | 'فقه'
  | 'حديث'
  | 'تفسير'
  | 'سيرة وتاريخ'
  | 'إصلاح القلوب'
  | 'تجويد';

export interface Book {
  id: string;
  title_ar: string;
  author_ar: string;
  level: number; // 1, 2, 3 for core levels, 4 for extras/إضافات
  level_name?: string;
  category: BookCategory;
  order: number;
  description_ar?: string;
  pdf_filename: string | null;
  source_url: string | null;
  size_bytes: number | null;
  pages: number | null;
  cover_color?: string;
}

export interface BookProgress {
  book_id: string;
  current_page: number;
  total_pages: number;
  is_finished: boolean;
  last_read_timestamp: number;
  notes_count?: number;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  minutes: number;
  pages: number;
  books_read: string[];
}

export interface UserStats {
  streak_days: number;
  longest_streak: number;
  last_active_date: string; // YYYY-MM-DD
  minutes_read_today: number;
  pages_read_today: number;
  total_minutes_read: number;
  active_book_id: string | null;
  activity_history: Record<string, DailyActivity>;
}

export interface UserNote {
  id: string;
  book_id: string;
  page_number: number;
  content: string;
  created_at: number;
}

export type AppTheme = 'midnight' | 'emerald' | 'parchment';
export type ReaderTheme = 'dark' | 'sepia' | 'slate';
