This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm install
npm start

# OR using Yarn
yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```
 open android studio —> click open —> select android folder of the project —>java version - 17, node version - 20.19.4 or newer  —> click on run, emulator will open

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```
or

```sh 
pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```
open Xcode —> click open existing project —> select ios/ChatBot.xcworkspace —>click on run button


If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

## How Reanimated 3 was used

Reanimated 3 was used to handle high-performance animations on the UI thread.
useSharedValue stores animated values such as translation, scale, or progress.
useAnimatedStyle maps shared values to styles without triggering React re-renders.
Gesture callbacks run as worklets, ensuring animations stay smooth even when the JS thread is busy.
Animations such as snap-back, drag completion, or transitions use helpers like withSpring().
This approach keeps gesture-driven interactions fluid and responsive.

## Gesture handling approach

Gestures were implemented using react-native-gesture-handler’s declarative Gesture API:
Gestures like Gesture.Pan() and Gesture.LongPress() are defined declaratively.
GestureDetector wraps the component and attaches gesture logic.
Gesture updates directly modify Reanimated shared values (e.g. translateX.value =  withSpring(0)).
Where needed, gestures are composed using Gesture.Race().
This setup allows gestures to be processed on the native/UI thread with minimal JS involvement.

## State management choice — Zustand

Zustand was used for global state management due to its simplicity and performance.
State is accessed directly via hooks without providers or reducers.
Ideal for app-wide state such as user data, UI preferences, and shared flags.
Zustand was chosen for lightweight global state management due to its minimal boilerplate and efficient re-rendering. 
It was used for shared application state, while transient UI and gesture-related state was handled by Reanimated shared values to maintain optimal performance.
