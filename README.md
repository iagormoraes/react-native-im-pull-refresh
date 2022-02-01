# react-native-im-pull-refresh

A smooth pull to refresh component made with love.

![sample](https://user-images.githubusercontent.com/13892132/147877500-865d529e-58c2-437a-92c5-6deb1352797f.gif)


# Motivation

After some time implementing the pull to refresh component using v1 of gesture handler and v2 of reanimated,
I decided to recreate the component with the new features of gesture handler that make the experience more simple and bring a very cool experience to the end user.


## Installation

```sh
npm install react-native-im-pull-refresh
```

or

```sh
yarn add react-native-im-pull-refresh
```

Note: the package uses gesture handler V2 and reanimated V2, so to make it compatible, make sure your project are using those.

#### Support version

| version | react-native version |
|---------|----------------------|
| 0.1.0+  | 0.60.0+              |


## Example

Is simple to instance this component into your view.

```tsx
        <PullRefreshScrollView<ScrollViewProps>
          view={ScrollView}
          viewRef={ref}
          loadingChildren={({ animatedValue }) => (
            <SampleLoader animatedValue={animatedValue} />
          )}
          onPullRefresh={handleRefresh}
          refreshing={refreshing}
          loaderHeight={200}
          bounceOnPull={false}
          onScroll={() => {
            'worklet';
            console.log('scrolling...');
          }}>
          {/*... YOUR COMPONENTS HERE ...*/}
        </PullRefreshScrollView>
```

It accepts a custom loader component, also it is can be controlled by state or not.

NOTE: onScroll handler is invoked by JSI by Reanimated context (Native Side), so always use `"worklet"` on top of the function.

## Props

Below there is props to customize the look n' feel of your component and also the state view of it.

### `view` - `React.ComponentType<T>`
This prop tell to the component what to render and how, you pass to the `PullRefreshScrollView` the props of that view component.

For example:

```tsx
<PullRefreshScrollView<MyViewPropsType> />
```

Doing this all the props of `MyViewPropsType` is inherited to the component.

### `loadingChildren` - `React Element`

Receives a function that return a component, in parameter it includes the `animatedValue` that is the value of how much pan the gesture received.


### `loaderHeight` - `number`
Default: `50`

Prop that specifies the size of loading area that the loading content will show.

### `refreshing` - `boolean`

Prop that tells the component if it is loading or not, it changes the visual state.

### `onPullRefresh` - `Function`

Function that trigger once the pull gesture is made.

### `bounceOnPull` - `boolean`
Default: `true`

Prop that will constriant the pan on pull to the height of loader content when it is higher value.

## TODO

- [X] Make scroll component customizable by props

- [ ] Add option to get dynamically the height of loadingChildren content
- [X] Make animations customizable

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
