import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { db, seedBooks, Book, BookStatus } from './db';
import AddBookModal from './AddBookModal';

// Các trạng thái sách có thể có
const statusCycle: BookStatus[] = ['planning', 'reading', 'done'];

const BooksList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Khi component được mount, seed sách mẫu và tải danh sách sách
  useEffect(() => {
    seedBooks(); // Seed dữ liệu mẫu nếu chưa có
    db.all().then(setBooks); // Tải danh sách sách từ DB
  }, []);

  // Hàm xử lý khi thêm sách mới
  const handleAddBook = (book: Book) => {
    setBooks(prev => [...prev, book]);
  };

  // Hàm xử lý thay đổi trạng thái khi nhấn vào sách
  const handlePress = async (book: Book) => {
    // Lấy chỉ số hiện tại của trạng thái trong mảng statusCycle
    const currentIndex = statusCycle.indexOf(book.status);
    // Tính trạng thái tiếp theo
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
    // Cập nhật trạng thái của sách trong DB
    await db.update(book.id, { status: nextStatus });
    const updatedBooks = await db.all(); // Lấy lại danh sách sách sau khi cập nhật
    setBooks(updatedBooks); // Cập nhật lại state books
  };

  // Hàm render từng item sách trong FlatList
  const renderItem = ({ item }: { item: Book }) => {
    let bgColor = '#fff'; // Màu nền mặc định

    // Đặt màu nền tùy vào trạng thái của sách
    if (item.status === 'reading') bgColor = '#ffeaa7'; // Màu vàng khi đang đọc
    if (item.status === 'done') bgColor = '#55efc4'; // Màu xanh khi đã đọc xong

    return (
      <TouchableOpacity
        onPress={() => handlePress(item)} // Xử lý khi nhấn vào sách
        style={[styles.item, { backgroundColor: bgColor }]}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>{item.author || 'Unknown'}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Button title="Thêm sách" onPress={() => setModalVisible(true)} />
      {books.length === 0 ? (
        <Text>Chưa có sách trong danh sách đọc.</Text>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem} // Render mỗi item sách
        />
      )}
      <AddBookModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)} // Đóng modal
        onAdd={handleAddBook} // Hàm gọi khi thêm sách mới
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
});
