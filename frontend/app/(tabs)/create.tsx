import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, ActivityIndicator, Modal, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { Colors, Spacing, Radii, Typography } from '@/constants/theme';

const GENRES = ['Platformer', 'Racing', 'Puzzle', 'RPG', 'Shooter', 'Horror', 'Sandbox', 'Strategy'];
const VIBES = ['Retro', 'Cyber', 'Fantasy', 'Minimal', 'Chaos', 'Chill', 'Neon', 'Dark'];
const SPARKS = [
  'A dungeon crawler where every room is a riddle',
  'A racing game on a collapsing rainbow bridge',
  'Defend your treehouse from waves of squirrels',
];

// Helper to determine backend base URL
const getApiBaseUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:5000`;
  }
  return 'http://127.0.0.1:5000'; // fallback
};

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const [prompt, setPrompt] = React.useState('');
  const [selectedGenre, setSelectedGenre] = React.useState('');
  const [selectedVibe, setSelectedVibe] = React.useState('');

  // Generation & playback states
  const [loading, setLoading] = React.useState(false);
  const [loadingStep, setLoadingStep] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [generatedGame, setGeneratedGame] = React.useState<any>(null);
  const [cacheHit, setCacheHit] = React.useState<boolean | null>(null);
  const [fallbackUsed, setFallbackUsed] = React.useState<boolean>(false);
  const [fallbackReason, setFallbackReason] = React.useState<string | null>(null);
  const [playMode, setPlayMode] = React.useState(false);

  // Social feed publishing states
  const [publishing, setPublishing] = React.useState(false);
  const [published, setPublished] = React.useState(false);

  const handleForge = async () => {
    if (!prompt.trim()) {
      setError('Please input a prompt to forge your game.');
      return;
    }

    setError(null);
    setLoading(true);
    setLoadingStep('1/4: Normalizing prompt text...');

    try {
      // Append genre & vibe to final prompt for richer generation if selected
      let finalPrompt = prompt.trim();
      if (selectedGenre) finalPrompt += `. Genre: ${selectedGenre}`;
      if (selectedVibe) finalPrompt += `. Vibe: ${selectedVibe}`;

      // Simulate a small delay for local feedback steps
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoadingStep('2/4: Checking MongoDB prompt-hash cache...');
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoadingStep('3/4: Generating game components...');

      const response = await fetch(`${getApiBaseUrl()}/api/games/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Server failed to forge game');
      }

      const data = await response.json();
      setGeneratedGame(data.game);
      setCacheHit(data.cacheHit);
      setFallbackUsed(data.fallbackUsed || false);
      setFallbackReason(data.fallbackReason || null);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handlePublish = async () => {
    if (!generatedGame || !generatedGame._id) return;

    setError(null);
    setPublishing(true);

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId: generatedGame._id }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to publish game');
      }

      setPublished(true);
    } catch (err: any) {
      setError(err.message || 'Failed to publish game to feed');
    } finally {
      setPublishing(false);
    }
  };

  const handleCloseResult = () => {
    setGeneratedGame(null);
    setCacheHit(null);
    setFallbackUsed(false);
    setFallbackReason(null);
    setError(null);
    setPublished(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>Create</Text>
            <Text style={styles.subtitle}>Prompt to playable in seconds</Text>
          </View>
        </View>

        {/* Error alert banner */}
        {error && (
          <View style={styles.errorBanner}>
            <MaterialIcons name="error-outline" size={18} color="#ff4a4a" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Prompt Input */}
        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <MaterialIcons name="auto-awesome" size={20} color={Colors.cyberGreen} />
            <TextInput
              style={styles.input}
              placeholder="Describe your game..."
              placeholderTextColor={Colors.textMuted}
              value={prompt}
              onChangeText={(text) => {
                setPrompt(text);
                if (error) setError(null);
              }}
              multiline
            />
          </View>
        </View>

        {/* Spark Ideas */}
        <View style={styles.sparkSection}>
          <Text style={styles.sparkLabel}>Need a spark?</Text>
          {SPARKS.map((s, i) => (
            <Pressable key={i} style={styles.sparkChip} onPress={() => {
              setPrompt(s);
              if (error) setError(null);
            }}>
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
              <Pressable key={g} style={[styles.chip, selectedGenre === g && styles.chipActive]} onPress={() => setSelectedGenre(selectedGenre === g ? '' : g)}>
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
              <Pressable key={v} style={[styles.chip, selectedVibe === v && styles.chipActive]} onPress={() => setSelectedVibe(selectedVibe === v ? '' : v)}>
                <Text style={[styles.chipText, selectedVibe === v && styles.chipTextActive]}>{v}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Forge Button */}
        <View style={styles.forgeSection}>
          <Pressable style={styles.forgeBtn} onPress={handleForge} disabled={loading}>
            <LinearGradient colors={[Colors.neonOrange, Colors.deepOrange]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.forgeBtnGradient}>
              {loading ? (
                <ActivityIndicator color="#000" size="small" />
              ) : (
                <MaterialIcons name="auto-awesome" size={22} color="#000" />
              )}
              <Text style={styles.forgeBtnText}>{loading ? 'Forging...' : 'Forge It'}</Text>
            </LinearGradient>
          </Pressable>
          <Text style={styles.forgeNote}>Uses 1 forge credit · Playable draft ready in ~10s</Text>
        </View>
      </ScrollView>

      {/* Forging Loading Modal */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.loadingModalBg}>
          <View style={styles.loadingModalCard}>
            <ActivityIndicator size="large" color={Colors.neonOrange} />
            <Text style={styles.loadingTitle}>HYPER-FORGING IN PROGRESS</Text>
            <Text style={styles.loadingSubtitle}>{loadingStep}</Text>
          </View>
        </View>
      </Modal>

      {/* Generation Result Modal */}
      <Modal visible={!!generatedGame} transparent animationType="slide">
        <View style={styles.resultModalBg}>
          <View style={styles.resultModalCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultHeaderTitle}>
                {fallbackUsed ? 'AI Server Busy' : 'Game Successfully Forged!'}
              </Text>
              <Pressable onPress={handleCloseResult}>
                <MaterialIcons name="close" size={24} color={Colors.textSecondary} />
              </Pressable>
            </View>

            {/* Cache Badge / Fallback Badge */}
            <View style={styles.badgeContainer}>
              {fallbackUsed ? (
                <View style={[styles.badge, styles.badgeFallback]}>
                  <MaterialIcons name="hourglass-empty" size={14} color={Colors.neonOrange} />
                  <Text style={styles.badgeFallbackText}>FALLBACK ACTIVE</Text>
                </View>
              ) : cacheHit ? (
                <View style={[styles.badge, styles.badgeCacheHit]}>
                  <MaterialIcons name="flash-on" size={14} color="#00ff66" />
                  <Text style={styles.badgeCacheHitText}>CACHE HIT (0ms latency)</Text>
                </View>
              ) : (
                <View style={[styles.badge, styles.badgeCacheMiss]}>
                  <MaterialIcons name="auto-awesome" size={14} color={Colors.neonOrange} />
                  <Text style={styles.badgeCacheMissText}>CACHE MISS (Generated Fresh)</Text>
                </View>
              )}
            </View>

            {/* Fallback Message Alert */}
            {fallbackUsed && (
              <View style={styles.fallbackAlert}>
                <MaterialIcons name="warning" size={20} color={Colors.neonOrange} style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.fallbackAlertTitle}>AI is currently busy.</Text>
                  <Text style={styles.fallbackAlertText}>
                    Explore trending games while we prepare your game.
                  </Text>
                </View>
              </View>
            )}

            {/* Details */}
            <View style={styles.resultDetails}>
              <Text style={styles.resultLabel}>{fallbackUsed ? 'FALLBACK RETRO GAME' : 'GAME TITLE'}</Text>
              <Text style={styles.resultValue}>{generatedGame?.title}</Text>

              <Text style={[styles.resultLabel, { marginTop: 12 }]}>
                {fallbackUsed ? 'GAME IDENTIFIER' : 'PROMPT HASH (SHA-256)'}
              </Text>
              <Text style={styles.hashValue} numberOfLines={1} ellipsizeMode="middle">
                {generatedGame?.promptHash || 'N/A'}
              </Text>
            </View>

            {/* Actions */}
            <Pressable style={styles.playBtn} onPress={() => setPlayMode(true)}>
              <LinearGradient colors={[Colors.cyberGreen, '#11b854']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.playBtnGradient}>
                <MaterialIcons name="play-arrow" size={24} color="#000" />
                <Text style={styles.playBtnText}>Launch Game</Text>
              </LinearGradient>
            </Pressable>

            {/* Publish to Feed */}
            <Pressable 
              style={[
                styles.playBtn, 
                published && { borderColor: 'rgba(0, 255, 102, 0.4)', borderWidth: 1 }
              ]} 
              onPress={handlePublish}
              disabled={publishing || published}
            >
              {published ? (
                <View style={[styles.playBtnGradient, { backgroundColor: 'rgba(0, 255, 102, 0.1)' }]}>
                  <MaterialIcons name="check" size={22} color="#00ff66" />
                  <Text style={[styles.playBtnText, { color: '#00ff66' }]}>Published to Feed</Text>
                </View>
              ) : (
                <LinearGradient colors={[Colors.neonOrange, Colors.deepOrange]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.playBtnGradient}>
                  {publishing ? (
                    <ActivityIndicator color="#000" size="small" />
                  ) : (
                    <MaterialIcons name="share" size={22} color="#000" />
                  )}
                  <Text style={styles.playBtnText}>{publishing ? 'Publishing...' : 'Publish to Feed'}</Text>
                </LinearGradient>
              )}
            </Pressable>

            <Pressable style={styles.closeBtn} onPress={handleCloseResult}>
              <Text style={styles.closeBtnText}>Forge Another Game</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* WebView Gameplay Modal */}
      <Modal visible={playMode} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.webContainer}>
          <View style={[styles.webHeader, { paddingTop: Platform.OS === 'ios' ? insets.top : 12 }]}>
            <Pressable onPress={() => setPlayMode(false)} style={styles.webCloseBtn}>
              <MaterialIcons name="arrow-back" size={24} color={Colors.onSurface} />
              <Text style={styles.webCloseText}>Back to Forge</Text>
            </Pressable>
            <Text style={styles.webTitle} numberOfLines={1}>{generatedGame?.title}</Text>
          </View>
          {generatedGame?.gameCode ? (
            <WebView
              originWhitelist={['*']}
              source={{ html: generatedGame.gameCode }}
              style={styles.webview}
              javaScriptEnabled
              domStorageEnabled
            />
          ) : (
            <View style={styles.noCodeContainer}>
              <Text style={styles.noCodeText}>No game code was generated.</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.containerMargin, paddingTop: Spacing.md },
  pageTitle: { ...Typography.displayLg, color: Colors.onSurface, fontSize: 30 },
  subtitle: { ...Typography.bodyMd, color: Colors.textSecondary, marginTop: 4 },
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255, 74, 74, 0.1)', borderWidth: 1, borderColor: 'rgba(255, 74, 74, 0.3)', borderRadius: Radii.lg, padding: 12, marginHorizontal: Spacing.containerMargin, marginTop: Spacing.md },
  errorText: { fontFamily: 'PlusJakartaSans-Medium', fontSize: 13, color: '#ff7777', flex: 1 },
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

  // Loading modal
  loadingModalBg: { flex: 1, backgroundColor: 'rgba(19, 19, 19, 0.85)', justifyContent: 'center', alignItems: 'center' },
  loadingModalCard: { backgroundColor: Colors.surfaceContainerHigh, padding: 24, borderRadius: Radii.xl, alignItems: 'center', width: '80%', borderWidth: 1, borderColor: 'rgba(255, 138, 61, 0.2)' },
  loadingTitle: { fontFamily: 'JetBrainsMono-Bold', fontSize: 14, color: Colors.neonOrange, marginTop: 16, letterSpacing: 1 },
  loadingSubtitle: { fontFamily: 'PlusJakartaSans-Medium', fontSize: 13, color: Colors.textSecondary, marginTop: 8 },

  // Result modal
  resultModalBg: { flex: 1, backgroundColor: 'rgba(19, 19, 19, 0.85)', justifyContent: 'flex-end' },
  resultModalCard: { backgroundColor: Colors.surfaceContainerHigh, borderTopLeftRadius: Radii.xl, borderTopRightRadius: Radii.xl, padding: 24, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', borderBottomWidth: 0 },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  resultHeaderTitle: { ...Typography.headlineSm, color: Colors.onSurface },
  badgeContainer: { marginBottom: 20 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 12, borderRadius: Radii.md, alignSelf: 'flex-start' },
  badgeCacheHit: { backgroundColor: 'rgba(0, 255, 102, 0.12)', borderWidth: 1, borderColor: 'rgba(0, 255, 102, 0.3)' },
  badgeCacheHitText: { fontFamily: 'JetBrainsMono-Bold', fontSize: 11, color: '#00ff66', letterSpacing: 0.5 },
  badgeCacheMiss: { backgroundColor: 'rgba(255, 138, 61, 0.12)', borderWidth: 1, borderColor: 'rgba(255, 138, 61, 0.3)' },
  badgeCacheMissText: { fontFamily: 'JetBrainsMono-Bold', fontSize: 11, color: Colors.neonOrange, letterSpacing: 0.5 },
  badgeFallback: { backgroundColor: 'rgba(255, 138, 61, 0.12)', borderWidth: 1, borderColor: 'rgba(255, 138, 61, 0.3)' },
  badgeFallbackText: { fontFamily: 'JetBrainsMono-Bold', fontSize: 11, color: Colors.neonOrange, letterSpacing: 0.5 },
  fallbackAlert: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 138, 61, 0.08)', borderWidth: 1, borderColor: 'rgba(255, 138, 61, 0.25)', borderRadius: Radii.lg, padding: 14, marginBottom: 20 },
  fallbackAlertTitle: { fontFamily: 'PlusJakartaSans-Bold', fontSize: 14, color: Colors.neonOrange },
  fallbackAlertText: { fontFamily: 'PlusJakartaSans-Medium', fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  resultDetails: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: Radii.lg, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(42, 42, 42, 0.4)' },
  resultLabel: { fontFamily: 'JetBrainsMono-Bold', fontSize: 10, color: Colors.textMuted, letterSpacing: 1 },
  resultValue: { fontFamily: 'PlusJakartaSans-Bold', fontSize: 16, color: Colors.onSurface, marginTop: 4 },
  hashValue: { fontFamily: 'JetBrainsMono-Regular', fontSize: 12, color: Colors.cyberGreen, marginTop: 4 },
  playBtn: { width: '100%', borderRadius: Radii.full, overflow: 'hidden', marginBottom: 12 },
  playBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, gap: 8 },
  playBtnText: { fontFamily: 'PlusJakartaSans-Bold', fontSize: 16, color: '#000' },
  closeBtn: { width: '100%', paddingVertical: 14, alignItems: 'center', borderRadius: Radii.full, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.02)' },
  closeBtnText: { fontFamily: 'PlusJakartaSans-Bold', fontSize: 15, color: Colors.onSurface },

  // Web playback container
  webContainer: { flex: 1, backgroundColor: Colors.background },
  webHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceContainerHigh, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' },
  webCloseBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  webCloseText: { fontFamily: 'PlusJakartaSans-Bold', fontSize: 14, color: Colors.onSurface },
  webTitle: { flex: 1, fontFamily: 'PlusJakartaSans-Bold', fontSize: 15, color: Colors.textSecondary, textAlign: 'right', marginLeft: 16 },
  webview: { flex: 1, backgroundColor: '#000' },
  noCodeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noCodeText: { fontFamily: 'PlusJakartaSans-Medium', fontSize: 14, color: Colors.textSecondary },
});
