import * as React from 'react'
import { View, Text } from 'react-native'
import styles from './ListEmpty.styles';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ListEmpty(props: { username: string }) {
  const {username} = props;
  return (
    <View style={styles.container}>
        <View>
            <Ionicons name="md-list-circle-outline" size={45} color="#000" />
        </View>
        <View>
            <Text style={styles.listText}>{username} has not posted anything</Text>
        </View>
    </View>
  )
}