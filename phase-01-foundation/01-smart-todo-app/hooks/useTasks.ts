import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

const TASKS_STORAGE_KEY = '@smart_todo_tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      } else {
        // Load dummy data for first time
        const dummyTasks: Task[] = [
          {
            id: '1',
            title: 'Complete Expo app scaffolding',
            description: 'Setup routing, tabs, and base components',
            priority: 'high',
            completed: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Design UI mockup',
            description: 'Create a glassmorphism style card layout',
            priority: 'medium',
            completed: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: '3',
            title: 'Go to the gym',
            priority: 'low',
            completed: false,
            createdAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          }
        ];
        setTasks(dummyTasks);
        await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(dummyTasks));
      }
    } catch (e) {
      console.error('Failed to load tasks', e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTasks = async (newTasks: Task[]) => {
    try {
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedTasks = [newTask, ...tasks];
    await saveTasks(updatedTasks);
  };

  const toggleTaskStatus = async (id: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    await saveTasks(updatedTasks);
  };

  const deleteTask = async (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    await saveTasks(updatedTasks);
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    );
    await saveTasks(updatedTasks);
  }

  const clearCompleted = async () => {
    const updatedTasks = tasks.filter(task => !task.completed);
    await saveTasks(updatedTasks);
  };

  return {
    tasks,
    isLoading,
    addTask,
    toggleTaskStatus,
    deleteTask,
    updateTask,
    clearCompleted,
  };
};
