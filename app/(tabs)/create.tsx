import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radii, Typography } from '@/constants/theme';

const GENRES = ['Platformer', 'Racing', 'Puzzle', 'RPG', 'Shooter', 'Horror', 'Sandbox', 'Strategy'];
const VIBES = ['Retro', 'Cyber', 'Fantasy', 'Minimal', 'Chaos', 'Chill', 'Neon', 'Dark'];
const SPARKS = [
  'A dungeon crawler where every room is a riddle',
  'A racing game on a collapsing rainbow bridge',
  'Defend your treehouse from waves of squirrels',
];

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const [prompt, setPrompt] = React.useState('');
  const [selectedGenre, setSelectedGenre] = React.useState('');
  const [selectedVibe, setSelectedVibe] = React.useState('');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>Create</Text>
            <Text style={styles.subtitle}>Prompt to playable in seconds</Text>
          </View>
        </View>

        {/* Prompt Input */}
        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <MaterialIcons name="auto-awesome" size={20} color={Colors.cyberGreen} />
            <TextInput
              style={styles.input}
              placeholder="Describe your game..."
              placeholderTextColor={Colors.textMuted}
              value={prompt}
              onChangeText={setPrompt}
              multiline
            />
          </View>
        </View>

        {/* Spark Ideas */}
        <View style={styles.sparkSection}>
          <Text style={styles.sparkLabel}>Need a spark?</Text>
          {SPARKS.map((s, i) => (
            <Pressable key={i} style={styles.sparkChip} onPress={() => setPrompt(s)}>
              <MaterialIcons name="auto-awesome" size={14} color={Colors.neonOrange} />
              <Text style={styles.sparkText} numberOfLines={1}>{s}</Text>
            </Pressable>
          ))}
        </View>

        {/* Genre */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genre</Text>
          <View style={styles.chipGrid}>
            {GENRES.map((g) => (
              <Pressable key={g} style={[styles.chip, selectedGenre === g && styles.chipActive]} onPress={() => setSelectedGenre(g)}>
                <Text style={[styles.chipText, selectedGenre === g && styles.chipTextActive]}>{g}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Vibe */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vibe</Text>
          <View style={styles.chipGrid}>
            {VIBES.map((v) => (
              <Pressable key={v} style={[styles.chip, selectedVibe === v && styles.chipActive]} onPress={() => setSelectedVibe(v)}>
                <Text style={[styles.chipText, selectedVibe === v && styles.chipTextActive]}>{v}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Forge Button */}
        <View style={styles.forgeSection}>
          <Pressable style={styles.forgeBtn}>
            <LinearGradient colors={[Colors.neonOrange, Colors.deepOrange]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.forgeBtnGradient}>
              <MaterialIcons name="auto-awesome" size={22} color="#000" />
              <Text style={styles.forgeBtnText}>Forge It</Text>
            </LinearGradient>
          </Pressable>
          <Text style={styles.forgeNote}>Uses 1 forge credit · Playable draft ready in ~20s</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.containerMargin, paddingTop: Spacing.md },
  pageTitle: { ...Typography.displayLg, color: Colors.onSurface, fontSize: 30 },
  subtitle: { ...Typography.bodyMd, color: Colors.textSecondary, marginTop: 4 },
  inputSection: { paddingHorizontal: Spacing.containerMargin, marginTop: Spacing.lg },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: Colors.surfaceContainerLowest, borderRadius: Radii.xl, padding: 16, gap: 12, borderWidth: 1, borderColor: 'rgba(42,42,42,0.4)' },
  input: { flex: 1, fontFamily: 'PlusJakartaSans-Regular', fontSize: 14, color: Colors.onSurface, minHeight: 60, textAlignVertical: 'top' },
  sparkSection: { paddingHorizontal: Spacing.containerMargin, marginTop: Spacing.md },
  sparkLabel: { fontFamily: 'PlusJakartaSans-SemiBold', fontSize: 14, color: Colors.textSecondary, marginBottom: 10 },
  sparkChip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.surfaceContainerHigh, borderRadius: Radii.lg, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(42,42,42,0.3)' },
  sparkText: { fontFamily: 'PlusJakartaSans-Regular', fontSize: 13, color: Colors.onSurfaceVariant, flex: 1 },
  section: { paddingHorizontal: Spacing.containerMargin, marginTop: Spacing.lg },
  sectionTitle: { ...Typography.headlineSm, color: Colors.onSurface, marginBottom: 12 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: Radii.full, backgroundColor: Colors.surfaceContainerHighest, borderWidth: 1, borderColor: Colors.cardBorder },
  chipActive: { backgroundColor: Colors.neonOrange, borderColor: Colors.neonOrange },
  chipText: { fontFamily: 'PlusJakartaSans-Medium', fontSize: 13, color: Colors.textSecondary },
  chipTextActive: { color: '#000', fontFamily: 'PlusJakartaSans-Bold' },
  forgeSection: { paddingHorizontal: Spacing.containerMargin, marginTop: Spacing.xl, alignItems: 'center' },
  forgeBtn: { width: '100%', borderRadius: Radii.full, overflow: 'hidden' },
  forgeBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  forgeBtnText: { fontFamily: 'PlusJakartaSans-Bold', fontSize: 18, color: '#000' },
  forgeNote: { fontFamily: 'JetBrainsMono-Medium', fontSize: 10, color: Colors.textMuted, marginTop: 12, letterSpacing: 0.3 },
});
