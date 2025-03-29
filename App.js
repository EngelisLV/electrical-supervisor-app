import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

import LoginScreen from './screens/LoginScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import ProjectDetailsScreen from './screens/ProjectDetailsScreen';
import FloorRoomsScreen from './screens/FloorRoomsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Projects" component={ProjectsScreen} />
            <Stack.Screen name="ProjectDetails" component={ProjectDetailsScreen} />
            <Stack.Screen name="FloorRooms" component={FloorRoomsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
