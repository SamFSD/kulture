import React from 'react';
import {View, Text, FlatList} from 'react-native';
import {io} from 'socket.io-client';
import {useStoreState} from 'easy-peasy';
import {GiftedChat} from 'react-native-gifted-chat';
import SnackBar from 'react-native-snackbar';

import {configs} from '../../config/config';
import server from '../../service/server';

import MessageList from '../../components/MessageList/MessageList';

export default function Message(props) {
  const {navigation, route} = props;
  const { groupName } = route.params;
  const [users, setUsers] = React.useState([]);
  const [messages, setMessages] = React.useState([]);
  const [profile, setProfile] = React.useState({
    userId: 1,
    avatar: 'https://via.placeholder.com/300/09f.png/fff',
  });

  const token = useStoreState<any>((state) => state.token);

  const socketRef = React.useRef(null);

  const fetchProfile = async () => {
    try {
      const response = await server.getProfile();
      if (response.data.success) {
        const {profile, userId} = response.data.data;
        setProfile({userId, avatar: profile});
      } else {
        SnackBar.show({
          text: response.data.message,
          duration: SnackBar.LENGTH_SHORT,
        });
      }
    } catch (error) {
      console.log(error);
      SnackBar.show({
        text: 'Something went wrong, please try again',
        duration: SnackBar.LENGTH_SHORT,
      });
    }
  };

  React.useEffect(() => {
    fetchProfile();
  }, []);

  React.useEffect(() => {
    socketRef.current = io(configs['SERVER_URL'], {
      extraHeaders: {
        Authorization: token,
      },
      auth: {
        token: token,
      },
    });

    socketRef.current.emit('joinRoom', { room: groupName });

    socketRef.current.on('roomUsers', ({ room, users }) => {
      setUsers(users);
    });

    socketRef.current.on('message', (msg) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, msg),
      );
    });


    return () => {
      socketRef.current.close();
    };
  }, []);

  const onSend = React.useCallback((messages = []) => {
    socketRef.current.emit('chatMessage', messages);
  }, []);

  return (
    <>
      <View style={{ zIndex: 2 }}>
        <FlatList
          data={users}
          horizontal
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item}) => {
            return <MessageList item={item} />;
          }}
        />
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        key={Math.random().toString()}
        user={{
          _id: profile.userId,
          avatar: profile.avatar,
          createdAt: new Date(),
        }}
      />
    </>
  );
}
