// App.tsx
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import BooksList from './BooksList';
import { seedBooks } from './db';

export default function App() {
  useEffect(() => {
    seedBooks(); // Seed dữ liệu mẫu khi app start
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <BooksList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
