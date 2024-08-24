import React from 'react'
import { View } from 'react-native'
import CustomText from '../../components/CustomText'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LikesScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{
      paddingTop: insets.top,
    }}>
        <CustomText>Likes Screen</CustomText>
    </View>
  )
}

export default LikesScreen