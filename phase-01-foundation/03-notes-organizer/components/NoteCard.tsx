import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Note } from '../types/Note';
import { Colors } from '../constants/Colors';
import { getSubject } from '../constants/Subjects';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onLongPress?: () => void;
}

const formatDate = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const truncate = (str: string, len: number) =>
  str.length > len ? str.slice(0, len).trim() + '…' : str;

export const NoteCard: React.FC<NoteCardProps> = ({ note, onPress, onLongPress }) => {
  const subject = getSubject(note.subject);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
      >
        {/* Accent strip */}
        <View style={[styles.accent, { backgroundColor: note.color }]} />

        {/* Content */}
        <View style={styles.body}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {note.title || 'Untitled Note'}
            </Text>
            {note.favorite && (
              <Ionicons name="star" size={14} color={Colors.warning} style={styles.icon} />
            )}
            {note.pinned && (
              <Ionicons name="pin" size={14} color={note.color} style={styles.icon} />
            )}
          </View>

          <Text style={styles.preview} numberOfLines={2}>
            {truncate(note.content, 120)}
          </Text>

          {/* Tags and Priority */}
          {(note.tags?.length || note.priority) && (
            <View style={styles.midRow}>
              {note.priority && (
                <View style={styles.priorityChip}>
                  <Ionicons 
                    name="flag" 
                    size={10} 
                    color={
                      note.priority === 'High' ? Colors.danger :
                      note.priority === 'Medium' ? Colors.warning : Colors.accent
                    } 
                  />
                  <Text style={styles.priorityText}>{note.priority}</Text>
                </View>
              )}
              {note.tags?.slice(0, 2).map((tag, i) => (
                <View key={i} style={styles.tagChip}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
              {(note.tags?.length || 0) > 2 && (
                <Text style={styles.tagText}>+{(note.tags?.length || 0) - 2}</Text>
              )}
            </View>
          )}

          <View style={styles.footer}>
            {/* Subject chip */}
            <View style={[styles.chip, { backgroundColor: subject.color + '22' }]}>
              <Ionicons name={subject.icon as any} size={10} color={subject.color} />
              <Text style={[styles.chipText, { color: subject.color }]}>{subject.label}</Text>
            </View>

            <View style={styles.footerRight}>
              {note.nextRevisionDate && (
                <View style={styles.revisionContainer}>
                  <Ionicons name="sync-circle" size={14} color={Colors.primaryLight} />
                  <Text style={styles.revisionText}>{formatDate(note.nextRevisionDate)}</Text>
                </View>
              )}
              <Text style={styles.date}>{formatDate(note.updatedAt)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  accent: {
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  body: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  icon: {
    marginTop: 1,
    marginLeft: 4,
  },
  preview: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  midRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  priorityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tagChip: {
    backgroundColor: Colors.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  revisionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  revisionText: {
    fontSize: 11,
    color: Colors.primaryLight,
    fontWeight: '600',
  },
  date: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
