import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { createTable, seedData } from './db';

export default function App() {
  useEffect(() => {
    createTable();
    seedData();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Reading List App</Text>
    </View>
  );
}
