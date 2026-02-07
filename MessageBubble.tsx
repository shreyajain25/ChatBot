import React, { useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, Pressable, LayoutAnimation, UIManager, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import FeedBackModal from './FeedBackModal';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FEEDBACK_CHIPS = ['Inaccurate', 'Too Vague', 'Too Long'];

export default function MessageBubble({ item, onReply, onAddReaction }: { item: any; onReply?: (message: any) => void; onAddReaction?: (messageId: string, emoji: string) => void }) {
  const [showReactions, setShowReactions] = useState(false);
  const [liked, setLiked] = useState(item.hasFeedback && item.feedback === 'like');
  const [disliked, setDisliked] = useState(item.hasFeedback && item.feedback === 'dislike');
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const isUserMessage = item.sender === 'user';
  const isAIMessage = item.sender === 'ai_astrologer';
  const isDarkMode = useColorScheme() === 'dark';

  const handleDislike = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (!disliked) {
      setDisliked(true);
      setLiked(false);
    } else {
      setDisliked(false);
    }
  };

  const handleLike = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (!liked) {
      setLiked(true);
      setDisliked(false);
      setSelectedFeedback(null);
    } else {
      setLiked(false);
    }
  };

  const handleChipSelect = (chip: string) => {
    setSelectedFeedback(selectedFeedback === chip ? null : chip);
  };

  const translateX = useSharedValue(0);
  const REVEAL_WIDTH = 80;

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      'worklet';
      translateX.value = Math.max(0, e.translationX);
    })
    .onEnd(() => {
      'worklet';
      if (translateX.value > REVEAL_WIDTH / 2) {
        runOnJS(onReply)(item);
        translateX.value = withSpring(0);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const longPress = Gesture.LongPress()
    .onStart(() => {
      'worklet';
      runOnJS(setShowReactions)(true);
    });

  const composed = Gesture.Race(pan, longPress);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const replyIconStyle = useAnimatedStyle(() => ({
    // show once translated a little, slide in from left within container
    opacity: translateX.value > 10 ? 1 : 0,
    transform: [{ translateX: translateX.value > 10 ? Math.min(translateX.value / 2 - 6, REVEAL_WIDTH / 2) : -20 }],
  }));

  return (
    <View style={styles.messageRow}>
      <View style={styles.replyIconContainer} pointerEvents="auto">
        <Pressable onPress={() => onReply?.(item)} style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}>
          <Animated.View style={[styles.replyIcon, replyIconStyle]}>
            <Text style={styles.replyIconText}>↩</Text>
          </Animated.View>
        </Pressable>
      </View>

      <GestureDetector gesture={composed}>
        <Animated.View
          style={[
            styles.messageContainer,
            isUserMessage ? styles.userMessage : styles.botMessage,
            animatedStyle,
          ]}
        >
          <View style={styles.messageBubbleWrapper}>
            <View
              style={[
                styles.messageBubble,
                isUserMessage ? styles.userBubble : isDarkMode ? styles.botBubbleDark : styles.botBubbleLight,
                { alignSelf: isUserMessage ? 'flex-end' : 'flex-start' },
              ]}
            >
              <Text style={[styles.messageText, isUserMessage ? styles.userText : styles.botText]}>
                {item.text}
              </Text>
              <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
            </View>
            {item.reactions && item.reactions.length > 0 && (
              <View style={[styles.reactionBadge, isUserMessage && styles.reactionBadgeUser]} pointerEvents="none">
                <Text style={styles.reactionBadgeEmoji}>{item.reactions[0]}</Text>
              </View>
            )}
          </View>

          {/* feedback controls moved outside GestureDetector to allow presses */}
        </Animated.View>
      </GestureDetector>

      {isAIMessage && (
        <View style={styles.feedbackContainerExternal}>
          <Pressable
            style={[
              styles.feedbackButton,
              liked && styles.feedbackButtonActive,
            ]}
            onPress={handleLike}
          >
            <Text style={[styles.feedbackButtonText, liked && styles.feedbackButtonTextActive]}>👍</Text>
          </Pressable>
          <Pressable
            style={[
              styles.feedbackButton,
              disliked && styles.feedbackButtonActive,
            ]}
            onPress={handleDislike}
          >
            <Text style={[styles.feedbackButtonText, disliked && styles.feedbackButtonTextActive]}>👎</Text>
          </Pressable>

          {disliked && (
            <View style={styles.feedbackChipsWrapper}>
              <View style={styles.feedbackChipsContainer}>
                {FEEDBACK_CHIPS.map((chip) => (
                  <Pressable
                    key={chip}
                    style={[
                      styles.feedbackChip,
                      selectedFeedback === chip && styles.feedbackChipSelected,
                    ]}
                    onPress={() => handleChipSelect(chip)}
                  >
                    <Text
                      style={[
                        styles.feedbackChipText,
                        selectedFeedback === chip && styles.feedbackChipTextSelected,
                      ]}
                    >
                      {chip}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      <FeedBackModal  item={item} onAddReaction={onAddReaction} showReactions={showReactions} setShowReactions={setShowReactions} />

    </View>
  );
}

const styles = StyleSheet.create({
  messageRow: {
    position: 'relative',
    marginBottom: 12,
  },
  replyIconContainer: {
    position: 'absolute',
    left: 12,
    right:0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 80,
    overflow: 'hidden',
  },
  replyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyIconText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    top: -2,
  },
  messageContainer: {
    marginBottom: 12,
    flexDirection: 'row',
    width: '100%',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '90%',
    padding: 12,
    borderRadius: 12,
  },
  messageBubbleWrapper: {
    position: 'relative',
  },
  userBubble: {
    backgroundColor: '#4a90e2',
  },
  botBubbleLight: {
    backgroundColor: '#e0e0e0',
  },
  botBubbleDark: {
    backgroundColor: '#444',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  reactionBadge: {
    position: 'absolute',
    bottom: -8,
    right: 15,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 10,
  },
  reactionBadgeUser: {
    // borderColor: '#fff',
  },
  reactionBadgeEmoji: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  emojiReactionBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
  },
  emojiButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  emojiText: {
    fontSize: 28,
  },
  feedbackContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    marginHorizontal: 2,
    right: 20,
    alignItems: 'center',
  },
  feedbackContainerExternal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 80,
  },
  feedbackButton: {
    paddingHorizontal: 2,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  feedbackButtonActive: {
    backgroundColor: '#e8f0ff',
    borderColor: '#4a90e2',
  },
  feedbackButtonText: {
    fontSize: 16,
  },
  feedbackButtonTextActive: {
    fontWeight: '600',
  },
  feedbackChipsWrapper: {
    overflow: 'hidden',
    width: '100%',
  },
  feedbackChipsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 6,
    flexWrap: 'wrap',
  },
  feedbackChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  feedbackChipSelected: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  feedbackChipText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  feedbackChipTextSelected: {
    color: '#fff',
  },
});
