import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { theme } from './colors';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto, Feather } from "@expo/vector-icons";

const STORAGE_KEY = "@toDos"

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(() => { loadTodos() }, [])
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    try {
      const s = JSON.stringify(toSave)
      await AsyncStorage.setItem(STORAGE_KEY, s)
    } catch (e) {
      alert("할 일 저장하다가 에러남")
    }
  }
  const loadTodos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY)
      setToDos(JSON.parse(s))
    } catch (e) {
      alert("할 일 불러오다가 에러남")
    }
  }
  const addToDo = async () => {
    if (text === "") {
      return
    }
    const newToDos = { ...toDos, [Date.now()]: { text, working } }
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("")
  }
  const deleteTodo = (key) => {
    Alert.alert("할 일 삭제", "정말 삭제하시겠습니까?", [
      { text: "취소" },
      {
        text: "삭제", onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        }
      },
    ])
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{ ...styles.btnText, color: working ? "white" : theme.gray }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{ ...styles.btnText, color: working ? theme.gray : "white" }}>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        value={text}
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        placeholder={working ? "할 일을 추가하세요." : "가고싶은 곳을 쓰세요."}
        style={styles.input} />
      <ScrollView>{
        Object.keys(toDos).map(key =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <View style={styles.btnView}>
                <TouchableOpacity onPress={() => deleteTodo(key)}>
                  <Fontisto name="trash" size={18} color={theme.trash} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Feather name="edit-3" size={18} color={theme.trash} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Fontisto name="checkbox-active" size={18} color="teal" />
                  {/* checkbox-passive */}
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        )}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    marginTop: 60,
    justifyContent: "space-between"
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1
  },
  toDoText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
    flex: 3
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: "space-between",
    flex: 1
  }
});
