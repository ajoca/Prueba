import { FlatList } from 'react-native';
import TaskItem from './TaskItem';
import { Task } from '../services/api';

interface TaskListProps {
  data: Task[];
  onToggle: (task: Task) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
}

export default function TaskList({ data, onToggle, onDelete, onEdit }: TaskListProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TaskItem task={item} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
      )}
    />
  );
}
