import React, { useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { PathScreen } from './screens/PathScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { BookDetailModal } from './screens/BookDetailModal';
import { ReaderModal } from './screens/ReaderModal';
import { CelebrationModal } from './components/CelebrationModal';
import { WelcomeModal } from './components/WelcomeModal';
import { Book } from './types';

export const App: React.FC = () => {
  const store = useAppStore();
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [readingBook, setReadingBook] = useState<Book | null>(null);
  const [readerStartPage, setReaderStartPage] = useState<number>(1);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  const overallProgress = store.getOverallProgress();
  const getLevelPercentage = (level: number) => store.getLevelProgress(level).percentage;

  const handleOpenBookDetail = (book: Book) => {
    setSelectedBook(book);
  };

  const handleStartReading = (book: Book, startPage?: number) => {
    setSelectedBook(null);
    setReadingBook(book);
    setReaderStartPage(startPage || store.progress[book.id]?.current_page || 1);
  };

  const handleCycleTheme = () => {
    const cycle = {
      midnight: 'emerald',
      emerald: 'parchment',
      parchment: 'midnight',
    } as const;
    store.setTheme(cycle[store.theme]);
  };

  const handleNextBookAfterCelebration = () => {
    if (!store.celebrationBook) return;
    const currentOrder = store.celebrationBook.order;
    const currentLevel = store.celebrationBook.level;
    const nextInLevel = store.books.find(
      (b) => b.level === currentLevel && b.order === currentOrder + 1
    );
    if (nextInLevel) {
      setSelectedBook(nextInLevel);
    } else {
      const nextLevelBook = store.books.find((b) => b.level === currentLevel + 1);
      if (nextLevelBook) setSelectedBook(nextLevelBook);
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text font-cairo flex flex-col selection:bg-theme-accent/20 selection:text-theme-accent">
      {/* Top Header */}
      <Header
        stats={store.stats}
        theme={store.theme}
        onThemeToggle={handleCycleTheme}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4 pb-28">
        {activeTab === 'home' && (
          <HomeScreen
            books={store.books}
            progress={store.progress}
            stats={store.stats}
            overallProgress={overallProgress}
            onOpenBook={handleOpenBookDetail}
            onNavigateToPath={() => setActiveTab('path')}
          />
        )}

        {activeTab === 'path' && (
          <PathScreen
            books={store.books}
            progress={store.progress}
            getLevelProgress={getLevelPercentage}
            onOpenBook={handleOpenBookDetail}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressScreen
            books={store.books}
            progress={store.progress}
            stats={store.stats}
            overallProgress={overallProgress}
            getLevelProgress={getLevelPercentage}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            theme={store.theme}
            readerTheme={store.readerTheme}
            books={store.books}
            currentStreak={store.stats.streak_days}
            onThemeChange={store.setTheme}
            onReaderThemeChange={store.setReaderTheme}
            onExport={store.exportBackup}
            onImport={store.importBackup}
            onResetStreak={store.resetToRealStreak}
            onSimulateStreak={store.simulateStreakIncrement}
          />
        )}
      </main>

      {/* Persistent Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Book Detail Modal */}
      <BookDetailModal
        book={selectedBook}
        progress={selectedBook ? store.progress[selectedBook.id] : undefined}
        notes={store.notes}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        onStartReading={(book, p) => handleStartReading(book, p)}
        onMarkFinished={store.markBookFinished}
        onAttachPdf={store.attachLocalPdf}
        onAddNote={store.addNote}
        onDeleteNote={store.deleteNote}
      />

      {/* Dedicated Reader Modal / View */}
      <ReaderModal
        book={readingBook}
        startPage={readerStartPage}
        isOpen={!!readingBook}
        readerTheme={store.readerTheme}
        onClose={() => setReadingBook(null)}
        onPageChange={(bookId, page) => store.updateBookProgress(bookId, page)}
        onAddNote={store.addNote}
        onReaderThemeChange={store.setReaderTheme}
        onRecordReadingSession={store.recordReadingSession}
      />

      {/* Book Completion Celebration Modal */}
      <CelebrationModal
        book={store.celebrationBook}
        isOpen={!!store.celebrationBook}
        onClose={() => store.setCelebrationBook(null)}
        onNextBook={handleNextBookAfterCelebration}
      />

      {/* Opening Spiritual Welcome & Intention Modal */}
      <WelcomeModal
        isOpen={showWelcome}
        theme={store.theme}
        stats={store.stats}
        overallProgress={overallProgress}
        onEnterApp={() => setShowWelcome(false)}
      />
    </div>
  );
};

export default App;
