import React, {
  FunctionComponent,
  MutableRefObject,
  useCallback,
  useMemo,
} from 'react';
import type { StyleProp } from 'react-native';

import {
  createNativeWrapper,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';

import usePullRefreshScrollView from './usePullRefreshScrollView';

type ViewComponentProps<T> = StyleProp<T> & object;

type ViewRef<T> = { viewRef?: MutableRefObject<T | undefined> };

type ComponentProps<T> = ViewComponentProps<T> &
  ViewRef<T> & {
    view: React.ComponentType<T>;
    refreshing: boolean;
    power?: number;
    bounceOnPull?: boolean;
    onPullRefresh(): void;
    loadingChildren({
      animatedValue,
    }: {
      animatedValue: Animated.SharedValue<number>;
    }): React.ReactElement;
    loaderHeight?: number;
  };

type ComponentWithChildrenProps<T> = ComponentProps<T> & {
  children: React.ReactElement | React.ReactElement[];
};

function PullRefreshScrollViewComponent<T extends object>(
  props: ComponentProps<T> | ComponentWithChildrenProps<T>
) {
  const {
    view,
    viewRef,
    loadingChildren,
    refreshing,
    onPullRefresh,
    power = 0.5,
    loaderHeight = 50,
    bounceOnPull = true,
  } = props;

  const ScrollableView = useMemo(() => {
    // As reanimated does not provide an export type to the createAnimatedComponent function,
    // we set to any to avoid any break type in between the versions
    const ComponentWithGesture = createNativeWrapper<T>(view, {
      disallowInterruption: true,
      shouldCancelWhenOutside: false,
    }) as FunctionComponent<any>;

    return Animated.createAnimatedComponent(ComponentWithGesture);
  }, [view]);

  const {
    ref: animatedRef,
    gestures,
    dragging,
    scrollHandler,
    scrollHeight,
  } = usePullRefreshScrollView({
    ...props,
    refreshing,
    callback: onPullRefresh,
    power,
    bounceOnPull,
    loaderHeight,
  });

  const setRef = useCallback(
    (viewComponentRef: any) => {
      (animatedRef.current as MutableRefObject<any>) = viewComponentRef;

      if (typeof viewRef === 'function') {
        (viewRef as Function)?.(viewComponentRef);
      }

      if (typeof viewRef === 'object') {
        viewRef.current = viewComponentRef;
      }
    },
    [animatedRef, viewRef]
  );

  const style = useAnimatedStyle(() => {
    return {
      position: 'relative',
      transform: [
        {
          translateY: scrollHeight.value,
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

  // This props it is required to disable scrolling gesture to avoid mix gesture with pan
  const animatedProps = useAnimatedProps(() => {
    return {
      scrollEnabled: !dragging.value,
    };
  });

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View>
        <Animated.View style={contentStyle}>
          {loadingChildren({ animatedValue: scrollHeight })}
        </Animated.View>
        <Animated.View style={style}>
          <ScrollableView
            {...props}
            ref={setRef}
            simultaneousHandlers={scrollHandler}
            animatedProps={animatedProps}
          />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const PullRefreshScrollView = PullRefreshScrollViewComponent;

export default PullRefreshScrollView;
