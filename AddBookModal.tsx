// AddBookModal.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal } from 'react-native';
import { db, Book } from './db';

interface AddBookModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (book: Book) => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ visible, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleAdd = async () => {
    if (!title.trim()) return; // không thêm nếu không có title
    const newBook = await db.insert(title, author || undefined);
    onAdd(newBook); // cập nhật danh sách bên ngoài
    setTitle('');
    setAuthor('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.heading}>Thêm sách mới</Text>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Author"
            value={author}
            onChangeText={setAuthor}
            style={styles.input}
          />
          <View style={styles.buttons}>
            <Button title="Hủy" onPress={onClose} />
            <Button title="Thêm" onPress={handleAdd} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddBookModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
  buttons: { flexDirection: 'row', justifyContent: 'space-between' },
});
