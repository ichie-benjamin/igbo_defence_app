import {
  View,
  StyleSheet,
  StatusBar,
} from "react-native"
import React from "react"

import { Dimensions } from "react-native"

const { width } = Dimensions.get("window")

import Carousel from "react-native-reanimated-carousel"

import { useSharedValue} from "react-native-reanimated"

import { images, theme} from "../constants"
import Pagination from "../components/elements/Pagination";
import RegularButton from "../components/Buttons/RegularButton";
import RegularText from "../components/Texts/RegularText";
import CustomImage from "../components/Image/CustomImage";
import {useSelector} from "react-redux";


const DATA_WALKTHROUGHS = [
  images.frame02,
  images.frame04,
  images.frame05,
]

const OnboardingNon = ({ navigation }) => {
  const sizeImg = 295 * (width / 375)
  const progress = useSharedValue(0)
  const main_config  = useSelector(state => state.config.data);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.COLORS.white,
      }}
    >
      <StatusBar backgroundColor={theme.COLORS.white}
                 barStyle="dark-content"/>
      <View style={styles.content}>
        <Carousel
          vertical={false}
          width={width}
          windowSize={width}
          height={sizeImg}
          data={DATA_WALKTHROUGHS}
          autoPlay
          autoPlayInterval={1500}
          style={{ width: width }}
          onProgressChange={(_, absoluteProgress) =>
            (progress.value = absoluteProgress)
          }
          renderItem={({ item }) => {
            return (
              <CustomImage
                source={item}
                style={{
                  width: sizeImg,
                  height: sizeImg,
                  alignSelf: "center",
                }}
              />
            )
          }}
        />
        <View style={styles.pagination}>
          {DATA_WALKTHROUGHS.map((item, i) => {
            return (
              <Pagination
                backgroundColor={theme.COLORS.primary}
                index={i}
                key={i}
                animValue={progress}
                length={DATA_WALKTHROUGHS.length}
              />
            )
          })}
        </View>
        <View style={styles.groupButton}>
          <RegularText customStyles={{
            textAlign : "center",
            marginBottom: 10,
            ...theme.FONTS.h2,
          }}>Welcome to</RegularText>

          <RegularText customStyles={{
            textAlign : "center",
            marginBottom: 10,
            ...theme.FONTS.h2,
          }}>
            { main_config?.app_name }
          </RegularText>

          <View style={{
            marginHorizontal: 44,
            marginVertical : 30,
            // marginTop: 14,
          }}>
            <RegularButton
                buttonContainerStyle={{
                  borderRadius: 50
                }}
                onPress={() => navigation.replace('PhoneGetStarted')}
                buttonText="Get Started" />

          </View>

        </View>
      </View>
    </View>
  )
}

export default OnboardingNon

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  content: {
    paddingTop: 40,
    flexGrow: 1,
    paddingBottom: 8,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },

  groupButton: {
    justifyContent: "flex-end",
    textAlign : "center",
    flex: 1,
  },
})
