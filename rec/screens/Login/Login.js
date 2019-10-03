import React, { Component } from 'react';
import { TouchableOpacity, TextInput,StyleSheet,Image,AsyncStorage } from 'react-native';
import styles from './../../style/style';
import { ProgressDialog } from 'react-native-simple-dialogs';
import ImagePicker from 'react-native-image-picker';
const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
 
import { LoginButton, AccessToken,LoginManager } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton ,statusCodes} from 'react-native-google-signin';
GoogleSignin.configure({scopes: ['email', 'profile'],offlineAccess:true,iosClientId:'952081920236-bo28tuhcnf4qr9s00tv0qmithclc5dop.apps.googleusercontent.com',webClientId:'952081920236-3v6tnd6jjk8v44bm9g08vd3odfdss42t.apps.googleusercontent.com'});
import {
  Container,
  Header,
  Button,
  View,
  Item,
  Text,
  Body,
  Icon,
  Form,
  Input,  
  Label,
  Title,
} from 'native-base';
class Login extends Component {
  constructor()
  {
    super();
    this.state = { hidePassword: true,
      username: '',
      password: '',
    result:''
    }
  }

  async componentDidMount(){

    this.setState({
      token:  await AsyncStorage.getItem("token"),
    });
  
     
        console.log("token in Login:",this.state.token);
        // console.log("idddddd:",email);
          
    if(this.state.token==null||this.state.token==''||this.state.token==undefined)
    {
      console.log(" Null");
      LoginManager.logOut();
    } 
    else{
      this.props.navigation.navigate("Dashboard");
    }
}
  login() {

   
    // ImagePicker.showImagePicker(options, (response) => {
    //   console.log('Response = ', response);
     
    //   if (response.didCancel) {
    //     console.log('User cancelled image picker');
    //   } else if (response.error) {
    //     console.log('ImagePicker Error: ', response.error);
    //   } else if (response.customButton) {
    //     console.log('User tapped custom button: ', response.customButton);
    //   } else {
    //     const source = { uri: response.uri };
     
    //     console.log('path------------',source);

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
     
       
    //   }
    // });

    if(this.state.username=="" || this.state.password=="")
    {
      alert("Please enter username password");
    }
    else{

     this.setState({
      progressVisible: true,
    });
    console.log("username:",this.state.username);
    console.log("password:",this.state.password);

   
//  fetch(`http://168.187.116.75/kbiecapp/api/values/login?id=${encodedValue1}&pwd=${encodedValue2}`)
fetch(`https://www.cliquesdodia.com.br/api/login`, {
                              method: 'POST',
                              headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                email: this.state.username,
                                password:this.state.password,
                             
                              }),
                            })
    .then(response => response.json())
    .then((responseJson)=> {
     console.log(responseJson);
     this.setState({
      result: responseJson,
      // loading: false,
     });
       
     
   

       if(this.state.result.status==true)
       {
        alert("Login Successfully");


        AsyncStorage.clear();

         console.log('token',this.state.result.access_token);
        AsyncStorage.setItem('token',this.state.result.access_token);
       
        this.setState({
          progressVisible: false,
        });

        this.props.navigation.navigate('Dashboard');
     
       }
       else{
        alert(this.state.result.message);
        this.setState({
          progressVisible: false,
        });
       }
         
    })

    .catch(error=>alert(error)) //to catch the errors if any
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



      fetch(`https://www.cliquesdodia.com.br/api/login/google`, 
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
     alert("Login Successfully");
     this.props.navigation.navigate('Dashboard');
        // alert("Offer Created Successfully.")
        // this.props.navigation.navigate('offers');
      })
      .catch(error=>alert(JSON.stringify(error))) //to catch the errors if any
    
     







      // this.props.navigation.navigate('Dashboard');
    } catch (error) {
      alert(JSON.stringify(error))
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


       fetch(`https://www.cliquesdodia.com.br/api/login/fb`, 
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
      alert("Login Successfully");
      this.props.navigation.navigate('Dashboard');
         // alert("Offer Created Successfully.")
         // this.props.navigation.navigate('offers');
       })
       .catch(error=>alert(JSON.stringify(error))) //to catch the errors if any
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
          title=" Fetching Data"
          message="Please wait..."
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
                   
                        <Button   onPress={this.login.bind(this)} block style={styles.BackgroundGreen}>
                    <Text  uppercase={false}>Sign In</Text>
                  </Button>
                  
              
                </View>



                  {/* ---------End------- Offers for You */}
                  <LoginButton
                  readPermissions={['public_profile']}
                  style={{  height: 30,marginLeft:15,marginRight:15 }}
                          onLoginFinished={
                            (error, result) => {
                              if (error) {
                                //alert(error)
                              } else if (result.isCancelled) {
                                console.log("login is cancelled.");
                              } else {
                                AccessToken.getCurrentAccessToken().then(
                                  (data) => {
                                    //alert(data.accessToken.toString())
                                    this.initUser(data.accessToken.toString())
                                  }
                                )
                              }
                            }
                          }
                          onLogoutFinished={() => console.log("logout.")}/>

                      <GoogleSigninButton
                        style={{ marginLeft:10,marginRight:10, height: 40 }}
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Dark}
                        onPress={this._signIn}
                        disabled={this.state.isSigninInProgress} />
     




                <View  style={[styles.marginLR15,styles.marginTB15]}>
                   
                   <Button transparent block  onPress={() => this.props.navigation.navigate('Register')} style={[styles.greenBorder]}>
               <Text  style={[styles.colorGreen]}  uppercase={false}>Sign Up</Text>
             </Button>
             
         
           </View>

         
                

                   </View>
              
        
       
      </Container>
      );
    }
  }
  export default Login;
