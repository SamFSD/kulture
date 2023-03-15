import React from 'react';
import {
  View,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Pressable,
} from 'react-native';
import SnackBar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {useStoreActions} from 'easy-peasy';

import server from '../../service/server';

import styles from './Profile.style';

import { isOdd } from '../../helper/isOdd';

type REQUEST_STATUS = 'LOADING' | 'FAILED' | 'SUCCESS';

// Components
import HeaderList from './Header';
import ProfileSettings from '../../components/Modals/ProfileSettings';
import Loading from '../../components/Loading/Loading';

type Props = {
  navigation: {
    navigate(param: string) : void
  }
}

export default function Profile(props: Props) {
  const {navigation} = props;
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<{username: string, email : string, profile: string}>();
  const [visible, setVisible] = React.useState(false);
  const [requestStatus, setRequestStatus] = React.useState<REQUEST_STATUS>('LOADING');
  const [posts, setPost] = React.useState([
    {assets: '1'},
    {assets: '2'},
    {assets: '3'},
    {assets: '4'},
    {assets: '5'},
  ]);
  const setIsLoggin = useStoreActions<any>((actions) => actions.setIsLoggin);

  const handleRefresh = () => {
    fetchProfile();
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await server.getProfile();

      // Unauthorized error
      if (response.status === 401) {
        setRequestStatus('FAILED');
        setIsLoggin(false);
      }
      
      if (response.data.success) {
        const {posts: postData} = response.data.data;
        const {username, profile, email} = response.data.data;
        const user = {username: username, email: email, profile: profile};
        if (!isOdd(postData) && postData.length > 0) {
          const tempPost = {
            postId: Math.random(),
            image: 'https://via.placeholder.com/300/09f.png/fff',
            title: 'Placeholder',
          };
          const data = [...postData, tempPost];
          setPost(data);
        } else {
          setPost(postData);
        }
        setData(user);
        setLoading(false);
        setRequestStatus('SUCCESS');

      } else {
        SnackBar.show({
          text: response.data.message,
          duration: SnackBar.LENGTH_SHORT,
        });
        setRequestStatus('FAILED');
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      SnackBar.show({
        text: 'Something went wrong, please try again',
        duration: SnackBar.LENGTH_SHORT,
      });
      setLoading(false);
      setRequestStatus('FAILED');
    }
  };

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const onClose = () => {
    setVisible(false);
    AsyncStorage.getItem('token')
      .then((results) => {
        if (results === null) {
          setIsLoggin(false);
        }
        console.log(results);
      })
      .catch((error) => console.log(error));
  };

  const onOpen = () => {
    setVisible(true);
  };

  const Item = ({image}: { image: string}) => {
    return (
      <TouchableOpacity>
        <Image source={{uri: image}} style={styles.image} />
      </TouchableOpacity>
    );
  };

  const renderFeed = ({item}: any) => {
    return <Item image={item.image} />;
  };

  const loadingItems = () => {
    return (
      <SkeletonPlaceholder>
        <View style={styles.image} />
      </SkeletonPlaceholder>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {requestStatus === 'FAILED' && (
        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ marginVertical: 10 }}>
            <Text style={[styles.buttonTextAdd, {color : '#000'}]}>Something went wrong please try agin later</Text>
          </View>
          <Pressable style={styles.button} onPress={handleRefresh}>
            <Text style={styles.buttonTextAdd}>
              Reload
            </Text>
          </Pressable>
        </View>
      )}
      {requestStatus === 'LOADING' && <Loading />}
      {requestStatus === 'SUCCESS' && (
        <View>
          <FlatList
            ListHeaderComponent={
              <HeaderList
                onOpen={onOpen}
                loading={loading}
                data={data}
                fetchProfile={fetchProfile}
                navigation={navigation}
              />
            }
            numColumns={2}
            columnWrapperStyle={styles.container}
            data={posts}
            renderItem={loading ? loadingItems : renderFeed}
            keyExtractor={(item, index) => 'key-' + index}
          />
        </View>
      )}
      <ProfileSettings
        visible={visible}
        onClose={onClose}
        navigation={navigation}
      />
    </SafeAreaView>
  );
}
