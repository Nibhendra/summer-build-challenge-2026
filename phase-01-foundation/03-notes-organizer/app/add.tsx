import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNotes } from '../hooks/useNotes';
import { TagChip } from '../components/TagChip';
import { Colors, NoteColors } from '../constants/Colors';
import { NOTE_SUBJECTS } from '../constants/Subjects';
import { Note } from '../types/Note';

export default function AddScreen() {
  const router = useRouter();
  const { noteId } = useLocalSearchParams<{ noteId?: string }>();
  const { notes, addNote, updateNote, deleteNote, getRandomColor } = useNotes();

  const existingNote = noteId ? notes.find((n) => n.id === noteId) : null;
  const isEditing = !!existingNote;

  const [title, setTitle] = useState(existingNote?.title ?? '');
  const [content, setContent] = useState(existingNote?.content ?? '');
  const [subject, setSubject] = useState(existingNote?.subject ?? 'general');
  const [color, setColor] = useState(existingNote?.color ?? getRandomColor());
  const [pinned, setPinned] = useState(existingNote?.pinned ?? false);
  const [favorite, setFavorite] = useState(existingNote?.favorite ?? false);
  const [priority, setPriority] = useState<Note['priority']>(existingNote?.priority);
  const [tagsInput, setTagsInput] = useState(existingNote?.tags?.join(', ') ?? '');
  const [saving, setSaving] = useState(false);

  const titleInputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    if (!isEditing) {
      setTimeout(() => titleInputRef.current?.focus(), 350);
    }
  }, []);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your note.');
      titleInputRef.current?.focus();
      return;
    }

    setSaving(true);
    try {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);
      const noteData = { 
        title: title.trim(), 
        content, 
        subject, 
        color, 
        pinned,
        favorite,
        priority,
        tags: tags.length > 0 ? tags : undefined
      };

      if (isEditing && noteId) {
        await updateNote(noteId, noteData);
        router.back();
      } else {
        const newNote = await addNote(noteData);
        router.replace(`/note/${newNote.id}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (noteId) {
              await deleteNote(noteId);
              router.replace('/');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Navigation Header */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.navButton}>
            <Ionicons name="chevron-down" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.navTitle}>{isEditing ? 'Edit Note' : 'New Note'}</Text>

          <View style={styles.navRight}>
            {isEditing && (
              <TouchableOpacity onPress={handleDelete} style={[styles.navButton, styles.deleteBtn]}>
                <Ionicons name="trash-outline" size={20} color={Colors.danger} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.saveButton, saving && styles.savingButton]}
              disabled={saving}
            >
              <Text style={styles.saveText}>{saving ? 'Saving…' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Animated.ScrollView
          style={[styles.scroll, { opacity: fadeAnim }]}
          contentContainerStyle={styles.scrollContent}
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          {/* Color accent indicator */}
          <View style={[styles.colorBar, { backgroundColor: color }]} />

          {/* Title Input */}
          <TextInput
            ref={titleInputRef}
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Note title…"
            placeholderTextColor={Colors.textMuted}
            maxLength={100}
            returnKeyType="next"
            onSubmitEditing={() => {}}
          />

          {/* Content Input */}
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder="Start writing your note…"
            placeholderTextColor={Colors.textMuted}
            multiline
            textAlignVertical="top"
            scrollEnabled={false}
          />

          {/* Divider */}
          <View style={styles.divider} />

          {/* Subject Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              <Ionicons name="bookmark-outline" size={13} color={Colors.textMuted} />
              {' '}Subject
            </Text>
            <View style={styles.subjectGrid}>
              {NOTE_SUBJECTS.map((s) => (
                <TagChip
                  key={s.key}
                  label={s.label}
                  color={s.color}
                  icon={s.icon}
                  selected={subject === s.key}
                  onPress={() => setSubject(s.key)}
                />
              ))}
            </View>
          </View>

          {/* Color Picker */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              <Ionicons name="color-palette-outline" size={13} color={Colors.textMuted} />
              {' '}Accent Color
            </Text>
            <View style={styles.colorRow}>
              {NoteColors.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setColor(c)}
                  style={[
                    styles.colorDot,
                    { backgroundColor: c },
                    color === c && styles.colorDotSelected,
                  ]}
                >
                  {color === c && (
                    <Ionicons name="checkmark" size={14} color={Colors.white} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tags Input */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              <Ionicons name="pricetag-outline" size={13} color={Colors.textMuted} />
              {' '}Tags (comma separated)
            </Text>
            <TextInput
              style={styles.tagsInput}
              value={tagsInput}
              onChangeText={setTagsInput}
              placeholder="e.g. exams, important, review"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          {/* Priority Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              <Ionicons name="flag-outline" size={13} color={Colors.textMuted} />
              {' '}Priority
            </Text>
            <View style={styles.priorityGrid}>
              {['Low', 'Medium', 'High'].map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityChip,
                    priority === p && styles.priorityChipSelected,
                    priority === p && { borderColor: p === 'High' ? Colors.danger : p === 'Medium' ? Colors.warning : Colors.accent }
                  ]}
                  onPress={() => setPriority(priority === p ? undefined : p as Note['priority'])}
                >
                  <Text style={[
                    styles.priorityChipText,
                    priority === p && { color: p === 'High' ? Colors.danger : p === 'Medium' ? Colors.warning : Colors.accent }
                  ]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Pin & Favorite Toggles */}
          <View style={styles.section}>
            <View style={styles.pinRow}>
              <View style={styles.pinLeft}>
                <Ionicons name="star-outline" size={18} color={Colors.warning} />
                <View>
                  <Text style={styles.pinLabel}>Favorite</Text>
                  <Text style={styles.pinSub}>Mark as an important note</Text>
                </View>
              </View>
              <Switch
                value={favorite}
                onValueChange={setFavorite}
                trackColor={{ false: Colors.border, true: Colors.warning + '60' }}
                thumbColor={favorite ? Colors.warning : Colors.textMuted}
                ios_backgroundColor={Colors.border}
              />
            </View>
            <View style={[styles.pinRow, { marginTop: 16 }]}>
              <View style={styles.pinLeft}>
                <Ionicons name="pin-outline" size={18} color={Colors.primary} />
                <View>
                  <Text style={styles.pinLabel}>Pin Note</Text>
                  <Text style={styles.pinSub}>Pinned notes appear at the top</Text>
                </View>
              </View>
              <Switch
                value={pinned}
                onValueChange={setPinned}
                trackColor={{ false: Colors.border, true: Colors.primary + '60' }}
                thumbColor={pinned ? Colors.primary : Colors.textMuted}
                ios_backgroundColor={Colors.border}
              />
            </View>
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  navButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deleteBtn: {
    borderColor: Colors.danger + '40',
    backgroundColor: Colors.danger + '10',
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: 'Inter_700Bold',
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  savingButton: {
    opacity: 0.6,
  },
  saveText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  colorBar: {
    height: 4,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 2,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    fontFamily: 'Inter_700Bold',
  },
  contentInput: {
    fontSize: 15,
    color: Colors.textPrimary,
    paddingHorizontal: 20,
    paddingBottom: 16,
    lineHeight: 24,
    minHeight: 140,
    fontFamily: 'Inter_400Regular',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: 'Inter_600SemiBold',
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  colorDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: Colors.white,
    shadowColor: Colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pinLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pinLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
  pinSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
    fontFamily: 'Inter_400Regular',
  },
  tagsInput: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: 'Inter_400Regular',
  },
  priorityGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  priorityChipSelected: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
  },
  priorityChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
