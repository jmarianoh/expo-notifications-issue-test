## 🐛 Bug Report

### Summary of Issue <!-- (just a few sentences) -->

* Listeners are not triggered
  * `handleNotification` within `Notifications.setNotificationHandler` is never called
  * `Notifications.addNotificationReceivedListener` is not triggered
  * `Notifications.addNotificationsDroppedListener` is not triggered
  * `Notifications.addNotificationResponseReceivedListener` is not triggered

* If app is in foreground, push notifications do not arrive in my phone at all (otherwise they arrive normally)

* It is a standalone app (`.apk`), built with Turtle CLI in CI, running on a real device, using FCM.

### Environment - output of `expo diagnostics` & the platform(s) you're targeting

* Result of `expo diagnostics` directly from CI:

```
  Expo CLI 3.27.4 environment info:
    System:
      OS: Linux 5.4 Ubuntu 18.04.5 LTS (Bionic Beaver)
      Shell: 4.4.20 - /bin/bash
    Binaries:
      Node: 12.18.3 - /opt/hostedtoolcache/node/12.18.3/x64/bin/node
      Yarn: 1.22.5 - /usr/bin/yarn
      npm: 6.14.6 - /opt/hostedtoolcache/node/12.18.3/x64/bin/npm
    SDKs:
      Android SDK:
        API Levels: 17, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30
        Build Tools: 19.1.0, 20.0.0, 21.1.2, 22.0.1, 23.0.1, 23.0.2, 23.0.3, 24.0.0, 24.0.1, 24.0.2, 24.0.3, 25.0.0, 25.0.1, 25.0.2, 25.0.3, 26.0.0, 26.0.1, 26.0.2, 26.0.3, 27.0.0, 27.0.1, 27.0.2, 27.0.3, 28.0.0, 28.0.1, 28.0.2, 28.0.3, 29.0.0, 29.0.2, 29.0.3, 30.0.0, 30.0.1, 30.0.2
        Android NDK: 21.3.6528147
    npmPackages:
      expo: ~38.0.8 => 38.0.10 
      react: ~16.11.0 => 16.11.0 
      react-dom: ~16.11.0 => 16.11.0 
      react-native: https://github.com/expo/react-native/archive/sdk-38.0.2.tar.gz => 0.62.2 
      react-native-web: ~0.11.7 => 0.11.7 
    npmGlobalPackages:
      expo-cli: 3.27.4
    Expo Workflow: managed
```

* Platform I'm targeting: Android

### Reproducible Demo

I carefully created a minimal repository to show the issue:

https://github.com/papb/expo-notifications-issue-test

I think it is easy to understand, but I will be happy to answer any question about it.

### Steps to Reproduce

**1.** Create a free Firebase project in Google, no need to activate Analytics for it

**2.** Add an Android app to it, as follows:

![image](https://user-images.githubusercontent.com/20914054/92674281-5d07fa00-f2f3-11ea-96da-a8453b03c7c8.png)

**3.** Save the `google-services.json` file you will get in the above step

**4.** Fork my example repository: https://github.com/papb/expo-notifications-issue-test

**5.** You will have to add a *Secret* to your fork:
  * Go to the repository settings;
  * Click *Secrets*
  * Click *New Secret*

**6.** The name of the *Secret* must be `GOOGLE_SERVICES_JSON`

**7.** The value of the *Secret* you obtain as follows:
  * Execute `cat google-services.json | base64` to obtain a base64 representation of the json file.
  * The output from the command above will likely have multiple lines, you must delete all newlines manually and obtain a huge string without newlines
  * This huge single-line string will be the value of the *Secret*
  * To make sure you got the value correctly, check it by creating a `temp.txt` file with this huge string, and then run `cat temp.txt | base64 -d` - you should see in your console the contents of the original `google-services.json` file

**8.** Trigger the execution of the GitHub Action in your fork. The easiest way to do it is to make any edit to the readme file, this new commit you make will cause the GitHub Action to execute.

**9.** Once the action finishes (takes about 15 minutes), you will receive the `built.apk`:

![image](https://user-images.githubusercontent.com/20914054/92674089-fda9ea00-f2f2-11ea-9de1-277d72f592c8.png)

**10.** Install this APK in your android device

**11.** Open it and click the `Get FCM Token` button, you will get a token

**12.** Go to your Firebase Console to send a test notification: https://console.firebase.google.com/project/expo-notifications-issue-test/notification/compose

**13.** As a sanity check, leave the app running in background on you app for now.

**14.** Compose a new test message and click *Send test message*:

![image](https://user-images.githubusercontent.com/20914054/92620938-9c096180-f299-11ea-9ccb-e137e2d363f0.png)

**15.** It will ask you an FCM token, paste the token you obtained in step 11 above in your phone.
  * Note: the app has a *Copy to Clipboard* button for your convenience

**16.** Observe that after a few seconds you will see the notification in your android device, so far so good

**17.** Bring your app back into foreground in your device now

**18.** Send another test message as you did in step 14, observe that sadly *absolutely nothing will happen at all*

### Expected Behavior vs Actual Behavior

* First of all, the notification should at least appear in step 18 above
* Also, one of the listeners defined inside `useEffect` in `App.tsx` should run, like [this one](https://github.com/papb/expo-notifications-issue-test/blob/master/App.tsx#L41), but they don't, no matter what I do
* You can also try other interaction combinations, such as pressing the notification, dismissing the notification, nothing I do triggers any of the listeners

More precisely, the following lines of code should have been reached somehow:
  * https://github.com/papb/expo-notifications-issue-test/blob/master/App.tsx#L9
  * https://github.com/papb/expo-notifications-issue-test/blob/master/App.tsx#L41
  * https://github.com/papb/expo-notifications-issue-test/blob/master/App.tsx#L52
  * https://github.com/papb/expo-notifications-issue-test/blob/master/App.tsx#L63

### Highlights (that I have no idea if matter or not)

* Note that the generation of the APK is not done using expo services; everything is done [within the GitHub Action itself](https://github.com/papb/expo-notifications-issue-test/blob/master/.github/workflows/ci.yml). I have no idea if this matters.

* Note that I am using the Managed Workflow with Expo SDK 38 (this is clear from the example repository).

* I created that GitHub Action based on the following guides:
  * https://www.robincussol.com/build-standalone-expo-apk-ipa-with-turtle-cli
  * https://levelup.gitconnected.com/build-your-standalone-expo-app-locally-with-turtle-cli-87de3a487704

* Note that I am not using Expo Tokens. I [obtain the FCM token with `Notifications.getDevicePushTokenAsync()`](https://github.com/papb/expo-notifications-issue-test/blob/master/src/get-token.ts#L9) and send them directly from Google's Firebase Console, as shown in step 14.
