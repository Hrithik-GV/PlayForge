import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radii, Typography } from '@/constants/theme';

const TOP_CHARTS = [
  { id: '1', rank: 1, title: 'Block Rush', creator: '@pixelpete', genre: 'Puzzle', plays: '2.4M', change: 'up' as const },
  { id: '2', rank: 2, title: 'Star Salvo', creator: '@novashoots', genre: 'Shooter', plays: '1.8M', change: 'up' as const },
  { id: '3', rank: 3, title: 'Neon Drift', creator: '@kaibuilds', genre: 'Racing', plays: '1.2M', change: 'same' as const },
  { id: '4', rank: 4, title: 'Crystal Crypt', creator: '@alexforge', genre: 'RPG', plays: '1.1M', change: 'down' as const },
  { id: '5', rank: 5, title: 'Cloud Bound', creator: '@skymaker', genre: 'Action', plays: '890K', change: 'up' as const },
  { id: '6', rank: 6, title: 'Ember Depths', creator: '@alexforge', genre: 'Horror', plays: '760K', change: 'new' as const },
];

const TAGS = ['All', 'This Week', 'New', 'Rising', 'Classics'];

export default function TrendingScreen() {
  const insets = useSafeAreaInsets();
  const [activeTag, setActiveTag] = React.useState('All');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PlayForge</Text>
        </View>
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <MaterialIcons name="local-fire-department" size={28} color={Colors.neonOrange} />
            <Text style={styles.pageTitle}>Trending</Text>
          </View>
          <Text style={styles.subtitle}>What the forge is playing right now</Text>
        </View>

        {/* Tags */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsRow}>
          {TAGS.map((t) => (
            <Pressable key={t} style={[styles.tag, activeTag === t && styles.tagActive]} onPress={() => setActiveTag(t)}>
              <Text style={[styles.tagText, activeTag === t && styles.tagTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Featured */}
        <Pressable style={styles.featuredCard}>
          <View style={styles.featuredImg}>
            <MaterialIcons name="sports-esports" size={56} color="rgba(255,138,61,0.4)" />
            <View style={styles.hotBadge}>
              <MaterialIcons name="local-fire-department" size={14} color="#000" />
              <Text style={styles.hotText}>#1 TRENDING</Text>
            </View>
          </View>
          <View style={styles.featuredInfo}>
            <Text style={styles.featuredTitle}>Block Rush</Text>
            <Text style={styles.featuredMeta}>@pixelpete • 2.4M plays</Text>
          </View>
        </Pressable>

        {/* Top Charts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top charts</Text>
          <MaterialIcons name="bar-chart" size={20} color={Colors.textSecondary} />
        </View>
        <View style={styles.chartList}>
          {TOP_CHARTS.map((g) => (
            <Pressable key={g.id} style={styles.chartItem}>
              <View style={styles.rankBox}>
                <Text style={[styles.rankNum, g.rank <= 3 && { color: Colors.neonOrange }]}>{g.rank}</Text>
                {g.change === 'up' && <MaterialIcons name="arrow-drop-up" size={16} color={Colors.cyberGreen} />}
                {g.change === 'down' && <MaterialIcons name="arrow-drop-down" size={16} color={Colors.error} />}
                {g.change === 'new' && <Text style={styles.newLabel}>NEW</Text>}
                {g.change === 'same' && <MaterialIcons name="remove" size={12} color={Colors.textMuted} />}
              </View>
              <View style={styles.chartThumb}>
                <MaterialIcons name="sports-esports" size={22} color="rgba(255,138,61,0.3)" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.chartName}>{g.title}</Text>
                <Text style={styles.chartMeta}>{g.creator} • {g.genre}</Text>
              </View>
              <View style={styles.playsCol}>
                <Text style={styles.playsNum}>{g.plays}</Text>
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
  header: { paddingHorizontal: Spacing.containerMargin, paddingTop: Spacing.md },
  headerTitle: { ...Typography.headlineMd, color: Colors.onSurface },
  titleSection: { paddingHorizontal: Spacing.containerMargin, paddingTop: Spacing.lg },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pageTitle: { ...Typography.headlineMd, color: Colors.onSurface, fontSize: 30 },
  subtitle: { ...Typography.bodyMd, color: Colors.textSecondary, marginTop: 4 },
  tagsRow: { paddingHorizontal: Spacing.containerMargin, paddingVertical: Spacing.md },
  tag: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radii.full, backgroundColor: Colors.surfaceContainerHighest, borderWidth: 1, borderColor: Colors.cardBorder, marginRight: 8 },
  tagActive: { backgroundColor: Colors.neonOrange, borderColor: Colors.neonOrange },
  tagText: { fontFamily: 'PlusJakartaSans-Medium', fontSize: 12, color: Colors.textSecondary },
  tagTextActive: { color: '#000', fontFamily: 'PlusJakartaSans-Bold' },
  featuredCard: { marginHorizontal: Spacing.containerMargin, borderRadius: Radii.xl, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(42,42,42,0.5)', backgroundColor: Colors.surfaceContainerLow },
  featuredImg: { height: 160, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.surfaceContainerHigh },
  hotBadge: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.neonOrange, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radii.full, gap: 4 },
  hotText: { fontFamily: 'JetBrainsMono-Medium', fontSize: 10, color: '#000' },
  featuredInfo: { padding: Spacing.md },
  featuredTitle: { ...Typography.headlineSm, color: Colors.onSurface },
  featuredMeta: { ...Typography.bodyMd, color: Colors.textSecondary, marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.containerMargin, marginTop: Spacing.lg, marginBottom: Spacing.md },
  sectionTitle: { ...Typography.headlineSm, color: Colors.onSurface },
  chartList: { paddingHorizontal: Spacing.containerMargin },
  chartItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  rankBox: { width: 28, alignItems: 'center' },
  rankNum: { fontFamily: 'PlusJakartaSans-Bold', fontSize: 16, color: Colors.textSecondary },
  newLabel: { fontFamily: 'JetBrainsMono-Medium', fontSize: 8, color: Colors.cyberGreen },
  chartThumb: { width: 48, height: 48, borderRadius: Radii.md, backgroundColor: Colors.surfaceContainerHigh, justifyContent: 'center', alignItems: 'center' },
  chartName: { fontFamily: 'PlusJakartaSans-SemiBold', fontSize: 14, color: Colors.onSurface },
  chartMeta: { fontFamily: 'PlusJakartaSans-Regular', fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  playsCol: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  playsNum: { fontFamily: 'JetBrainsMono-Medium', fontSize: 12, color: Colors.textSecondary },
});
