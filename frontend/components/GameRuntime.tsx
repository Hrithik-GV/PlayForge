import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radii } from '@/constants/theme';

// ─── React Error Boundary Wrapper ───────────────────────────
interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackRenderer: (error: Error) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ReactErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('GameRuntime React Error caught:', error, errorInfo);
  }

  public resetBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallbackRenderer(this.state.error);
    }
    return this.props.children;
  }
}

// ─── GameRuntime Component ──────────────────────────────────
interface GameRuntimeProps {
  gameCode: string;
  title: string;
  onClose: () => void;
}

export function GameRuntime({ gameCode, title, onClose }: GameRuntimeProps) {
  const [webViewError, setWebViewError] = React.useState<string | null>(null);
  const [webViewKey, setWebViewKey] = React.useState(0);
  const webViewRef = React.useRef<WebView>(null);

  // Fullscreen configuration: Hide status bar on mount, restore on unmount
  React.useEffect(() => {
    StatusBar.setHidden(true, 'slide');
    return () => {
      StatusBar.setHidden(false, 'slide');
    };
  }, []);

  // Ensure gameCode is viewport-optimized for touch controls
  const getEnrichedCode = () => {
    // If the gameCode already seems to be a full HTML page, inject some styling helpers for mobile.
    // If it is just a snippet, wrap it.
    const hasHtmlTag = gameCode.toLowerCase().includes('<html');

    if (hasHtmlTag) {
      // Incase viewport meta is missing, inject it
      if (!gameCode.toLowerCase().includes('name="viewport"')) {
        return gameCode.replace(
          '<head>',
          `<head><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">`
        );
      }
      return gameCode;
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <style>
            * {
              box-sizing: border-box;
              user-select: none;
              -webkit-user-select: none;
              touch-action: manipulation;
            }
            body {
              margin: 0;
              padding: 0;
              background-color: #121212;
              color: #ffffff;
              font-family: system-ui, -apple-system, sans-serif;
              width: 100vw;
              height: 100vh;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
          </style>
        </head>
        <body>
          ${gameCode}
        </body>
      </html>
    `;
  };

  const handleReload = () => {
    setWebViewError(null);
    setWebViewKey((prev) => prev + 1);
  };

  const renderErrorState = (errorMessage: string) => (
    <View style={styles.errorContainer}>
      <View style={styles.errorCard}>
        <MaterialIcons name="error-outline" size={48} color="#ff4a4a" />
        <Text style={styles.errorTitle}>Game Runtime Error</Text>
        <Text style={styles.errorSubtitle}>{errorMessage}</Text>
        
        <View style={styles.errorActions}>
          <Pressable style={styles.reloadBtn} onPress={handleReload}>
            <MaterialIcons name="replay" size={20} color="#000" />
            <Text style={styles.reloadBtnText}>Retry Game</Text>
          </Pressable>

          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Exit Runtime</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <ReactErrorBoundary fallbackRenderer={(err) => renderErrorState(err.message)}>
      <View style={styles.container}>
        {/* Runtime Header */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={onClose}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.onSurface} />
            <Text style={styles.backBtnText}>Exit</Text>
          </Pressable>
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
          <Pressable style={styles.actionBtn} onPress={handleReload}>
            <MaterialIcons name="refresh" size={22} color={Colors.onSurface} />
          </Pressable>
        </View>

        {/* WebView Screen Area */}
        <View style={styles.webviewWrapper}>
          {webViewError ? (
            renderErrorState(webViewError)
          ) : (
            <WebView
              key={webViewKey}
              ref={webViewRef}
              originWhitelist={['*']}
              source={{ html: getEnrichedCode() }}
              style={styles.webview}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              scalesPageToFit={true}
              decelerationRate="normal"
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={Colors.neonOrange} />
                  <Text style={styles.loaderText}>Spinning up game engine...</Text>
                </View>
              )}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.error('WebView execution error: ', nativeEvent);
                setWebViewError(nativeEvent.description || 'Webview failed to load code resources');
              }}
              onHttpError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.error('WebView HTTP error: ', nativeEvent);
                setWebViewError(`HTTP Resource error status ${nativeEvent.statusCode}`);
              }}
              onRenderProcessGone={(syntheticEvent) => {
                console.error('WebView render process crashed!');
                setWebViewError('Game runtime memory limit exceeded (Crashed)');
              }}
            />
          )}
        </View>
      </View>
    </ReactErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(28, 27, 27, 0.95)',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 44 : 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 60,
  },
  backBtnText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: Colors.onSurface,
  },
  titleText: {
    flex: 1,
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: Colors.onSurface,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webviewWrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loaderText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorCard: {
    width: '90%',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radii.xl,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 74, 74, 0.2)',
  },
  errorTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    color: Colors.onSurface,
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorActions: {
    width: '100%',
    gap: 12,
  },
  reloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neonOrange,
    paddingVertical: 14,
    borderRadius: Radii.full,
    gap: 6,
  },
  reloadBtnText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 15,
    color: '#000',
  },
  closeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeBtnText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 15,
    color: Colors.onSurface,
  },
});
