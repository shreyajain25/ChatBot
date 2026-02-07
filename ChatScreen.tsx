import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MessageBubble from './MessageBubble';
import EndOverlay from './EndOverlay';
import { useChatStore } from './store/useChatStore';

export function ChatScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const [showEndOverlay, setShowEndOverlay] = useState(false);
  const {
    messages,
    replyingTo,
    rating,
    setReplyingTo,
    setRating,
    addMessage,
    addReaction,
  } = useChatStore();

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: String(messages.length + 1),
      sender: 'user',
      text: inputText,
      timestamp: Date.now(),
      type: 'text',
      replyTo: replyingTo?.id || null,
      reactions: [],
    };

    addMessage(newMessage);
    setInputText('');
    setReplyingTo(null);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: String(messages.length + 2),
        sender: 'ai_astrologer',
        text: 'Thank you for your message. I am analyzing your query.',
        timestamp: Date.now(),
        type: 'ai',
        reactions: [],
      };
      addMessage(aiResponse as any);
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View style={[styles.header, { paddingTop: safeAreaInsets.top }]}>
        <Text style={styles.headerTitle}>ChatBot</Text>
        <Pressable
          onPress={() => setShowEndOverlay(true)}
          style={({ pressed }) => [
            { alignSelf: 'center', opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <Text style={styles.headerButton}>End Chat</Text>
        </Pressable>
      </View>

      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <MessageBubble
            item={item}
            onReply={setReplyingTo}
            onAddReaction={addReaction}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContent}
        inverted={false}
      />

      {replyingTo && (
        <View style={styles.replyPreviewContainer}>
          <View style={styles.replyPreviewContent}>
            <Text style={styles.replyPreviewLabel}>Replying to</Text>
            <Text style={styles.replyPreviewText} numberOfLines={2}>
              {replyingTo.text}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setReplyingTo(null)}>
            <Text style={styles.replyPreviewCancel}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <EndOverlay visible={showEndOverlay} rating={rating} setRating={setRating} onClose={() => {
        setShowEndOverlay(false);
        Alert.alert(
          'Chat Ended',
          'Your Rating data is captured. Thank you for using our service!',
        );
      }} />

      <View
        style={[
          styles.inputContainer,
          { paddingBottom: safeAreaInsets.bottom },
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxHeight={100}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          activeOpacity={0.7}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  headerButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  messagesContent: {
    padding: 12,
    flexGrow: 1,
  },
  replyPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#e8f0ff',
    borderLeftWidth: 4,
    borderLeftColor: '#4a90e2',
    justifyContent: 'space-between',
  },
  replyPreviewContent: {
    flex: 1,
  },
  replyPreviewLabel: {
    fontSize: 12,
    color: '#4a90e2',
    fontWeight: '600',
    marginBottom: 2,
  },
  replyPreviewText: {
    fontSize: 14,
    color: '#333',
  },
  replyPreviewCancel: {
    fontSize: 20,
    color: '#999',
    marginLeft: 8,
    padding: 4,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 8,
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 20,
    paddingHorizontal: 25,
    justifyContent: 'center',
    maxHeight: 40,
    alignSelf: 'center',
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
