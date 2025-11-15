import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity, Alert, TextInput } from 'react-native';
import { db, seedBooks, Book, BookStatus } from './db';
import AddBookModal from './AddBookModal';
import EditBookModal from './EditBookModal';

// Các trạng thái sách có thể có
const statusCycle: BookStatus[] = ['planning', 'reading', 'done'];

const BooksList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Câu 8: search & filter
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<BookStatus | 'all'>('all');

  useEffect(() => {
    seedBooks();
    db.all().then(setBooks);
  }, []);

  const handleAddBook = (book: Book) => {
    setBooks(prev => [...prev, book]);
  };

  const handleUpdateBook = (updated: Book) => {
    setBooks(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  const handlePress = async (book: Book) => {
    const currentIndex = statusCycle.indexOf(book.status);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
    await db.update(book.id, { status: nextStatus });
    const updatedBooks = await db.all();
    setBooks(updatedBooks);
  };

  const handleDelete = (book: Book) => {
    Alert.alert(
      "Xác nhận xóa sách",
      `Bạn có chắc chắn muốn xóa sách "${book.title}"?`,
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", style: "destructive", onPress: async () => {
            await db.delete(book.id);
            const updatedBooks = await db.all();
            setBooks(updatedBooks);
          }
        }
      ]
    );
  };

  const handleEdit = (book: Book) => {
    setEditBook(book);
    setEditModalVisible(true);
  };

  // Câu 8: lọc và search sách dùng useMemo để tối ưu
  const filteredBooks = useMemo(() => {
    return books.filter(b => {
      const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
      const matchesSearch = b.title.toLowerCase().includes(searchText.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [books, searchText, filterStatus]);

  const renderItem = useCallback(({ item }: { item: Book }) => {
    let bgColor = '#fff';
    if (item.status === 'reading') bgColor = '#ffeaa7';
    if (item.status === 'done') bgColor = '#55efc4';

    return (
      <TouchableOpacity
        onPress={() => handlePress(item)}
        style={[styles.item, { backgroundColor: bgColor }]}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>{item.author || 'Unknown'}</Text>
        <Text style={styles.status}>{item.status}</Text>
        <Button title="Sửa" onPress={() => handleEdit(item)} />
        <Button title="Xóa" onPress={() => handleDelete(item)} />
      </TouchableOpacity>
    );
  }, [books]);

  return (
    <View style={styles.container}>
      {/* Câu 8: Search Input */}
      <TextInput
        style={styles.input}
        placeholder="Tìm theo tên sách..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Câu 8: Filter theo status */}
      <View style={styles.filterContainer}>
        {(['all', ...statusCycle] as (BookStatus | 'all')[]).map(status => (
          <Button
            key={status}
            title={status === 'all' ? 'Tất cả' : status}
            onPress={() => setFilterStatus(status)}
            color={filterStatus === status ? '#0984e3' : '#b2bec3'}
          />
        ))}
      </View>

      <Button title="Thêm sách" onPress={() => setModalVisible(true)} />

      {filteredBooks.length === 0 ? (
        <Text>Không tìm thấy sách phù hợp.</Text>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}

      <AddBookModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddBook}
      />

      <EditBookModal
        visible={editModalVisible}
        book={editBook}
        onClose={() => setEditModalVisible(false)}
        onUpdate={handleUpdateBook}
      />
    </View>
  );
};

export default BooksList;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#ccc', borderRadius: 6 },
  title: { fontSize: 16, fontWeight: 'bold' },
  author: { fontSize: 14, color: '#555' },
  status: { fontSize: 12, color: 'gray' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 8 },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 }
});
