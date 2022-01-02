import React, { Ref, useRef } from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import Rive, { Alignment, Fit, RiveRef } from 'rive-react-native';

function SampleLoader({
  animatedValue,
  refreshing,
}: {
  animatedValue: Animated.SharedValue<number>;
  refreshing: boolean;
}) {
  const ref = useRef<RiveRef>();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: '100%',
      height: 200,
    };
  });

  useDerivedValue(() => {
    if (!ref.current?.setInputState) return;

    const progress = (animatedValue.value / 200) * 100;

    if (refreshing) {
      runOnJS(ref.current?.setInputState)('Reload', 'Pull Amount', 100);
    } else {
      runOnJS(ref.current?.setInputState)('Reload', 'Pull Amount', progress);
    }

    if (progress <= 0 && !refreshing) {
      runOnJS(ref.current?.reset)();
    }
  });

  return (
    <Animated.View style={animatedStyle}>
      <Rive
        ref={ref as Ref<any>}
        stateMachineName="Reload"
        resourceName="loading"
        fit={Fit.Cover}
        alignment={Alignment.Center}
        style={{ flex: 1 }}
      />
    </Animated.View>
  );
}

export default SampleLoader;
