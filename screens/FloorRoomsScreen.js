import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { collection, addDoc, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // ✅ correct path

export default function FloorRoomsScreen() {
  const route = useRoute();
  const { projectId } = route.params;

  console.log("Project ID:", projectId); // 🔍 add this for debug

  const [floorName, setFloorName] = useState("");
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "projects", projectId, "floors"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFloors(items);
    });
    return unsubscribe;
  }, []);

  const addFloor = async () => {
    if (!floorName) return;
    await addDoc(collection(db, "projects", projectId, "floors"), {
      name: floorName,
    });
    setFloorName("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Floors</Text>
      <TextInput
        style={styles.input}
        placeholder="Floor name"
        value={floorName}
        onChangeText={setFloorName}
      />
      <Button title="Add Floor" onPress={addFloor} />
      <FlatList
        data={floors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>- {item.name}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
  },
});
