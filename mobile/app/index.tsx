import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { useState, useEffect } from 'react';
import { TAROT_DECK } from '@/constants/tarotDeck';



export default function HomeScreen() {
  const [result, setResult] = useState('');
  const navigation = useNavigation();
  const [question, setQuestion] = useState('');
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  const [drawnCards, setDrawnCards] = useState<
    { name: string; reversed: boolean }[]
  >([]);

  const [flipped, setFlipped] = useState<boolean[]>([false, false, false]);
  
  const handleFlip = (index: number) => {
    const updated = [...flipped];
    updated[index] = true;
    setFlipped(updated);
  };
  
  const handleQuestionSubmit = () => {
    if (question.trim()) {
      setQuestionSubmitted(true);
    }
  };
  
  
  

  useEffect(() => {
    navigation.setOptions({ headerShown: false });

    const shuffled = TAROT_DECK.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3).map(card => ({
      name: card.name,
      reversed: Math.random() < 0.5
    }));
    setDrawnCards(selected);
  }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🔮 Hello Tarot MVP</Text>
            <Text style={styles.subtitle}>Let the cards guide you...</Text>

            {/* Input row only shows BEFORE question is submitted */}
            {!questionSubmitted && (
                <View style={styles.inputRow}>
                    <TextInput
                        value={question}
                        onChangeText={setQuestion}
                        placeholder="Input question here"
                        style={styles.input}
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity onPress={handleQuestionSubmit} style={styles.sendButton}>
                        <Text>Send</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Cards only show AFTER question is submitted */}
            {questionSubmitted && (
                <View style={styles.cardWrapper}>
                    <View style={styles.cardRow}>
                        {drawnCards.map((card, idx) => (
                            <TouchableOpacity key={idx} onPress={() => handleFlip(idx)} style={styles.card}>
                                <Text>
                                    {flipped[idx] ? `${card.name} ${card.reversed ? '(Reversed)' : ''}` : '🂠'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {flipped.every(f => f) && (
                        <TouchableOpacity style={styles.readButton} onPress={async () => {
                            try {
                              const res = await fetch('https://horospokus-production.up.railway.app/horoscope', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  question,
                                  cards: drawnCards
                                })
                              });
                          
                              const data = await res.json();
                              setResult(data.result); // You’ll define this state
                            } catch (err) {
                              console.error('API error:', err);
                              setResult('Something went wrong.');
                            }
                          }}
                          >
                            <Text>Start Reading</Text>
                            {result !== '' && (
  <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
    <Text>{result}</Text>
  </View>
)}
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  card: {
    width: 100,
    height: 150,
    margin: 10,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef6e4',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  readButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#dcd6f7',
    borderRadius: 8,
  },
  cardWrapper: {
    alignItems: 'center',
    marginTop: 20,
  },
  
  
});
