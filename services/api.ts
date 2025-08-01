const API_URL = 'https://dummyjson.com/todos';

export interface Task {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export async function fetchTasks() {
  const res = await fetch(`${API_URL}?limit=30`);
  return await res.json();
}

export async function addTask(todo: string) {
  const res = await fetch(API_URL + '/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ todo, completed: false, userId: 1 }),
  });
  return await res.json();
}
export async function updateTaskAPI(id: number, todo: string) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ todo }),
  });
  return await res.json();
}


export async function toggleTaskAPI(id: number, completed: boolean) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
  return await res.json();
}

export async function deleteTaskAPI(id: number) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
}
