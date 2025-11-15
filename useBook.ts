// useBooks.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { db, Book, BookStatus, seedBooks } from './db';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<BookStatus | 'all'>('all');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    seedBooks();
    loadBooks();
  }, []);

  const loadBooks = useCallback(async () => {
    const data = await db.all();
    setBooks(data);
  }, []);

  const insertBook = useCallback(async (book: Book) => {
    const newBook = await db.insert(book.title, book.author);
    setBooks(prev => [...prev, newBook]);
  }, []);

  const updateBook = useCallback(async (book: Book) => {
    await db.update(book.id, book);
    setBooks(prev => prev.map(b => (b.id === book.id ? book : b)));
  }, []);

  const deleteBook = useCallback(async (id: number) => {
    await db.delete(id);
    setBooks(prev => prev.filter(b => b.id !== id));
  }, []);

  const changeStatus = useCallback(async (book: Book, nextStatus: BookStatus) => {
    await db.update(book.id, { ...book, status: nextStatus });
    setBooks(prev => prev.map(b => (b.id === book.id ? { ...book, status: nextStatus } : b)));
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter(b => {
      const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
      const matchesSearch = b.title.toLowerCase().includes(searchText.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [books, searchText, filterStatus]);

  const importBooksFromAPI = useCallback(async () => {
    setImporting(true);
    setImportError(null);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (!response.ok) throw new Error('Lỗi khi gọi API');
      const data: { title: string; author?: string }[] = await response.json();

      const existingTitles = books.map(b => b.title.toLowerCase());
      const newBooks: Book[] = [];

      for (const item of data) {
        if (!existingTitles.includes(item.title.toLowerCase())) {
          const book = await db.insert(item.title, item.author);
          newBooks.push(book);
        }
      }

      if (newBooks.length === 0) alert('Không có sách mới để import');
      setBooks(prev => [...prev, ...newBooks]);
    } catch (err: any) {
      setImportError(err.message || 'Lỗi không xác định');
    } finally {
      setImporting(false);
    }
  }, [books]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBooks();
    setRefreshing(false);
  }, [loadBooks]);

  return {
    books: filteredBooks,
    allBooks: books,
    searchText,
    setSearchText,
    filterStatus,
    setFilterStatus,
    insertBook,
    updateBook,
    deleteBook,
    changeStatus,
    importBooksFromAPI,
    importing,
    importError,
    refreshing,
    onRefresh,
  };
};
