import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, Pressable, ScrollView, Alert, Platform } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Calendar, Tag, X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Text } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useTasks } from '@/hooks/useTasks';
import { Priority } from '@/types';

export default function AddTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEditing = !!id;
  const navigation = useNavigation();

  const { tasks, addTask, updateTask } = useTasks();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  
  const [hasDueDate, setHasDueDate] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (isEditing) {
      navigation.setOptions({ title: 'Edit Task' });
      const task = tasks.find(t => t.id === id);
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        setPriority(task.priority);
        if (task.dueDate) {
          setHasDueDate(true);
          setDueDate(new Date(task.dueDate));
        }
      }
    }
  }, [id, isEditing, navigation, tasks]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: hasDueDate ? dueDate.toISOString() : undefined,
    };

    if (isEditing && id) {
      updateTask(id, taskData);
    } else {
      addTask({ ...taskData, completed: false });
    }

    router.back();
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const formattedDate = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.section}>
        <TextInput
          style={[styles.input, styles.titleInput, { color: colors.text }]}
          placeholder="What needs to be done?"
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={setTitle}
          autoFocus={!isEditing}
        />
        
        <TextInput
          style={[styles.input, styles.textArea, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
          placeholder="Add details (optional)"
          placeholderTextColor={colors.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Priority</Text>
        <View style={styles.row}>
          {(['high', 'medium', 'low'] as Priority[]).map((p) => (
            <Pressable
              key={p}
              style={[
                styles.chip,
                { backgroundColor: colors.card, borderColor: priority === p ? colors.priority[p] : colors.border },
                priority === p && { backgroundColor: colors.priority[p] + '1A' }
              ]}
              onPress={() => setPriority(p)}
            >
              <Tag size={16} color={priority === p ? colors.priority[p] : colors.textSecondary} />
              <Text style={[styles.chipText, { color: priority === p ? colors.priority[p] : colors.textSecondary }]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Due Date</Text>
        <View style={styles.row}>
          <Pressable
            style={[
              styles.chip,
              { backgroundColor: colors.card, borderColor: !hasDueDate ? colors.tint : colors.border },
              !hasDueDate && { backgroundColor: colors.tint + '1A' }
            ]}
            onPress={() => {
              setHasDueDate(false);
              setShowDatePicker(false);
            }}
          >
            <Text style={[styles.chipText, { color: !hasDueDate ? colors.tint : colors.textSecondary }]}>None</Text>
          </Pressable>
          
          <Pressable
            style={[
              styles.chip,
              { backgroundColor: colors.card, borderColor: hasDueDate ? colors.tint : colors.border },
              hasDueDate && { backgroundColor: colors.tint + '1A' }
            ]}
            onPress={() => {
              setHasDueDate(true);
              setShowDatePicker(true);
            }}
          >
            <Calendar size={16} color={hasDueDate ? colors.tint : colors.textSecondary} />
            <Text style={[styles.chipText, { color: hasDueDate ? colors.tint : colors.textSecondary }]}>
              {hasDueDate ? formattedDate : 'Set Date'}
            </Text>
          </Pressable>
        </View>

        {showDatePicker && hasDueDate && (
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              value={dueDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={onChangeDate}
              themeVariant={colorScheme === 'dark' ? 'dark' : 'light'}
            />
          </View>
        )}
      </View>

      <Pressable 
        style={[styles.saveButton, { backgroundColor: colors.tint }]} 
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>{isEditing ? 'Save Changes' : 'Create Task'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    fontSize: 16,
    marginBottom: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    paddingVertical: 8,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  chipText: {
    fontWeight: '500',
  },
  datePickerContainer: {
    marginTop: 16,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
