// dbMock.ts
export type BookStatus = 'planning' | 'reading' | 'done';

export interface Book {
  id: number;
  title: string;
  author?: string;
  status: BookStatus;
  created_at: number;
}

// Mock database in memory
let books: Book[] = [];

let idCounter = 1;

// Seed sample data
export const seedBooks = () => {
  if (books.length === 0) {
    books.push(
      { id: idCounter++, title: 'Clean Code', author: 'Robert C. Martin', status: 'planning', created_at: Date.now() },
      { id: idCounter++, title: 'Atomic Habits', author: 'James Clear', status: 'planning', created_at: Date.now() }
    );
  }
};

// CRUD operations
export const db = {
  all: () => Promise.resolve(books),
  insert: (title: string, author?: string) => {
    const newBook: Book = { id: idCounter++, title, author, status: 'planning', created_at: Date.now() };
    books.push(newBook);
    return Promise.resolve(newBook);
  },
  update: (id: number, data: Partial<Book>) => {
    const book = books.find(b => b.id === id);
    if (book) Object.assign(book, data);
    return Promise.resolve(book);
  },
  delete: (id: number) => {
    books = books.filter(b => b.id !== id);
    return Promise.resolve(true);
  }
};
