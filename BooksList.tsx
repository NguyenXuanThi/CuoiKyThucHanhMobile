import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db, Book } from './db'; // dbMock.ts bạn đang dùng

export default function BooksList() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    db.all().then(setBooks);
  }, []);

  const renderItem = ({ item }: { item: Book }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>{item.author}</Text>
      <Text style={styles.status}>{item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {books.length === 0 ? (
        <Text style={styles.empty}>Chưa có sách trong danh sách đọc.</Text>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  item: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
  },
  title: { fontWeight: 'bold', fontSize: 16 },
  author: { color: '#555' },
  status: { color: '#888', marginTop: 2 },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' },
});
