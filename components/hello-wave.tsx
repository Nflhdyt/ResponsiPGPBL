import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export function HelloWave() {
  return (
    <View
      style={{
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
      }}>
      <Ionicons name="sparkles-outline" size={28} />
    </View>
  );
}
