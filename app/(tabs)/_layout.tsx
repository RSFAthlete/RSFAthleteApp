import { Link, Tabs } from 'expo-router';
import { SymbolView, SymbolViewProps } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';

import { Logo, usePalette } from '@/components/ui';
import { useStore } from '@/lib/store';
import { brand, fonts } from '@/lib/theme';

type Icon = SymbolViewProps['name'];
const icons: Record<string, Icon> = {
  index: { ios: 'house', android: 'home', web: 'home' },
  modules: { ios: 'book', android: 'menu_book', web: 'menu_book' },
  team: { ios: 'person.3', android: 'groups', web: 'groups' },
  bot: { ios: 'bubble.left.and.bubble.right', android: 'forum', web: 'forum' },
  training: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  portal: { ios: 'graduationcap', android: 'school', web: 'school' },
};

// Which tabs each role sees. Coaches reach the toolkit from Home.
const visible = {
  athlete: ['index', 'modules', 'team', 'bot', 'training'],
  coach: ['index', 'modules', 'team', 'bot', 'portal'],
};

export default function TabLayout() {
  const { role } = useStore();
  const p = usePalette();
  const show = (name: string) => visible[role].includes(name);

  const tab = (name: string, title: string) => (
    <Tabs.Screen
      name={name}
      options={{
        title,
        href: show(name) ? undefined : null,
        tabBarIcon: ({ color }) => <SymbolView name={icons[name]} tintColor={color} size={24} />,
      }}
    />
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: p.ink,
        tabBarInactiveTintColor: p.mute,
        tabBarStyle: { backgroundColor: p.bg, borderTopColor: p.line },
        tabBarLabelStyle: { fontFamily: fonts.body, fontSize: 12 },
        headerStyle: { backgroundColor: p.bg },
        headerShadowVisible: false,
        headerTitle: () => <Logo size={18} />,
        headerTitleAlign: 'left',
        headerRight: () => (
          <Link href="/profile" asChild>
            <Pressable accessibilityLabel="Profile" style={{ marginRight: 16 }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: brand.blue, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.mono, color: brand.black }}>{role === 'athlete' ? 'JM' : 'CD'}</Text>
              </View>
            </Pressable>
          </Link>
        ),
      }}>
      {tab('index', 'Home')}
      {tab('modules', 'Modules')}
      {tab('team', role === 'coach' ? 'Teams' : 'Team')}
      {tab('bot', 'RSF Bot')}
      {tab('training', 'Training')}
      {tab('portal', 'Coaches')}
    </Tabs>
  );
}
