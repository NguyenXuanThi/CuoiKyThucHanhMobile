// BooksList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db, Book } from './db';

export default function BooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Hàm lấy danh sách sách từ mock DB
  const loadBooks = async () => {
    const data = await db.all(); // Gọi db.all() để lấy tất cả sách
    setBooks(data); // Cập nhật state books với dữ liệu lấy được
    setLoading(false); // Set loading là false sau khi lấy xong dữ liệu
  };

  // useEffect để load dữ liệu khi component được render lần đầu
  useEffect(() => {
    loadBooks();
  }, []); // Chạy chỉ 1 lần khi component mount

  // Nếu đang loading, show loading text
  if (loading) return <Text>Loading...</Text>;

  // Nếu không có sách nào trong danh sách, show thông báo
  if (books.length === 0) return <Text>Chưa có sách trong danh sách đọc.</Text>;

  return (
    <FlatList
      data={books} // Sử dụng dữ liệu books từ state
      keyExtractor={item => item.id.toString()} // Chỉ định key cho mỗi item
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.title}>{item.title}</Text>
          {item.author && <Text>{item.author}</Text>}
          <Text style={styles.status}>{item.status}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  item: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  title: { fontWeight: 'bold', fontSize: 16 },
  status: { fontStyle: 'italic', color: 'gray' },
});
