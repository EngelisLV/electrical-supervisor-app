import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { db } from "./firebase";
import { doc, addDoc, collection, onSnapshot, Timestamp } from "firebase/firestore";

export default function ProjectDetails({ route }) {
  const { projectId, internalCode, clientProjectName } = route.params;
  const [floorName, setFloorName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const floorRef = collection(db, "projects", projectId, "floors");
    const unsubFloors = onSnapshot(floorRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFloors(data);
    });

    const roomRef = collection(db, "projects", projectId, "rooms");
    const unsubRooms = onSnapshot(roomRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRooms(data);
    });

    return () => {
      unsubFloors();
      unsubRooms();
    };
  }, []);

  const addFloor = async () => {
    if (!floorName) return;
    await addDoc(collection(db, "projects", projectId, "floors"), {
      name: floorName,
      createdAt: Timestamp.now(),
    });
    setFloorName("");
  };

  const addRoom = async () => {
    if (!roomName) return;
    await addDoc(collection(db, "projects", projectId, "rooms"), {
      name: roomName,
      createdAt: Timestamp.now(),
    });
    setRoomName("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{internalCode} - {clientProjectName}</Text>

      <Text style={styles.section}>Add Floor</Text>
      <TextInput
        placeholder="Floor name (e.g. Floor 1)"
        value={floorName}
        onChangeText={setFloorName}
        style={styles.input}
      />
      <Button title="Add Floor" onPress={addFloor} />

      <Text style={styles.section}>Add Room</Text>
      <TextInput
        placeholder="Room name (e.g. Room A)"
        value={roomName}
        onChangeText={setRoomName}
        style={styles.input}
      />
      <Button title="Add Room" onPress={addRoom} />

      <Text style={styles.section}>Floors:</Text>
      <FlatList
        data={floors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>- {item.name}</Text>}
      />

      <Text style={styles.section}>Rooms:</Text>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>- {item.name}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  section: { marginTop: 20, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    marginTop: 5,
  },
});
