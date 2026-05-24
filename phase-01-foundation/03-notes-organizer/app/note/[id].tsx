import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNotes } from '../../hooks/useNotes';
import { Colors } from '../../constants/Colors';
import { getSubject } from '../../constants/Subjects';

const formatFullDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function NoteDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notes, deleteNote, togglePin, updateNote } = useNotes();
  const note = notes.find((n) => n.id === id);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 15 }),
    ]).start();
  }, []);

  if (!note) {
    return (
      <SafeAreaView style={styles.notFound}>
        <Ionicons name="document-outline" size={56} color={Colors.textMuted} />
        <Text style={styles.notFoundText}>Note not found</Text>
        <TouchableOpacity onPress={() => router.replace('/')} style={styles.goHomeBtn}>
          <Text style={styles.goHomeText}>Go Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const subject = getSubject(note.subject);

  const handleEdit = () => {
    router.push({ pathname: '/add', params: { noteId: note.id } });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to permanently delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteNote(note.id);
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: note.title,
        message: `${note.title}\n\n${note.content}\n\n— ${subject.label} Notes`,
      });
    } catch (e) {
      // User cancelled share
    }
  };

  const handleTogglePin = async () => {
    await togglePin(note.id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Navigation Bar */}
      <View style={[styles.navBar, { borderBottomColor: note.color + '40' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navButton}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.navActions}>
          <TouchableOpacity onPress={handleShare} style={styles.navButton}>
            <Ionicons name="share-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleTogglePin}
            style={[styles.navButton, note.pinned && styles.pinActiveBtn]}
          >
            <Ionicons
              name={note.pinned ? 'pin' : 'pin-outline'}
              size={20}
              color={note.pinned ? note.color : Colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Ionicons name="create-outline" size={18} color={Colors.white} />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.ScrollView
        style={[styles.scroll, { opacity: fadeAnim }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Color Header Band */}
        <Animated.View
          style={[
            styles.colorHeader,
            { backgroundColor: note.color + '18', transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={[styles.colorDot, { backgroundColor: note.color }]} />
          <View style={[styles.subjectBadge, { backgroundColor: subject.color + '20' }]}>
            <Ionicons name={subject.icon as any} size={13} color={subject.color} />
            <Text style={[styles.subjectText, { color: subject.color }]}>{subject.label}</Text>
          </View>
          {note.pinned && (
            <View style={[styles.pinnedBadge, { backgroundColor: note.color + '20' }]}>
              <Ionicons name="pin" size={11} color={note.color} />
              <Text style={[styles.pinnedText, { color: note.color }]}>Pinned</Text>
            </View>
          )}
        </Animated.View>

        {/* Note Content */}
        <Animated.View
          style={[styles.contentWrapper, { transform: [{ translateY: slideAnim }] }]}
        >
          <Text style={styles.title}>{note.title || 'Untitled Note'}</Text>

          <View style={styles.dateRow}>
            <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
            <Text style={styles.dateText}>Updated {formatFullDate(note.updatedAt)}</Text>
          </View>

          {/* Tags and Priority row */}
          {(note.tags?.length || note.priority || note.favorite) && (
            <View style={styles.tagsRow}>
              {note.favorite && (
                <View style={styles.favoriteChip}>
                  <Ionicons name="star" size={12} color={Colors.warning} />
                </View>
              )}
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
              {note.tags?.map((tag, i) => (
                <View key={i} style={styles.tagChip}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: note.color + '30' }]} />

          <Text style={styles.content}>{note.content || 'No content yet.'}</Text>
        </Animated.View>

        {/* Spaced Repetition Review Section */}
        <Animated.View style={[styles.reviewSection, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.reviewTitle}>How well do you know this?</Text>
          <Text style={styles.reviewSub}>Rate your confidence to schedule the next revision.</Text>
          <View style={styles.reviewGrid}>
            {[
              { label: 'Weak', days: 1, color: Colors.danger, icon: 'sad-outline' },
              { label: 'Average', days: 3, color: Colors.warning, icon: 'happy-outline' },
              { label: 'Strong', days: 7, color: Colors.accent, icon: 'star-outline' },
            ].map((rating) => (
              <TouchableOpacity
                key={rating.label}
                style={[styles.reviewBtn, { borderColor: rating.color + '50', backgroundColor: rating.color + '10' }]}
                onPress={async () => {
                  const now = new Date();
                  const nextDate = new Date(now);
                  nextDate.setDate(now.getDate() + rating.days);
                  
                  await updateNote(note.id, {
                    confidence: rating.label as any,
                    nextRevisionDate: nextDate.toISOString(),
                    revisionDates: [...(note.revisionDates || []), now.toISOString()]
                  });
                  Alert.alert('Revision Scheduled', `Next review scheduled in ${rating.days} days.`);
                }}
              >
                <Ionicons name={rating.icon as any} size={20} color={rating.color} />
                <Text style={[styles.reviewBtnText, { color: rating.color }]}>{rating.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Actions Footer */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.dangerAction} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color={Colors.danger} />
            <Text style={styles.dangerText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  notFound: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  notFoundText: {
    color: Colors.textMuted,
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  goHomeBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  goHomeText: {
    color: Colors.white,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
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
  pinActiveBtn: {
    borderColor: Colors.primary + '60',
    backgroundColor: Colors.primary + '10',
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 60 },
  colorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  subjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  subjectText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    fontFamily: 'Inter_700Bold',
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  pinnedText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  contentWrapper: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 34,
    fontFamily: 'Inter_700Bold',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },
  dateText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  divider: {
    height: 1.5,
    marginVertical: 16,
    borderRadius: 1,
  },
  content: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 26,
    fontFamily: 'Inter_400Regular',
  },
  actionsRow: {
    paddingHorizontal: 20,
    paddingTop: 32,
    alignItems: 'flex-start',
  },
  dangerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.danger + '12',
    borderWidth: 1,
    borderColor: Colors.danger + '30',
  },
  dangerText: {
    color: Colors.danger,
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  favoriteChip: {
    backgroundColor: Colors.warning + '20',
    padding: 6,
    borderRadius: 8,
  },
  priorityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  priorityText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textSecondary,
  },
  tagChip: {
    backgroundColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textSecondary,
  },
  reviewSection: {
    marginTop: 32,
    paddingHorizontal: 20,
    backgroundColor: Colors.surface,
    paddingVertical: 20,
    borderRadius: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reviewTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  reviewSub: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
    marginBottom: 16,
  },
  reviewGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  reviewBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  reviewBtnText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
});
