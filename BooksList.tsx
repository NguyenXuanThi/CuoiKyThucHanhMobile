import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  Button,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useBooks } from './useBook';
import AddBookModal from './AddBookModal';
import EditBookModal from './EditBookModal';
import { Book, BookStatus } from './db';

const statusCycle: BookStatus[] = ['planning', 'reading', 'done'];

const BooksList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const {
    books,
    allBooks,
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
  } = useBooks();

  const groupedBooks = ['planning', 'reading', 'done'].map(status => ({
    title: status,
    data: books.filter(b => b.status === status),
  }));

  const handleDelete = useCallback(
    (book: Book) => {
      Alert.alert('Xác nhận', `Bạn có chắc muốn xóa sách "${book.title}"?`, [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: () => deleteBook(book.id) },
      ]);
    },
    [deleteBook]
  );

  const handlePress = useCallback(
    (book: Book) => {
      const currentIndex = statusCycle.indexOf(book.status);
      const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
      changeStatus(book, nextStatus);
    },
    [changeStatus]
  );

  const handleEdit = useCallback((book: Book) => {
    setEditBook(book);
    setEditModalVisible(true);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Book }) => {
      let bgColor = '#fff';
      if (item.status === 'reading') bgColor = '#ffeaa7';
      if (item.status === 'done') bgColor = '#55efc4';

      return (
        <TouchableOpacity
          style={[styles.item, { backgroundColor: bgColor }]}
          onPress={() => handlePress(item)}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>{item.author || 'Unknown'}</Text>
          <Text style={styles.status}>{item.status}</Text>
          <Button title="Sửa" onPress={() => handleEdit(item)} />
          <Button title="Xóa" onPress={() => handleDelete(item)} />
        </TouchableOpacity>
      );
    },
    [handlePress, handleEdit, handleDelete]
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Tìm kiếm sách..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.filterContainer}>
        {(['all', ...statusCycle] as (BookStatus | 'all')[]).map(s => (
          <Button
            key={s}
            title={s === 'all' ? 'Tất cả' : s}
            onPress={() => setFilterStatus(s)}
            color={filterStatus === s ? '#0984e3' : '#b2bec3'}
          />
        ))}
      </View>

      <Button title="Thêm sách" onPress={() => setModalVisible(true)} />
      <Button title="Import từ API" onPress={importBooksFromAPI} />

      {importing && <ActivityIndicator size="small" color="#0984e3" />}
      {importError && <Text style={{ color: 'red' }}>{importError}</Text>}

      {allBooks.length === 0 ? (
        <Text style={{ marginTop: 16 }}>Danh sách sách trống. Hãy thêm sách mới!</Text>
      ) : (
        <SectionList
          sections={groupedBooks}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title.toUpperCase()}</Text>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      <AddBookModal visible={modalVisible} onClose={() => setModalVisible(false)} onAdd={insertBook} />
      <EditBookModal visible={editModalVisible} book={editBook} onClose={() => setEditModalVisible(false)} onUpdate={updateBook} />
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
  filterContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 20, backgroundColor: '#dfe6e9', padding: 4 },
});
