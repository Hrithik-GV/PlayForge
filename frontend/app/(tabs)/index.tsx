import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  RefreshControl,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { Colors, Spacing, Radii, Typography } from '@/constants/theme';
import { GameRuntime } from '@/components/GameRuntime';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock data for the home feed
const FEATURED_GAME = {
  title: 'Neon Drift',
  creator: '@kaibuilds',
  description: 'Outrun the grid at 300kph. One tap to boost, swipe to drift.',
  plays: '1.2M',
  likes: '48K',
  genre: 'Racing',
  vibe: 'Cyber',
};

const RECENT_GAMES = [
  { id: '1', title: 'Block Rush', creator: '@pixelpete', plays: '2.4M', genre: 'Puzzle' },
  { id: '2', title: 'Star Salvo', creator: '@novashoots', plays: '890K', genre: 'Shooter' },
  { id: '3', title: 'Crystal Crypt', creator: '@alexforge', plays: '1.1M', genre: 'RPG' },
  { id: '4', title: 'Cloud Bound', creator: '@skymaker', plays: '560K', genre: 'Action' },
];

const CATEGORIES = ['For You', 'Racing', 'Puzzle', 'RPG', 'Action', 'Horror'];

// Helper to determine backend base URL
const getApiBaseUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:5000`;
  }
  return 'http://127.0.0.1:5000'; // fallback
};

const SvgThumbnail = ({ uri }: { uri?: string }) => {
  if (!uri) {
    return <MaterialIcons name="sports-esports" size={32} color="rgba(255,138,61,0.3)" />;
  }
  const source = uri.startsWith('data:') 
    ? { html: `<html><body style="margin:0;padding:0;background:transparent;overflow:hidden;display:flex;justify-content:center;align-items:center;"><img src="${uri}" style="width:100%;height:100%;object-fit:cover;"/></body></html>` }
    : { uri };

  return (
    <WebView
      source={source}
      style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
      scrollEnabled={false}
      pointerEvents="none"
    />
  );
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = React.useState('For You');

  // Feed and gameplay modal states
  const [feed, setFeed] = React.useState<any[]>([]);
  const [loadingFeed, setLoadingFeed] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedGame, setSelectedGame] = React.useState<any>(null);

  const fetchFeed = async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/feed`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.feed)) {
          setFeed(data.feed);
        }
      }
    } catch (err) {
      console.warn('Error fetching social feed:', err);
    }
  };

  React.useEffect(() => {
    setLoadingFeed(true);
    fetchFeed().finally(() => setLoadingFeed(false));
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchFeed();
    setRefreshing(false);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.neonOrange} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logoText}>PlayForge</Text>
            <Text style={styles.logoSubtext}>forge your world</Text>
          </View>
          <Pressable style={styles.searchButton}>
            <MaterialIcons name="search" size={24} color={Colors.onSurface} />
          </Pressable>
        </View>

        {/* Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              style={[
                styles.chip,
                activeCategory === cat && styles.chipActive,
              ]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text
                style={[
                  styles.chipText,
                  activeCategory === cat && styles.chipTextActive,
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Featured Game Card */}
        <View style={styles.featuredCard}>
          <LinearGradient
            colors={['#ff8a3d', '#D35400', '#131313']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.featuredGradient}
          >
            {/* Game preview placeholder */}
            <View style={styles.featuredImageArea}>
              <MaterialIcons name="sports-esports" size={64} color="rgba(255,255,255,0.3)" />
              <View style={styles.liveTag}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.featuredContent}>
            <View style={styles.featuredMeta}>
              <View style={styles.avatarSmall}>
                <Text style={styles.avatarText}>K</Text>
              </View>
              <Text style={styles.creatorText}>{FEATURED_GAME.creator}</Text>
              <View style={styles.genreChip}>
                <Text style={styles.genreChipText}>{FEATURED_GAME.genre}</Text>
              </View>
            </View>

            <Text style={styles.featuredTitle}>{FEATURED_GAME.title}</Text>
            <Text style={styles.featuredDesc}>{FEATURED_GAME.description}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialIcons name="play-arrow" size={16} color={Colors.neonOrange} />
                <Text style={styles.statText}>{FEATURED_GAME.plays} plays</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialIcons name="favorite" size={16} color={Colors.neonOrange} />
                <Text style={styles.statText}>{FEATURED_GAME.likes}</Text>
              </View>
            </View>

            <Pressable style={styles.playButton}>
              <LinearGradient
                colors={[Colors.neonOrange, Colors.deepOrange]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.playButtonGradient}
              >
                <MaterialIcons name="play-arrow" size={20} color="#000" />
                <Text style={styles.playButtonText}>Play Now</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>

        {/* Recently Forged Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Forged</Text>
          <Pressable>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        {loadingFeed && feed.length === 0 ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator color={Colors.neonOrange} size="large" />
          </View>
        ) : feed.length === 0 ? (
          <View style={{ padding: 24, alignItems: 'center', backgroundColor: Colors.surfaceContainer, borderRadius: Radii.md, marginHorizontal: 20, marginBottom: 12 }}>
            <MaterialIcons name="sports-esports" size={32} color={Colors.textSecondary} />
            <Text style={{ fontFamily: 'PlusJakartaSans-Medium', color: Colors.textSecondary, marginTop: 8, textAlign: 'center' }}>
              No games published to feed yet.
            </Text>
            <Text style={{ fontFamily: 'PlusJakartaSans-Regular', color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4, textAlign: 'center' }}>
              Be the first to forge and publish a game!
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentContainer}
          >
            {feed.map((game) => (
              <Pressable key={game._id} style={styles.gameCard} onPress={() => setSelectedGame(game)}>
                <View style={styles.gameCardGradient}>
                  <SvgThumbnail uri={game.thumbnail} />
                </View>
                <View style={styles.gameCardContent}>
                  <Text style={styles.gameCardTitle} numberOfLines={1}>{game.title}</Text>
                  <Text style={styles.gameCardCreator} numberOfLines={1}>{game.prompt || 'Generated game'}</Text>
                  <View style={styles.gameCardStats}>
                    <MaterialIcons name="play-arrow" size={12} color={Colors.cyberGreen} />
                    <Text style={[styles.gameCardPlays, { color: Colors.cyberGreen, fontFamily: 'PlusJakartaSans-Bold' }]}>PLAY</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Quick Forge Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Forge</Text>
        </View>

        <Pressable style={styles.quickForgeCard}>
          <LinearGradient
            colors={['rgba(255,138,61,0.08)', 'rgba(41,255,128,0.05)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quickForgeGradient}
          >
            <View style={styles.quickForgeIcon}>
              <MaterialIcons name="auto-awesome" size={28} color={Colors.cyberGreen} />
            </View>
            <View style={styles.quickForgeText}>
              <Text style={styles.quickForgeTitle}>Describe your game idea...</Text>
              <Text style={styles.quickForgeSubtext}>AI-powered • Playable in ~20s</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={20} color={Colors.neonOrange} />
          </LinearGradient>
        </Pressable>
      </ScrollView>

      {/* WebView Gameplay Modal */}
      <Modal visible={!!selectedGame} animationType="slide" presentationStyle="fullScreen">
        <GameRuntime
          gameCode={selectedGame?.gameCode || ''}
          title={selectedGame?.title || 'Game Player'}
          onClose={() => setSelectedGame(null)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.containerMargin,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  logoText: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
  },
  logoSubtext: {
    ...Typography.labelMono,
    color: Colors.neonOrange,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Category chips
  categoryContainer: {
    paddingHorizontal: Spacing.containerMargin,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: Colors.neonOrange,
    borderColor: Colors.neonOrange,
  },
  chipText: {
    ...Typography.bodySm,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: '#000',
    fontFamily: 'PlusJakartaSans-Bold',
  },

  // Featured card
  featuredCard: {
    marginHorizontal: Spacing.containerMargin,
    borderRadius: Radii.xl,
    backgroundColor: Colors.surfaceContainerLow,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(42, 42, 42, 0.5)',
  },
  featuredGradient: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredImageArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.full,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.cyberGreen,
  },
  liveText: {
    ...Typography.labelMono,
    color: Colors.cyberGreen,
    fontSize: 10,
  },
  featuredContent: {
    padding: Spacing.md,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.sm,
  },
  avatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.neonOrange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: '#000',
  },
  creatorText: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
  },
  genreChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(255,138,61,0.15)',
  },
  genreChipText: {
    ...Typography.labelMono,
    color: Colors.neonOrange,
    fontSize: 10,
  },
  featuredTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  featuredDesc: {
    ...Typography.bodyMd,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    ...Typography.labelMono,
    color: Colors.textSecondary,
  },
  playButton: {
    borderRadius: Radii.full,
    overflow: 'hidden',
  },
  playButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  playButtonText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#000',
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.containerMargin,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
  },
  seeAll: {
    ...Typography.bodySm,
    color: Colors.neonOrange,
    fontFamily: 'PlusJakartaSans-Medium',
  },

  // Recent games
  recentContainer: {
    paddingHorizontal: Spacing.containerMargin,
    gap: 12,
  },
  gameCard: {
    width: 150,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceContainerLow,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(42,42,42,0.4)',
    marginRight: 12,
  },
  gameCardGradient: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: Colors.surfaceContainerHigh,
  },
  gameCardContent: {
    padding: 12,
  },
  gameCardTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: Colors.onSurface,
    marginBottom: 2,
  },
  gameCardCreator: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  gameCardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gameCardPlays: {
    ...Typography.labelMono,
    color: Colors.textSecondary,
    fontSize: 10,
  },

  // Quick Forge
  quickForgeCard: {
    marginHorizontal: Spacing.containerMargin,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(42,42,42,0.4)',
  },
  quickForgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: 12,
  },
  quickForgeIcon: {
    width: 48,
    height: 48,
    borderRadius: Radii.lg,
    backgroundColor: 'rgba(41,255,128,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickForgeText: {
    flex: 1,
  },
  quickForgeTitle: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 14,
    color: Colors.onSurface,
  },
  quickForgeSubtext: {
    ...Typography.labelMono,
    color: Colors.cyberGreen,
    fontSize: 10,
    marginTop: 2,
  },
});
