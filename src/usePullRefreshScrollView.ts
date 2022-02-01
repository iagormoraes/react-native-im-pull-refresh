import { useEffect, useMemo } from 'react';
import {
  runOnJS,
  useAnimatedRef,
  useSharedValue,
  useAnimatedScrollHandler,
  withTiming,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';

interface BasicScrollProps {
  onScroll?: (args: any) => void;
}

interface Props extends BasicScrollProps {
  refreshing: boolean;
  callback(): void;
  power: number;
  bounceOnPull: boolean;
  loaderHeight: number;
}

function usePullRefreshScrollView({
  refreshing,
  callback,
  power,
  bounceOnPull,
  loaderHeight,
  ...viewProps
}: Props) {
  const ref = useAnimatedRef<any>();
  const scrollY = useSharedValue(0);
  const scrollHeight = useSharedValue(0);
  const startY = useSharedValue(0);
  const dragging = useSharedValue(false);

  const onScrollProxy = useMemo(() => viewProps.onScroll, [viewProps.onScroll]);

  const panGesture = Gesture.Pan()
    .enabled(!refreshing)
    .simultaneousWithExternalGesture(ref)
    .onUpdate((e) => {
      const scroll = scrollY.value;
      let posY = e.translationY - startY.value;

      // is on top and is intention to pull
      if (scroll <= 0 && posY > 0) {
        if (!dragging.value) {
          startY.value = e.translationY;
        }

        dragging.value = true;
      }

      // is not on top and is intention scroll
      if (scroll >= 0 && posY < 0) {
        if (dragging.value) {
          startY.value = e.translationY;
        }

        dragging.value = false;
      }

      posY = e.translationY - startY.value;

      if (dragging.value) {
        let newPosY = posY * power;

        // when bounceOnPull is disabled we limit the loaderHeight based on the prop
        if (!bounceOnPull && newPosY >= loaderHeight) {
          scrollHeight.value = loaderHeight;

          return;
        }

        // avoid going negative values since we want to go positive only
        scrollHeight.value = newPosY < 0 ? 0 : newPosY;
      } else {
        scrollHeight.value = withTiming(0);
      }
    })
    .onEnd(() => {
      if (scrollHeight.value >= loaderHeight * 0.75) {
        runOnJS(callback)();
      } else {
        scrollHeight.value = withTiming(0);
      }

      startY.value = 0;
      dragging.value = false;
    });

  const gestures = Gesture.Simultaneous(panGesture);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      'worklet';
      onScrollProxy && onScrollProxy(event);
      scrollY.value = event.contentOffset.y;
    },
  });

  // effect for controlled loading state
  useEffect(() => {
    if (refreshing) {
      scrollHeight.value = withTiming(loaderHeight);

      return;
    }

    scrollHeight.value = withTiming(0);
  }, [refreshing, loaderHeight, scrollHeight]);

  return { ref, gestures, scrollHandler, scrollHeight, dragging };
}

export default usePullRefreshScrollView;
