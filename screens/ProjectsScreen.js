import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TextInput, StyleSheet } from "react-native";
import { collection, addDoc, onSnapshot, query, where } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { db, auth } from "../firebase";

export default function ProjectsScreen() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const q = query(
      collection(db, "projects"),
      where("createdBy", "==", auth.currentUser.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(items);
    });
    return unsubscribe;
  }, []);

  const addProject = async () => {
    if (!projectName) return;
    await addDoc(collection(db, "projects"), {
      name: projectName,
      createdBy: auth.currentUser.uid,
    });
    setProjectName("");
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Projects</Text>
      <TextInput
        style={styles.input}
        placeholder="New project name"
        value={projectName}
        onChangeText={setProjectName}
      />
      <Button title="Add Project" onPress={addProject} />
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text
            style={styles.project}
            onPress={() =>
              navigation.navigate("ProjectDetails", {
                projectId: item.id,
                projectName: item.name,
              })
            }
          >
            - {item.name}
          </Text>
        )}
      />
      <Button title="Logout" onPress={logout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
  },
  project: { fontSize: 16, marginVertical: 5 },
});
