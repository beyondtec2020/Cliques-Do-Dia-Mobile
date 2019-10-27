import React, { Component } from 'react';
import {
  TouchableOpacity, TextInput, StyleSheet, Image, AsyncStorage
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { LoginButton, AccessToken,LoginManager } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin';
import axios from 'axios';
import {
  Container, Header, Button,
  View, Item, Text,
  Body, Icon, Form,
  Input, Label, Title,
} from 'native-base';

import { baseURL } from '../../../app.config';
import styles from './../../style/style';

const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

GoogleSignin.configure({
  scopes: ['email', 'profile'],
  offlineAccess:true,
  iosClientId:'952081920236-bo28tuhcnf4qr9s00tv0qmithclc5dop.apps.googleusercontent.com',
  webClientId:'952081920236-3v6tnd6jjk8v44bm9g08vd3odfdss42t.apps.googleusercontent.com'
});


class Login extends Component {
  state = {
    hidePassword: true,
    username: '',
    password: '',
    result: ''
  }

  async componentDidMount() {
    this.setState({ token:  await AsyncStorage.getItem('token') });


    if (this.state.token == null || this.state.token == '' || this.state.token == undefined) {
      LoginManager.logOut();
    }
    else {
      this.props.navigation.navigate("Dashboard");
    }
  }

  login = _ => {
    const { username, password } = this.state;

    if (username == '' || password == '') {
      alert('Please enter username password');
    }
    else {
      this.setState({ progressVisible: true });
      //  fetch(`http://168.187.116.75/kbiecapp/api/values/login?id=${encodedValue1}&pwd=${encodedValue2}`)

      axios.defaults.headers.post['Accept'] = 'application/json';

      axios.post(`${baseURL}/login`, {
        email: username,
        password: password,
      })
      .then((responseJson)=> {
        this.setState({
          result: responseJson,
          // loading: false,
        });

        if (this.state.result.status) {
          AsyncStorage.clear();

          AsyncStorage.setItem('token', responseJson.data.access_token);

          this.setState({ progressVisible: false });

          this.props.navigation.navigate('Dashboard');
        }
        else {
          this.setState({ progressVisible: false });
        }
      })
      .catch(error => {
        this.setState({ progressVisible: false });
      })
    }
  }

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // alert(JSON.stringify(userInfo))
      // alert(JSON.stringify(userInfo.user.email));
      // alert(userInfo.user.email+''+userInfo.user.id+''+userInfo.user.name);
      // alert(userInfo.user.id);
      // alert(userInfo.user.name);

      this.setState({ userInfo });

      fetch(`${baseURL}/login/google`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          google_id:userInfo.user.id,
          email:userInfo.user.email,
          first_name:userInfo.user.name,
          last_name:userInfo.user.name
        })
      })
      .then(response => response.json())
      .then((responseJson)=> {
        // alert(responseJson.status);
        // alert(JSON.stringify(responseJson));
      //  alert(responseJson.access_token);

      AsyncStorage.clear();
     AsyncStorage.setItem('token',responseJson.access_token);
     // alert("Login Successfully");
     this.props.navigation.navigate('Dashboard');
        // alert("Offer Created Successfully.")
        // this.props.navigation.navigate('offers');
      })
      .catch(error=>console.log(JSON.stringify(error))) //to catch the errors if any

      // this.props.navigation.navigate('Dashboard');
    } catch (error) {
      // alert(JSON.stringify(error))
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  initUser(token) {
    fetch('https://graph.facebook.com/v3.2/me?fields=email,name&access_token=' + token)
    .then((response) => response.json())
    .then((json) => {


      // Some user object has been set up somewhere, build that user here
      // alert(JSON.stringify(json))
      // alert(JSON.stringify(json));
      //  alert(JSON.stringify(json));
      //  alert(JSON.stringify(json.id));


       fetch(`${baseURL}/login/fb`,
       {
         method: 'POST',
         headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
          facebook_id:json.id,
           first_name:json.name,
           last_name:json.name
         })
       })
       .then(response => response.json())
       .then((responseJson)=> {
         // alert(responseJson.status);
          // alert(JSON.stringify(responseJson));
        // alert(responseJson.access_token);

       AsyncStorage.clear();
      AsyncStorage.setItem('token',responseJson.access_token);
      // alert("Login Successfully");
      this.props.navigation.navigate('Dashboard');
         // alert("Offer Created Successfully.")
         // this.props.navigation.navigate('offers');
       })
       .catch(error=>console.log(JSON.stringify(error))) //to catch the errors if any
    })
    .catch(() => {
      reject('ERROR GETTING DATA FROM FACEBOOK')
    })
  }

  render() {
    return (
      <Container>
        <ProgressDialog
          visible={this.state.progressVisible}
          title="Buscando dados"
          message="por favor, espere..."
        />

        <View style={[styles.ValignCenter]}>
          <Text style={[styles.fontSize25,styles.alignCenter,styles.colorGreen]}>Sign In</Text>
          <View  style={[styles.marginLR15,styles.marginT45]}>
            <Item >
              <Input style={[styles.fontSize16]} placeholder="Username"
                autoCapitalize="none"
                onSubmitEditing={() => this.passwordInput.focus()}
                autoCorrect={false}
                keyboardType='email-address'
                returnKeyType="next"
                value={this.state.username}
                onChangeText={(username) => this.setState({ username })}
              />
            </Item>
          </View>

          <View  style={[styles.marginLR15]}>
            <Item >
              <Input placeholder="Password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={true}
                value={this.state.password}
                onChangeText={(password) => this.setState({ password })}
              />
            </Item>
          </View>

          <View  style={[styles.marginLR15,styles.marginTB10]}>
            {/* <Button  style={[styles.alignRight]} transparent><Text uppercase={false} style={[styles.fontSize12,styles.colorDarkGrey]}>Forgot Password?</Text></Button> */}
          </View>

          <View  style={[styles.marginLR15,styles.marginTB15]}>
            <Button onPress={this.login} block style={styles.BackgroundGreen}>
              <Text uppercase={false}>Sign In</Text>
            </Button>
          </View>

          <LoginButton
            readPermissions = {['public_profile']}
            style = {{ height: 30, marginLeft:15, marginRight:15 }}
            onLoginFinished = {(error, result) => {
              if (error) {
                //alert(error)
              } else if (result.isCancelled) {
                // console.log("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    //alert(data.accessToken.toString())
                    this.initUser(data.accessToken.toString())
                  }
                )
              }
            }}
            onLogoutFinished={() => console.log("logout.")}
          />

          <GoogleSigninButton
            style={{ marginLeft:10, marginRight:10, height: 40 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this._signIn}
            disabled={this.state.isSigninInProgress}
          />

          <View style={[styles.marginLR15,styles.marginTB15]} >
            <Button transparent block onPress={() => this.props.navigation.navigate('Register')} style={[styles.greenBorder]}>
              <Text style={[styles.colorGreen]}  uppercase={false}>Sign Up</Text>
            </Button>
          </View>
        </View>
      </Container>
    );
  }
}

export default Login;
