import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ProjectDetailsScreen({ route }) {
  const { projectId, projectName } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Project: {projectName}</Text>
      <Text>ID: {projectId}</Text>

      <Button
        title="Go to Floors"
        onPress={() => navigation.navigate("FloorRooms", { projectId, projectName })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
});
