import { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Chip,
  Card,
  Checkbox,
  IconButton,
} from 'react-native-paper';
import {
  fetchTasks,
  addTask,
  toggleTaskAPI,
  deleteTaskAPI,
  updateTaskAPI,
  Task,
} from '../../services/api';

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filtered, setFiltered] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed'>('all');
  const [search, setSearch] = useState('');

  // Estados para editar
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  // Cargar tareas
  useEffect(() => {
    fetchTasks()
      .then((data) => {
        setTasks(data.todos);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filtrar tareas
  useEffect(() => {
    let data = [...tasks];
    if (filter === 'completed') {
      data = data.filter((t) => t.completed);
    }
    if (search.trim() !== '') {
      data = data.filter((t) =>
        t.todo.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(data);
  }, [tasks, filter, search]);

  // Agregar nueva tarea
  const handleAdd = async () => {
    if (!newTask.trim()) return;
    const newItem = await addTask(newTask);
    setTasks([newItem, ...tasks]);
    setNewTask('');
  };

  // Marcar tarea completada
  const handleToggle = async (task: Task) => {
    const updated = await toggleTaskAPI(task.id, !task.completed);
    setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
  };

  // Eliminar tarea
  const handleDelete = async (id: number) => {
    await deleteTaskAPI(id);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Guardar 
  const handleEdit = async (id: number) => {
    if (!editText.trim()) {
      setEditingId(null);
      return;
    }
    const updated = await updateTaskAPI(id, editText);
    setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
    setEditingId(null);
    setEditText('');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Mis tareas
      </Text>

      <View style={styles.row}>
        <TextInput
          mode="outlined"
          placeholder="Nueva tarea"
          value={newTask}
          onChangeText={setNewTask}
          style={{ flex: 1 }}
        />
        <Button
          mode="contained"
          onPress={handleAdd}
          style={{ marginLeft: 10, justifyContent: 'center' }}
        >
          Agregar
        </Button>
      </View>

      <TextInput
        mode="outlined"
        placeholder="Buscar tarea..."
        value={search}
        onChangeText={setSearch}
        style={{ marginBottom: 10 }}
      />

      <View style={styles.row}>
        <Chip
          style={{ marginRight: 10 }}
          selected={filter === 'all'}
          onPress={() => setFilter('all')}
        >
          Todos
        </Chip>
        <Chip
          selected={filter === 'completed'}
          onPress={() => setFilter('completed')}
        >
          Completados
        </Chip>
      </View>

      {filtered.map((task) => (
        <Card key={task.id} style={{ marginTop: 10 }}>
          <Card.Content style={styles.taskRow}>
            <View style={{ flex: 1 }}>
              {editingId === task.id ? (
                <TextInput
                  mode="outlined"
                  value={editText}
                  onChangeText={setEditText}
                  onSubmitEditing={() => handleEdit(task.id)}
                  style={{ backgroundColor: 'white' }}
                  autoFocus
                />
              ) : (
                <Checkbox.Item
                  label={task.todo}
                  status={task.completed ? 'checked' : 'unchecked'}
                  onPress={() => handleToggle(task)}
                  position="leading"
                  labelStyle={
                    task.completed ? styles.taskCompleted : undefined
                  }
                />
              )}
            </View>

            {editingId === task.id ? (
              <IconButton
                icon="check"
                iconColor="green"
                onPress={() => handleEdit(task.id)}
              />
            ) : (
              <IconButton
                icon="pencil"
                iconColor="purple"
                onPress={() => {
                  setEditingId(task.id);
                  setEditText(task.todo);
                }}
              />
            )}

            <IconButton
              icon="delete"
              iconColor="red"
              onPress={() => handleDelete(task.id)}
            />
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f9fc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskCompleted: { textDecorationLine: 'line-through', opacity: 0.6 },
});
