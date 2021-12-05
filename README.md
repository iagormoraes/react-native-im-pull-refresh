# react-native-im-pull-refresh

A smooth pull to refresh component made with love.

https://user-images.githubusercontent.com/13892132/144723951-c2c2267e-f08d-4dd7-92b1-6b3ee6df813c.mov

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
        <PullRefreshScrollView
          loadingChildren={({animatedValue}) => (
            <SampleLoader animatedValue={animatedValue} />
          )}
          onPullRefresh={() => setRefresh(true)}
          refreshing={refreshing}
          loaderHeight={200}>
          {/*... YOUR COMPONENTS HERE ...*/}
        </PullRefreshScrollView>
```

It accepts a custom loader component, also it is can be controlled by state or not.

## Props

Below there is props to customize the look n' feel of your component and also the state view of it.

### `loadingChildren` - `React Element`

Receives a function that return a component, in parameter it includes the `animatedValue` that is the value of how much pan the gesture received.


### `loaderHeight` - `number`
Default: `50`

Prop that specifies the size of loading area that the loading content will show.

### `refreshing` - `boolean`

Prop that tells the component if it is loading or not, it changes the visual state.

### `onPullRefresh` - `Function`

Function that trigger once the pull gesture is made.

## TODO

- [ ] Make scroll component customizable by props

- [ ] Add option to get dynamically the height of loadingChildren content
- [ ] Make animations customizable

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
