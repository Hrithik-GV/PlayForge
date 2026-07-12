import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radii, Typography } from '@/constants/theme';

const STATS = [
  { label: 'Followers', value: '48.2K' },
  { label: 'Following', value: '312' },
  { label: 'Total plays', value: '6.4M' },
];

const GAMES = [
  { id: '1', title: 'Neon Drift X', genre: 'Racing', vibe: 'Cyber', plays: '1.2M' },
  { id: '2', title: 'Crystal Crypt', genre: 'RPG', vibe: 'Fantasy', plays: '1.1M' },
  { id: '3', title: 'Cloud Bound', genre: 'Action', vibe: 'Vibe', plays: '890K' },
  { id: '4', title: 'The Signal', genre: 'Horror', vibe: 'AI', plays: '760K' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Pressable style={styles.settingsBtn}>
            <MaterialIcons name="settings" size={22} color={Colors.onSurface} />
          </Pressable>
        </View>

        {/* Avatar & Name */}
        <View style={styles.profileSection}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLetter}>A</Text>
          </View>
          <Text style={styles.displayName}>Alex Morgan</Text>
          <Text style={styles.handle}>@alexforge</Text>
          <Text style={styles.bio}>Building tiny games with big vibes. Prompt-to-play in seconds. ⚡️</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            {STATS.map((s) => (
              <View key={s.label} style={styles.statBox}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Action buttons */}
          <View style={styles.actionsRow}>
            <Pressable style={styles.editBtn}>
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </Pressable>
            <Pressable style={styles.shareBtn}>
              <MaterialIcons name="share" size={18} color={Colors.onSurface} />
            </Pressable>
          </View>
        </View>

        {/* My Games */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Games</Text>
          <Text style={styles.gameCount}>{GAMES.length} games</Text>
        </View>

        <View style={styles.gamesGrid}>
          {GAMES.map((game) => (
            <Pressable key={game.id} style={styles.gameCard}>
              <View style={styles.gameThumb}>
                <MaterialIcons name="sports-esports" size={32} color="rgba(255,138,61,0.3)" />
              </View>
              <View style={styles.gameInfo}>
                <Text style={styles.gameTitle} numberOfLines={1}>{game.title}</Text>
                <View style={styles.gameTagsRow}>
                  <MaterialIcons name="auto-awesome" size={12} color={Colors.cyberGreen} />
                  <Text style={styles.gameGenre}>{game.genre} • {game.vibe}</Text>
                </View>
                <View style={styles.gamePlaysRow}>
                  <MaterialIcons name="play-arrow" size={14} color={Colors.textSecondary} />
                  <Text style={styles.gamePlays}>{game.plays}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.containerMargin, paddingTop: Spacing.md },
  headerTitle: { ...Typography.headlineMd, color: Colors.onSurface },
  settingsBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceContainerHigh, justifyContent: 'center', alignItems: 'center' },

  profileSection: { alignItems: 'center', paddingHorizontal: Spacing.containerMargin, paddingTop: Spacing.lg },
  avatarLarge: { width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.neonOrange, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'rgba(255,138,61,0.3)' },
  avatarLetter: { fontFamily: 'PlusJakartaSans-ExtraBold', fontSize: 36, color: '#000' },
  displayName: { ...Typography.headlineMd, color: Colors.onSurface, marginTop: 14 },
  handle: { fontFamily: 'JetBrainsMono-Medium', fontSize: 14, color: Colors.neonOrange, marginTop: 4 },
  bio: { fontFamily: 'PlusJakartaSans-Regular', fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginTop: 10, lineHeight: 20, paddingHorizontal: 20 },

  statsRow: { flexDirection: 'row', marginTop: Spacing.lg, gap: 0 },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: 'PlusJakartaSans-Bold', fontSize: 20, color: Colors.onSurface },
  statLabel: { fontFamily: 'JetBrainsMono-Medium', fontSize: 10, color: Colors.textMuted, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },

  actionsRow: { flexDirection: 'row', gap: 12, marginTop: Spacing.lg, width: '100%' },
  editBtn: { flex: 1, paddingVertical: 12, borderRadius: Radii.full, borderWidth: 1.5, borderColor: Colors.outline, alignItems: 'center' },
  editBtnText: { fontFamily: 'PlusJakartaSans-SemiBold', fontSize: 14, color: Colors.onSurface },
  shareBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: Colors.outline, justifyContent: 'center', alignItems: 'center' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.containerMargin, marginTop: Spacing.xl, marginBottom: Spacing.md },
  sectionTitle: { ...Typography.headlineSm, color: Colors.onSurface },
  gameCount: { fontFamily: 'JetBrainsMono-Medium', fontSize: 12, color: Colors.textMuted },

  gamesGrid: { paddingHorizontal: Spacing.containerMargin, gap: 12 },
  gameCard: { flexDirection: 'row', backgroundColor: Colors.surfaceContainerLow, borderRadius: Radii.lg, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(42,42,42,0.4)' },
  gameThumb: { width: 80, height: 80, backgroundColor: Colors.surfaceContainerHigh, justifyContent: 'center', alignItems: 'center' },
  gameInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  gameTitle: { fontFamily: 'PlusJakartaSans-SemiBold', fontSize: 15, color: Colors.onSurface },
  gameTagsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  gameGenre: { fontFamily: 'PlusJakartaSans-Regular', fontSize: 12, color: Colors.textSecondary },
  gamePlaysRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4 },
  gamePlays: { fontFamily: 'JetBrainsMono-Medium', fontSize: 11, color: Colors.textSecondary },
});
