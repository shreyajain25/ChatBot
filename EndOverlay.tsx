import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type EndOverlayProps = {
  visible: boolean;
  rating: number;
  setRating: (r: number) => void;
  onClose: () => void;
};

export default function EndOverlay({
  visible,
  rating,
  setRating,
  onClose,
}: EndOverlayProps) {
  if (!visible) return null;

  return (
    <View style={styles.endOverlay} pointerEvents="box-none">
      <View style={styles.endOverlayContent}>
        <Text style={styles.endTitle}>Thank you</Text>
        <Text style={styles.endSubtitle}>Please rate your experience</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map(s => (
            <Pressable
              key={s}
              onPress={() => setRating(s)}
              style={styles.starButton}
            >
              <Text
                style={[
                  styles.star,
                  rating >= s ? styles.starActive : styles.starInactive,
                ]}
              >
                {rating >= s ? '★' : '☆'}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.thanksText}>
          Thanks for chatting with our astrologer.
        </Text>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  endOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  endOverlayContent: {
    width: '90%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  endTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  endSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 32,
    marginHorizontal: 2,
  },
  starActive: { color: '#ffb300' },
  starInactive: { color: '#ccc' },
  thanksText: { marginTop: 12, color: '#333' },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#4a90e2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: { color: '#fff', fontWeight: '600' },
});
