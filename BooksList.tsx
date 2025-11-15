import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { db, seedBooks, Book } from './db';
import AddBookModal from './AddBookModal';

const BooksList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    seedBooks();
    db.all().then(setBooks);
  }, []);

  const handleAddBook = (book: Book) => {
    setBooks(prev => [...prev, book]);
  };

  const renderItem = ({ item }: { item: Book }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>{item.author || 'Unknown'}</Text>
      <Text style={styles.status}>{item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Thêm sách" onPress={() => setModalVisible(true)} />
      {books.length === 0 ? (
        <Text>Chưa có sách trong danh sách đọc.</Text>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
      <AddBookModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddBook}
      />
    </View>
  );
};

export default BooksList;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  title: { fontSize: 16, fontWeight: 'bold' },
  author: { fontSize: 14, color: '#555' },
  status: { fontSize: 12, color: 'gray' },
});
