import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, themeStyles } from "../styles/theme";
import { useTheme } from "../styles/ThemeContext";

const HubTabView = ({ children, initialTab = 'discover' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { theme } = useTheme();
  // Effect to set the initial tab based on the prop
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    tabContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: 'transparent',
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: 'center',
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: 16,
      color: colors.primary,
    },
    activeTabText: {
      color: colors.primary,
      fontWeight: 'bold',
    },
    contentContainer: {
      flex: 1,
    },
    tabContent: {
      flex: 1,
    },
    hidden: {
      display: 'none',
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'discover' && styles.activeTab]}
          onPress={() => setActiveTab('discover')}
        >
          <Text style={[styles.tabText, activeTab === 'discover' && styles.activeTabText]}>Discover</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'for-you' && styles.activeTab]}
          onPress={() => setActiveTab('for-you')}
        >
          <Text style={[styles.tabText, activeTab === 'for-you' && styles.activeTabText]}>Following</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        {React.Children.map(children, (child, index) => (
          <View style={[styles.tabContent, activeTab !== ['for-you', 'discover'][index] && styles.hidden]}>
            {child}
          </View>
        ))}
      </View>
    </View>
  );
};



export default HubTabView;
