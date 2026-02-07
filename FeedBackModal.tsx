import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

interface FeedBackModalProps {
    item: { id: string | number };
    onAddReaction?: (messageId: string, emoji: string) => void
    showReactions: boolean;
    setShowReactions: (show: boolean) => void;
}

export default function FeedBackModal({ item, onAddReaction,showReactions,setShowReactions  }: FeedBackModalProps) {

    return (
        <Modal
            visible={showReactions}
            transparent
            animationType="fade"
            onRequestClose={() => setShowReactions(false)}
        >
            <Pressable
                style={styles.modalOverlay}
                onPress={() => setShowReactions(false)}
            >
                <View style={styles.emojiReactionBar}>
                    {EMOJI_REACTIONS.map((emoji) => (
                        <Pressable
                            key={emoji}
                            style={styles.emojiButton}
                            onPress={() => {
                                onAddReaction?.(item.id, emoji);
                                setShowReactions(false);
                            }}
                        >
                            <Text style={styles.emojiText}>{emoji}</Text>
                        </Pressable>
                    ))}
                </View>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    emojiReactionBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    emojiButton: {
        paddingHorizontal: 8,
    },
    emojiText: {
        fontSize: 24,
    },
});