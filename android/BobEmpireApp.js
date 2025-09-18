import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform
} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const { width, height } = Dimensions.get('window');

const BobEmpireApp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [webViewKey, setWebViewKey] = useState(0);
  const [user, setUser] = useState(null);

  // API URL - change this to your deployed backend URL
  const API_URL = __DEV__ 
    ? 'http://10.0.2.2:3000'  // Android emulator localhost
    : 'https://your-deployed-backend.vercel.app'; // Production URL

  useEffect(() => {
    // Check network connectivity
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // Load user data from AsyncStorage
    loadUserData();

    return () => unsubscribe();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('bob_empire_user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = async (userData) => {
    try {
      await AsyncStorage.setItem('bob_empire_user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleWebViewMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      
      switch (message.type) {
        case 'USER_LOGIN':
          saveUserData(message.data);
          break;
        case 'USER_LOGOUT':
          AsyncStorage.removeItem('bob_empire_user');
          setUser(null);
          break;
        case 'SHOW_ALERT':
          Alert.alert(message.title || 'Alert', message.message);
          break;
        case 'VIBRATE':
          // Add vibration if needed
          break;
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error: ', nativeEvent);
    Alert.alert(
      'Connection Error',
      'Unable to connect to Bob Empire servers. Please check your internet connection.',
      [
        { text: 'Retry', onPress: () => setWebViewKey(prev => prev + 1) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleWebViewLoad = () => {
    setIsLoading(false);
  };

  const injectedJavaScript = `
    // Inject mobile-specific functionality
    window.isMobile = true;
    window.isAndroid = ${Platform.OS === 'android'};
    window.isIOS = ${Platform.OS === 'ios'};
    
    // Function to send messages to React Native
    window.sendToNative = function(type, data) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: type,
        data: data
      }));
    };
    
    // Override alert to use native alert
    window.originalAlert = window.alert;
    window.alert = function(message) {
      window.sendToNative('SHOW_ALERT', { message: message });
    };
    
    // Auto-login if user data exists
    ${user ? `
    window.addEventListener('load', function() {
      // Auto-login user
      if (window.autoLogin) {
        window.autoLogin(${JSON.stringify(user)});
      }
    });
    ` : ''}
    
    // Add mobile-specific styles
    const mobileStyles = document.createElement('style');
    mobileStyles.innerHTML = \`
      body {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
        overflow-x: hidden;
      }
      
      .mobile-hidden {
        display: none !important;
      }
      
      .mobile-optimized {
        padding: 10px !important;
        font-size: 16px !important;
      }
      
      button {
        min-height: 44px !important;
        padding: 12px 20px !important;
      }
    \`;
    document.head.appendChild(mobileStyles);
    
    true; // note: this is required, or you'll sometimes get silent failures
  `;

  if (!isConnected) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1e1e2e" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>🌐 No Internet Connection</Text>
          <Text style={styles.errorMessage}>
            Please check your internet connection and try again.
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => NetInfo.refresh()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1e2e" />
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading Bob Empire...</Text>
        </View>
      )}
      
      <WebView
        key={webViewKey}
        source={{ uri: API_URL }}
        style={styles.webview}
        onLoad={handleWebViewLoad}
        onError={handleWebViewError}
        onMessage={handleWebViewMessage}
        injectedJavaScript={injectedJavaScript}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        allowsBackForwardNavigationGestures={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="compatibility"
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        userAgent="BobEmpire-Mobile/2.0.0"
        pullToRefreshEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onShouldStartLoadWithRequest={(request) => {
          // Handle external links
          if (request.url.includes('mailto:') || 
              request.url.includes('tel:') || 
              request.url.includes('sms:')) {
            return false;
          }
          return true;
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2e',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1e1e2e',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    marginTop: 20,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    color: '#ff6b6b',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BobEmpireApp;