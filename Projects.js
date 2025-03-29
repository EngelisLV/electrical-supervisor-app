import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { db, auth } from "./firebase";
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";

export default function Projects({ navigation }) {
  const [internalCode, setInternalCode] = useState("");
  const [clientProjectName, setClientProjectName] = useState("");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    });
    return unsubscribe;
  }, []);

  const handleAddProject = async () => {
    if (!internalCode || !clientProjectName) return;
    await addDoc(collection(db, "projects"), {
      internalCode,
      clientProjectName,
      createdBy: auth.currentUser.email,
      createdAt: Timestamp.now()
    });
    setInternalCode("");
    setClientProjectName("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Project</Text>
      <TextInput
        placeholder="Internal Code (e.g. AR-510)"
        value={internalCode}
        onChangeText={setInternalCode}
        style={styles.input}
      />
      <TextInput
        placeholder="Client Project Name"
        value={clientProjectName}
        onChangeText={setClientProjectName}
        style={styles.input}
      />
      <Button title="Add Project" onPress={handleAddProject} />

      <Text style={styles.listTitle}>Project List:</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.projectItem}>
            <Text
              style={styles.projectLink}
              onPress={() =>
                navigation.navigate("ProjectDetails", {
                  projectId: item.id,
                  internalCode: item.internalCode,
                  clientProjectName: item.clientProjectName,
                })
              }
            >
              {item.internalCode} - {item.clientProjectName}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
  listTitle: { marginTop: 20, fontWeight: "bold" },
  projectItem: { paddingVertical: 5 },
  projectLink: {
    color: "blue",
    textDecorationLine: "underline",
    paddingVertical: 5,
  },
});
