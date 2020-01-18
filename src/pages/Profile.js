import  React  from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview'
function Profile({ navigation }) {
    const githubUsername = navigation.getParam('github_username');
    const githubUrl = `https://github.com/${githubUsername}`;
    return <WebView style={{flex: 1 }} source={{ uri: githubUrl}} />
}

export default Profile;