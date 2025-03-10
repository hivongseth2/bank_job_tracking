import React, { useState, useRef, useContext, useEffect } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { globalStyles } from '../styles';
import Card from '../components/common/Card';

// Danh sách AI có thể chat
const AI_ASSISTANTS = [
  {
    id: 'gpt4',
    name: 'GPT-4',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png',
    description: 'Mô hình ngôn ngữ lớn của OpenAI',
    isActive: true
  },
  {
    id: 'claude',
    name: 'Claude',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Claude_logo.svg/1200px-Claude_logo.svg.png',
    description: 'Trợ lý AI của Anthropic',
    isActive: true
  },
  {
    id: 'gemini',
    name: 'Gemini',
    avatar: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini_1.max-1000x1000.png',
    description: 'Mô hình đa phương thức của Google',
    isActive: true
  },
  {
    id: 'llama',
    name: 'Llama',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Meta_AI_Logo.svg/1200px-Meta_AI_Logo.svg.png',
    description: 'Mô hình mã nguồn mở của Meta',
    isActive: false
  }
];

// Mẫu tin nhắn cho mỗi AI
const AI_RESPONSES = {
  'gpt4': [
    "Tôi là GPT-4, một mô hình ngôn ngữ lớn được phát triển bởi OpenAI. Tôi có thể giúp bạn với nhiều nhiệm vụ khác nhau.",
    "Theo quan điểm của tôi, việc quản lý tài chính cá nhân nên bắt đầu bằng việc lập ngân sách và theo dõi chi tiêu.",
    "Tôi đồng ý với Claude. Việc đặt mục tiêu tài chính rõ ràng là rất quan trọng để duy trì động lực tiết kiệm."
  ],
  'claude': [
    "Claude đây, trợ lý AI của Anthropic. Tôi được thiết kế để hữu ích, vô hại và trung thực.",
    "Tôi nghĩ rằng việc đặt mục tiêu tài chính cụ thể và có thời hạn là bước quan trọng đầu tiên trong quản lý tài chính.",
    "Tôi đồng ý với GPT-4 về tầm quan trọng của việc lập ngân sách, nhưng tôi cũng muốn nhấn mạnh việc xây dựng quỹ khẩn cấp."
  ],
  'gemini': [
    "Xin chào, tôi là Gemini, mô hình đa phương thức của Google. Tôi có thể hiểu và tạo ra văn bản, hình ảnh và nhiều loại nội dung khác.",
    "Từ góc nhìn của tôi, việc đa dạng hóa đầu tư là chiến lược quan trọng để giảm thiểu rủi ro trong quản lý tài chính.",
    "Tôi thấy cả GPT-4 và Claude đều đưa ra những điểm quan trọng. Tôi muốn bổ sung thêm về tầm quan trọng của việc đầu tư sớm."
  ],
  'llama': [
    "Tôi là Llama, một mô hình ngôn ngữ lớn mã nguồn mở được phát triển bởi Meta.",
    "Tôi cho rằng việc hiểu rõ về các sản phẩm tài chính và đầu tư là chìa khóa để quản lý tài chính hiệu quả.",
    "Tôi đồng ý với các ý kiến trước và muốn nhấn mạnh tầm quan trọng của việc tự học về tài chính cá nhân."
  ]
};

const AIChatScreen = ({ navigation }) => {
  const { colors } = useContext(ThemeContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeAIs, setActiveAIs] = useState(AI_ASSISTANTS.filter(ai => ai.isActive).map(ai => ai.id));
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);
  
  // Thêm tin nhắn chào mừng khi mở màn hình
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now().toString(),
      text: "Chào mừng bạn đến với Group Chat AI! Hãy đặt câu hỏi hoặc chủ đề để bắt đầu cuộc trò chuyện với các AI.",
      sender: 'system',
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  }, []);
  
  const handleSend = () => {
    if (!message.trim()) return;
    
    // Thêm tin nhắn của người dùng
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    // Giả lập phản hồi từ các AI
    setTimeout(() => {
      const aiResponses = [];
      
      activeAIs.forEach(aiId => {
        const ai = AI_ASSISTANTS.find(a => a.id === aiId);
        if (ai) {
          // Chọn ngẫu nhiên một phản hồi từ mẫu
          const randomIndex = Math.floor(Math.random() * AI_RESPONSES[aiId].length);
          const responseText = AI_RESPONSES[aiId][randomIndex];
          
          aiResponses.push({
            id: Date.now().toString() + aiId,
            text: responseText,
            sender: aiId,
            timestamp: new Date(Date.now() + aiResponses.length * 1000) // Thêm độ trễ giữa các tin nhắn
          });
        }
      });
      
      // Sắp xếp theo thời gian
      aiResponses.sort((a, b) => a.timestamp - b.timestamp);
      
      // Thêm từng tin nhắn với độ trễ
      aiResponses.forEach((response, index) => {
        setTimeout(() => {
          setMessages(prevMessages => [...prevMessages, response]);
          
          // Cuộn xuống tin nhắn mới nhất
          if (index === aiResponses.length - 1) {
            setIsLoading(false);
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }
        }, index * 1000); // Độ trễ giữa các tin nhắn
      });
    }, 1000);
  };
  
  const toggleAI = (aiId) => {
    setActiveAIs(prevActiveAIs => {
      if (prevActiveAIs.includes(aiId)) {
        return prevActiveAIs.filter(id => id !== aiId);
      } else {
        return [...prevActiveAIs, aiId];
      }
    });
  };
  
  const renderMessage = ({ item }) => {
    // Tin nhắn hệ thống
    if (item.sender === 'system') {
      return (
        <View style={styles.systemMessageContainer}>
          <Card style={[styles.systemMessage, { backgroundColor: `${colors.primary}10` }]}>
            <Text style={[styles.systemMessageText, { color: colors.text }]}>{item.text}</Text>
          </Card>
        </View>
      );
    }
    
    // Tin nhắn người dùng
    if (item.sender === 'user') {
      return (
        <View style={styles.userMessageContainer}>
          <View style={[styles.userMessage, { backgroundColor: colors.primary }]}>
            <Text style={styles.userMessageText}>{item.text}</Text>
          </View>
        </View>
      );
    }
    
    // Tin nhắn AI
    const ai = AI_ASSISTANTS.find(a => a.id === item.sender);
    if (ai) {
      return (
        <View style={styles.aiMessageContainer}>
          <Image source={{ uri: ai.avatar }} style={styles.aiAvatar} />
          <View style={[styles.aiMessage, { backgroundColor: `${colors.text}10` }]}>
            <Text style={[styles.aiName, { color: colors.primary }]}>{ai.name}</Text>
            <Text style={[styles.aiMessageText, { color: colors.text }]}>{item.text}</Text>
          </View>
        </View>
      );
    }
    
    return null;
  };
  
  const renderAISelector = () => {
    return (
      <View style={styles.aiSelectorContainer}>
        <Text style={[styles.aiSelectorTitle, { color: colors.text }]}>AI trong cuộc trò chuyện:</Text>
        <View style={styles.aiList}>
          {AI_ASSISTANTS.map(ai => (
            <TouchableOpacity
              key={ai.id}
              style={[
                styles.aiItem,
                { 
                  backgroundColor: activeAIs.includes(ai.id) 
                    ? `${colors.primary}20` 
                    : `${colors.text}10`,
                  borderColor: activeAIs.includes(ai.id)
                    ? colors.primary
                    : colors.border
                }
              ]}
              onPress={() => toggleAI(ai.id)}
              disabled={!ai.isActive}
            >
              <Image source={{ uri: ai.avatar }} style={styles.aiSelectorAvatar} />
              <View style={styles.aiSelectorInfo}>
                <Text 
                  style={[
                    styles.aiSelectorName, 
                    { 
                      color: activeAIs.includes(ai.id) ? colors.primary : colors.text,
                      opacity: ai.isActive ? 1 : 0.5
                    }
                  ]}
                >
                  {ai.name}
                </Text>
                {!ai.isActive && (
                  <Text style={[styles.aiUnavailable, { color: colors.textSecondary }]}>
                    Không khả dụng
                  </Text>
                )}
              </View>
              {ai.isActive && (
                <View 
                  style={[
                    styles.aiCheckbox, 
                    { 
                      backgroundColor: activeAIs.includes(ai.id) 
                        ? colors.primary 
                        : 'transparent',
                      borderColor: activeAIs.includes(ai.id)
                        ? colors.primary
                        : colors.border
                    }
                  ]}
                >
                  {activeAIs.includes(ai.id) && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: colors.background }]}>
      <View style={[globalStyles.glassHeader, { backgroundColor: colors.glass }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: `${colors.text}10` }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[globalStyles.title, { color: colors.text }]}>Group Chat AI</Text>
          <TouchableOpacity 
            style={[styles.infoButton, { backgroundColor: `${colors.text}10` }]}
            onPress={() => Alert.alert('Thông tin', 'Đây là tính năng cho phép bạn chat với nhiều AI cùng lúc để nhận được nhiều góc nhìn khác nhau về một chủ đề.')}
          >
            <Ionicons name="information-circle-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
          ListHeaderComponent={renderAISelector}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        
        <View style={[styles.inputContainer, { backgroundColor: colors.glass, borderTopColor: colors.glassBorder }]}>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: `${colors.text}10`,
                color: colors.text,
                borderColor: colors.border
              }
            ]}
            value={message}
            onChangeText={setMessage}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor={colors.textSecondary}
            multiline
          />
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              { 
                backgroundColor: message.trim() ? colors.primary : `${colors.text}20`,
                opacity: message.trim() ? 1 : 0.7
              }
            ]}
            onPress={handleSend}
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageList: {
    padding: 16,
    paddingBottom: 16,
  },
  systemMessageContainer: {
    marginVertical: 8,
    alignItems: 'center',
  },
  systemMessage: {
    padding: 8,
    borderRadius: 8,
    maxWidth: '80%',
  },
  systemMessageText: {
    fontSize: 14,
    textAlign: 'center',
  },
  userMessageContainer: {
    marginVertical: 8,
    alignItems: 'flex-end',
  },
  userMessage: {
    padding: 12,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    maxWidth: '80%',
  },
  userMessageText: {
    color: 'white',
    fontSize: 16,
  },
  aiMessageContainer: {
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  aiMessage: {
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    maxWidth: '75%',
  },
  aiName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  aiMessageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    borderWidth: 1,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiSelectorContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  aiSelectorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  aiList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  aiItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  aiSelectorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  aiSelectorInfo: {
    flex: 1,
  },
  aiSelectorName: {
    fontSize: 14,
    fontWeight: '500',
  },
  aiUnavailable: {
    fontSize: 10,
  },
  aiCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AIChatScreen;