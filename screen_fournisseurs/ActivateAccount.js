import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, SafeAreaView, StatusBar, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, CheckCircle } from 'lucide-react-native';

export default function ActivateAccount() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get email from previous screen if passed
  const { email } = route.params || {};
  
  const [tempPassword, setTempPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isActivating, setIsActivating] = React.useState(false);
  const [showTempPassword, setShowTempPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Password validation function
  const isValidPassword = (password) => {
    // At least 8 characters, contains uppercase, lowercase, and number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleActivateAccount = async () => {
    // Client-side validation
    if (!tempPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    if (!isValidPassword(newPassword)) {
      Alert.alert(
        'Invalid Password', 
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match.');
      return;
    }

    setIsActivating(true);

    try {
      const activationData = {
        email: email,
        temporaryPassword: tempPassword.trim(),
        newPassword: newPassword.trim(),
      };

      console.log('Sending activation data:', { ...activationData, temporaryPassword: 'hidden', newPassword: 'hidden' });

      // Replace with your actual backend credentials
      const username = 'your_username';
      const password = 'your_password';
      const basicAuth = 'Basic ' + btoa(username + ':' + password);

      const response = await fetch('http://192.168.1.107:8080/api/laundry/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': basicAuth,
          'Accept': 'application/json',
        },
        body: JSON.stringify(activationData),
      });

      console.log('Activation response status:', response.status);

      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          responseData = await response.json();
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
          const textResponse = await response.text();
          console.log('Raw response:', textResponse);
          responseData = { success: response.ok, message: textResponse || 'Unknown error occurred' };
        }
      } else {
        const textResponse = await response.text();
        console.log('Non-JSON response:', textResponse);
        responseData = { success: response.ok, message: textResponse || 'Unknown error occurred' };
      }

      if (response.ok && responseData.success) {
        Alert.alert(
          'Account Activated!', 
          'Your account has been successfully activated. You can now log in with your new password.',
          [
            {
              text: 'Login Now',
              onPress: () => navigation.navigate('FournisseurLoginScreen', { email }) // Pass email to login screen
            }
          ]
        );
      } else {
        Alert.alert('Activation Failed', responseData.message || 'Failed to activate account. Please check your temporary password and try again.');
      }
    } catch (error) {
      console.error('Activation error:', error);
      Alert.alert('Error', 'Network error occurred. Please check your connection and try again.');
    } finally {
      setIsActivating(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const goToLogin = () => {
    navigation.navigate('FournisseurLoginScreen', { email });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activate Your Account</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <CheckCircle size={64} color="#1e4ed4" />
          <Text style={styles.welcomeTitle}>Almost There!</Text>
          <Text style={styles.welcomeText}>
            We've sent a temporary password to your email address. Please check your email and enter the password below to activate your account.
          </Text>
          {email && (
            <View style={styles.emailContainer}>
              <Mail size={16} color="#1e4ed4" />
              <Text style={styles.emailText}>{email}</Text>
            </View>
          )}
        </View>

        {/* Temporary Password Field */}
        <View style={styles.inputContainer}>
          <View style={styles.inputHeader}>
            <Lock size={20} color="#1e4ed4" />
            <Text style={styles.inputLabel}>Temporary Password *</Text>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              value={tempPassword}
              onChangeText={setTempPassword}
              style={styles.passwordInput}
              placeholder="Enter temporary password from email"
              secureTextEntry={!showTempPassword}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              selectionColor="#1e4ed4"
              cursorColor="#1e4ed4"
              theme={{ colors: { background: 'transparent', primary: '#1e4ed4' } }}
              editable={!isActivating}
            />
            <TouchableOpacity
              onPress={() => setShowTempPassword(!showTempPassword)}
              style={styles.eyeButton}
            >
              {showTempPassword ? (
                <EyeOff size={20} color="#888" />
              ) : (
                <Eye size={20} color="#888" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* New Password Field */}
        <View style={styles.inputContainer}>
          <View style={styles.inputHeader}>
            <Lock size={20} color="#1e4ed4" />
            <Text style={styles.inputLabel}>New Password *</Text>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.passwordInput}
              placeholder="Create your new password"
              secureTextEntry={!showNewPassword}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              selectionColor="#1e4ed4"
              cursorColor="#1e4ed4"
              theme={{ colors: { background: 'transparent', primary: '#1e4ed4' } }}
              editable={!isActivating}
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
              style={styles.eyeButton}
            >
              {showNewPassword ? (
                <EyeOff size={20} color="#888" />
              ) : (
                <Eye size={20} color="#888" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.passwordHint}>
            Password must be at least 8 characters with uppercase, lowercase, and number
          </Text>
        </View>

        {/* Confirm Password Field */}
        <View style={styles.inputContainer}>
          <View style={styles.inputHeader}>
            <Lock size={20} color="#1e4ed4" />
            <Text style={styles.inputLabel}>Confirm New Password *</Text>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.passwordInput}
              placeholder="Confirm your new password"
              secureTextEntry={!showConfirmPassword}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              selectionColor="#1e4ed4"
              cursorColor="#1e4ed4"
              theme={{ colors: { background: 'transparent', primary: '#1e4ed4' } }}
              editable={!isActivating}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeButton}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color="#888" />
              ) : (
                <Eye size={20} color="#888" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Activate Button */}
        <Button
          mode="contained"
          style={[styles.activateButton, isActivating && styles.disabledButton]}
          labelStyle={styles.activateButtonLabel}
          onPress={handleActivateAccount}
          disabled={isActivating}
          loading={isActivating}
        >
          {isActivating ? 'Activating Account...' : 'Activate Account'}
        </Button>

        {/* Already have password link */}
        <TouchableOpacity onPress={goToLogin} style={styles.loginLink}>
          <Text style={styles.loginLinkText}>Already have your password? Login here</Text>
        </TouchableOpacity>

        <Text style={styles.requiredNote}>* Required fields</Text>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpTitle}>Didn't receive the email?</Text>
          <Text style={styles.helpText}>
            • Check your spam/junk folder{'\n'}
            • Make sure you entered the correct email address{'\n'}
            • Wait a few minutes and check again{'\n'}
            • Contact support if the issue persists
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
  },
  backButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e4ed4',
    marginTop: 15,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 15,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  emailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1e4ed4',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  eyeButton: {
    padding: 12,
  },
  passwordHint: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    marginLeft: 4,
  },
  activateButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#1e4ed4',
  },
  activateButtonLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#1e4ed4',
    textDecorationLine: 'underline',
  },
  requiredNote: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  helpContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
});