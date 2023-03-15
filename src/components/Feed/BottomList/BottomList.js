import React from 'react';
import {FlatList, TouchableOpacity, Image, Dimensions} from 'react-native';

const { width } = Dimensions.get('window')

import styles from './BottomList.style';

export default function BottomList(props) {
    const { bottomRef, posts, IMAGE_SIZE, SPACING, setActiveIndex, activeIndex, topRef } = props;
  return (
    <FlatList
      ref={bottomRef}
      data={posts}
      keyExtractor={(_, index) => index.toString() + Math.random().toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{position: 'absolute', bottom: IMAGE_SIZE}}
      contentContainerStyle={{paddingHorizontal: SPACING}}
      renderItem={({item, index}) => {
        return (
          <TouchableOpacity
            onPress={() => {
              setActiveIndex(index);
              topRef?.current?.scrollToOffset({
                offset: index * width,
                animated: true,
              });
            }}
            activeOpacity={0.7}>
            <Image
              source={{uri: item.image}}
              style={[
                styles.bottomScroll,
                {width: IMAGE_SIZE, height: IMAGE_SIZE},
                {borderColor: activeIndex === index ? '#fff' : 'transparent'},
                {marginRight: SPACING},
              ]}
            />
          </TouchableOpacity>
        );
      }}
    />
  );
}
