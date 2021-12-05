import React, { ReactElement } from 'react';
import type { ScrollViewProps } from 'react-native';
import { GestureDetector, ScrollView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import usePullRefreshScrollView from './usePullRefreshScrollView';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

interface Props extends ScrollViewProps {
  children: ReactElement | ReactElement[];
  loadingChildren({
    animatedValue,
  }: {
    animatedValue: Animated.SharedValue<number>;
  }): React.ReactElement;
  refreshing: boolean;
  onPullRefresh(): void;
  power?: number;
  loaderHeight?: number;
}

const PullRefreshScrollViewComponent: React.FunctionComponent<Props> = ({
  children,
  loadingChildren,
  refreshing,
  onPullRefresh,
  power = 0.5,
  loaderHeight = 50,
  ...props
}) => {
  const { ref, gestures, scrollHandler, scrollHeight, dragging } =
    usePullRefreshScrollView({
      refreshing,
      callback: onPullRefresh,
      power,
      height: loaderHeight,
    });

  const style = useAnimatedStyle(() => {
    return {
      position: 'relative',
      transform: [
        {
          translateY: withSpring(scrollHeight.value, {
            mass: 0.5,
          }),
        },
      ],
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: loaderHeight,
      justifyContent: 'center',
      alignItems: 'center',
    };
  });

  const animatedProps = useAnimatedProps(() => {
    return {
      scrollEnabled: !dragging.value,
    };
  });

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View>
        <Animated.View pointerEvents="none" style={contentStyle}>
          {loadingChildren({ animatedValue: scrollHeight })}
        </Animated.View>
        <Animated.View style={style}>
          <AnimatedScrollView
            {...props}
            ref={ref}
            simultaneousHandlers={scrollHandler}
            scrollEventThrottle={16}
            animatedProps={animatedProps}
          >
            {children}
          </AnimatedScrollView>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const PullRefreshScrollView = React.memo(PullRefreshScrollViewComponent);

export default PullRefreshScrollView;
