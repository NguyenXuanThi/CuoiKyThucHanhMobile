import React from 'react';
import { SafeAreaView } from 'react-native';
import BooksList from './BooksList';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BooksList />
    </SafeAreaView>
  );
}
