/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  TextInput,
  StatusBar,
  Linking,
} from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';

const App = ()=> {
  const [url, setUrl] = useState('https://cocomio-languages.firebaseapp.com/dashboard')
  const [statusBarStyle, setStatusBarStyle] = useState('dark-content')


  const sleep = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }

  const openLink = async () => {
    try {
      if (await InAppBrowser.isAvailable()) {
        // A delay to change the StatusBar when the browser is opened
        const animated = true;
        const delay = animated && Platform.OS === 'ios' ? 400 : 0;
        setTimeout(() => StatusBar.setBarStyle('light-content'), delay);
        const result = await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#453AA4',
          preferredControlTintColor: 'white',
          readerMode: true,
          animated,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'flipHorizontal',
          modalEnabled: true,
          enableBarCollapsing: true,
          // Android Properties
          showTitle: true,
          toolbarColor: '#6200EE',
          secondaryToolbarColor: 'black',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right',
          },
          headers: {
            'my-custom-header': 'my custom header value',
          },
          hasBackButton: true,
          browserPackage: null,
          showInRecents: false
        });
        // A delay to show an alert when the browser is closed
        await sleep(800);
        Alert.alert('Response', JSON.stringify(result));
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      console.error(error);
      Alert.alert(error.message);
    } finally {
      // Restore the previous StatusBar of the App
      StatusBar.setBarStyle(statusBarStyle);
    }
  }

  const getDeepLink = (path = '') =>{
    const scheme = 'my-demo';
    const prefix =
      Platform.OS === 'android' ? `${scheme}://demo/` : `${scheme}://`;
    return prefix + path;
  }

  const tryDeepLinking = async () => {
    const loginUrl = 'https://proyecto26.github.io/react-native-inappbrowser/';
    const redirectUrl = getDeepLink();
    const url = `${loginUrl}?redirect_url=${encodeURIComponent(redirectUrl)}`;
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.openpAuth(url, redirectUrl, {
          // iOS Properties
          ephemeralWebSession: false,
          // Android Properties
          showTitle: false,
          enableUrlBarHiding: true,
          enableDefaultShare: false,
        });
        Alert.alert('Response', JSON.stringify(result));
      } else {
        Alert.alert('InAppBrowser is not supported :/');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Something’s wrong with the app :(');
    }
  }

    return (
      <View style={styles.container}>
        <StatusBar barStyle={statusBarStyle} />
        <Text style={styles.welcome}>
          {'Welcome InAppBrowser\nfor React Native!'}
        </Text>
        <Text style={styles.instructions}>Type the url</Text>
        <TextInput
          style={styles.urlInput}
          onChangeText={(text) => setUrl(text)}
          value={url}
        />
        <View style={styles.openButton}>
          <Button title="Open link" onPress={() => openLink()} />
        </View>
        <View style={styles.openButton}>
          <Button
            title="Try deep linking"
            onPress={() => tryDeepLinking()}
          />
        </View>
      </View>
    );
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 30,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  urlInput: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
  },
  openButton: {
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: Platform.OS === 'ios' ? 0 : 20,
  },
});

export default App;