import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radii, Typography } from '@/constants/theme';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

interface Notification {
  id: string;
  type: 'milestone' | 'like' | 'remix' | 'follow' | 'comment';
  icon: IconName;
  iconColor: string;
  text: string;
  time: string;
}

const TODAY: Notification[] = [
  { id: '1', type: 'milestone', icon: 'emoji-events', iconColor: Colors.neonOrange, text: 'Neon Drift just crossed 1M plays! 🎉', time: '2m ago' },
  { id: '2', type: 'like', icon: 'favorite', iconColor: '#ff6b8a', text: 'Mara Voss and 1,204 others liked your game Ember Depths', time: '18m ago' },
  { id: '3', type: 'remix', icon: 'auto-awesome', iconColor: Colors.cyberGreen, text: 'Pixel Pete remixed your game into Block Rush: Turbo', time: '1h ago' },
  { id: '4', type: 'follow', icon: 'person-add', iconColor: Colors.tertiary, text: 'Nova Lin started following you', time: '3h ago' },
  { id: '5', type: 'comment', icon: 'chat-bubble', iconColor: Colors.primary, text: 'Kai Rivera commented: "the drift physics are unreal 🔥"', time: '5h ago' },
];

const EARLIER: Notification[] = [
  { id: '6', type: 'follow', icon: 'person-add', iconColor: Colors.tertiary, text: 'Zara Okafor started following you', time: '1d ago' },
];

function NotifItem({ item }: { item: Notification }) {
  return (
    <Pressable style={styles.notifItem}>
      <View style={[styles.notifIcon, { backgroundColor: `${item.iconColor}15` }]}>
        <MaterialIcons name={item.icon} size={20} color={item.iconColor} />
      </View>
      <View style={styles.notifContent}>
        <Text style={styles.notifText}>{item.text}</Text>
        <Text style={styles.notifTime}>{item.time}</Text>
      </View>
    </Pressable>
  );
}

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Notifications</Text>
          <View style={styles.badgeRow}>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>3</Text>
            </View>
            <Text style={styles.newLabel}>new updates</Text>
          </View>
        </View>

        {/* Today */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Today</Text>
          {TODAY.map((n) => <NotifItem key={n.id} item={n} />)}
        </View>

        {/* Earlier */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Earlier</Text>
          {EARLIER.map((n) => <NotifItem key={n.id} item={n} />)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.containerMargin, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  pageTitle: { ...Typography.displayLg, color: Colors.onSurface, fontSize: 30 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  countBadge: { backgroundColor: Colors.neonOrange, paddingHorizontal: 10, paddingVertical: 3, borderRadius: Radii.full },
  countText: { fontFamily: 'PlusJakartaSans-Bold', fontSize: 13, color: '#000' },
  newLabel: { fontFamily: 'PlusJakartaSans-Regular', fontSize: 14, color: Colors.textSecondary },
  section: { paddingHorizontal: Spacing.containerMargin, marginTop: Spacing.lg },
  sectionLabel: { fontFamily: 'PlusJakartaSans-SemiBold', fontSize: 14, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  notifItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, paddingVertical: 14 },
  notifIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  notifContent: { flex: 1 },
  notifText: { fontFamily: 'PlusJakartaSans-Regular', fontSize: 14, color: Colors.onSurface, lineHeight: 20 },
  notifTime: { fontFamily: 'JetBrainsMono-Medium', fontSize: 11, color: Colors.textMuted, marginTop: 4 },
});
