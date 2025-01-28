import * as React from 'react';
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {theme} from "../../constants";


const ProgressStep = (({activeStep, tabs}) => {
  const progress = useDerivedValue(() => {
    if (activeStep) {
      return withSpring(activeStep);
    } else {
      return withSpring(0);
    }
  });

  const styleAnimated = useAnimatedStyle(() => {
    const widthLine = interpolate(progress.value, tabs, [
      0,
      0,
      26,
      26 * 2,
      26 * 3,
      26 * 4,
    ]);
    return {
      width: withTiming(widthLine, {duration: 50, easing: Easing.circle}),
      backgroundColor: theme.COLORS.text_color,
      height: 1,
    };
  });

  return (
      <View style={styles.container}>

      <View style={[styles.content, {
        justifyContent : "center",
        flexDirection : "row"
      }]}>
        {tabs.map((item, i) => {
          return (
            <Animated.View
              style={[
                styles.activeIndicator,
                {
                  backgroundColor:
                    activeStep <= i
                      ? theme.COLORS.gray
                      : theme.COLORS.mainColor,
                },
              ]}
              key={i}
            />
          );
        })}
      </View>
      <View style={styles.divider}>
        <Animated.View style={styleAnimated} />
      </View>
    </View>
  );
});

export default ProgressStep;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    backgroundColor: 'red',
    width: 8,
    height: 8,
    borderRadius: 99,
    marginHorizontal: 9,
  },
  divider: {
    height: 1,
    zIndex: -100,
    marginHorizontal: 9,
    marginTop: -4.5,
  },
});
