import React, {useState, useRef, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image, FlatList, Animated, ImageBackground
} from 'react-native';


import {COLORS, walkthrough} from "../constants";

import {OnboardingItem} from "../components/WalkThroughTwo/OnboardingItem";

import {Paginator} from "../components/WalkThroughTwo/Paginator";


import { NextButton } from "../components/WalkThroughTwo/NextButton";
import {ThemeContext} from "../contexts/themeContext";


const  Onboarding = ({ navigation }) => {

  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollX = useRef(new Animated.Value(0)).current;


  const { theme } = useContext(ThemeContext)

  let activeColors = COLORS[theme.mode]


  const slidesRef = useRef(null)

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index)
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold : 50}).current;


  const scrollTo = async () => {
    if (currentIndex < walkthrough.length - 1) {
      slidesRef.current.scrollToIndex({index: currentIndex + 1})
    } else {

      try {
        navigation.replace("Tabs")
      } catch (err) {
        console.log('Error @setItem : ', err)
      }

    }
  }

  const styles = StyleSheet.create({
    container : {
      flex : 1,
      backgroundColor : activeColors.bg,
      justifyContent : 'center',
      alignItems : 'center',
    }
  })

  return (
      <>
        <View
            style={styles.container}
        >
          <View style={{ flex : 5}}>
            <FlatList data={ walkthrough }
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      pagingEnabled
                      bounces={false}
                      renderItem={({ item }) => <OnboardingItem navigation={navigation} item={item} /> }
                      keyExtractor={( item ) => item.id}
                      onScroll={Animated.event([{ nativeEvent : { contentOffset : { x : scrollX }}}],{
                        useNativeDriver : false
                      })}
                      scrollEventThrottle={32}
                      ref={slidesRef}
                      onViewableItemsChanged={viewableItemsChanged}
                      viewabilityConfig={viewConfig}
            />
          </View>

          <Paginator data={walkthrough} scrollX={scrollX} />
          <NextButton scrollTo={scrollTo} percentage={(currentIndex + 1) * (100 / walkthrough.length)} />
        </View>
      </>

  )
}

export default Onboarding



