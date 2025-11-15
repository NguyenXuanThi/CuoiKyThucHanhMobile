import React, { useState, useEffect } from 'react';
import { Modal, View, TextInput, Button, StyleSheet } from 'react-native';
import { Book } from './db';
import { Picker } from '@react-native-picker/picker';

interface EditBookModalProps {
  visible: boolean;
  book: Book | null;
  onClose: () => void;
  onUpdate: (book: Book) => void;
}

const EditBookModal: React.FC<EditBookModalProps> = ({ visible, book, onClose, onUpdate }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<Book['status']>('planning');

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author || '');
      setStatus(book.status);
    }
  }, [book]);

  const handleSave = () => {
    if (!book) return;
    const updated: Book = { ...book, title, author, status };
    onUpdate(updated); // Gọi hàm update từ BooksList
    onClose(); // Đóng modal
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <TextInput value={title} onChangeText={setTitle} placeholder="Title" style={styles.input} />
        <TextInput value={author} onChangeText={setAuthor} placeholder="Author" style={styles.input} />
        <Picker selectedValue={status} onValueChange={setStatus}>
          <Picker.Item label="Planning" value="planning" />
          <Picker.Item label="Reading" value="reading" />
          <Picker.Item label="Done" value="done" />
        </Picker>
        <Button title="Lưu" onPress={handleSave} />
        <Button title="Hủy" onPress={onClose} />
      </View>
    </Modal>
  );
};

export default EditBookModal;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 12, padding: 8, borderRadius: 4 },
});
