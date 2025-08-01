import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import { Task } from '../services/api';

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.todo);

  const handleSave = () => {
    onEdit(task.id, editText);
    setIsEditing(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Pressable onPress={() => onToggle(task)} style={styles.checkArea}>
          <View style={[styles.checkbox, task.completed && styles.checked]} />
        </Pressable>

        {isEditing ? (
          <TextInput
            value={editText}
            onChangeText={setEditText}
            onSubmitEditing={handleSave}
            style={[styles.text, styles.inputEdit]}
            autoFocus
          />
        ) : (
          <Text
            numberOfLines={3}
            style={[
              styles.text,
              task.completed && { textDecorationLine: 'line-through', color: '#999' },
            ]}
          >
            {task.todo}
          </Text>
        )}

        {!isEditing && (
          <Pressable style={styles.iconButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.iconText}>✏️</Text>
          </Pressable>
        )}

        <Pressable style={styles.deleteButton} onPress={() => onDelete(task.id)}>
          <Text style={styles.deleteText}>🗑️</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F4FC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkArea: {
    marginRight: 12,
    marginTop: 3,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#7C3AED',
    borderRadius: 6,
  },
  checked: {
    backgroundColor: '#7C3AED',
  },
  text: {
    flex: 1,
    fontSize: 16,
    flexWrap: 'wrap',
  },
  inputEdit: {
    backgroundColor: '#fff',
    borderColor: '#7C3AED',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  iconButton: {
    marginLeft: 8,
    paddingHorizontal: 4,
    paddingVertical: 4,
    alignSelf: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  deleteButton: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    alignSelf: 'center',
  },
  deleteText: {
    color: 'white',
    fontSize: 16,
  },
});
