import React from 'react';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Rive, { Alignment, Fit } from 'rive-react-native';

function SampleLoader({
  animatedValue,
}: {
  animatedValue: Animated.SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animatedValue.value, [0, 200], [0, 1]);
    return {
      width: '100%',
      height: 200,
      opacity,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Rive
        resourceName="loading"
        fit={Fit.Cover}
        alignment={Alignment.Center}
        style={{ flex: 1 }}
      />
    </Animated.View>
  );
}

export default SampleLoader;
