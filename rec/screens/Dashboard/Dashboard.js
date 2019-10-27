import React, { Component } from 'react';
import { TouchableOpacity,SafeAreaView,StatusBar,AsyncStorage, TextInput, StyleSheet,Platform,Image, ImageBackground } from 'react-native';
import styles, { colors } from '../../style/style';
import ProgressLoader from 'rn-progress-loader';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { Col, Row, Grid } from "react-native-easy-grid";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../../style/style';
import Tabs from './components/Tabs';
import {
  Container,
  Header,
  Button,
  View,
  Segment,
  Picker,
  Item,
  Text,
  Icon,
  Body,
  Form,
  List,
  ListItem,
  Card,
  Footer,
FooterTab,
  CardItem,
  cardBody,
  Input,
  Label,
  Left, Right,
  Title,
  Thumbnail,
  Content,
} from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import CarouselItem from './components/CarouselItem';
import axios from 'axios';
import { baseURL } from '../../../app.config';

// import Icon from '@expo/vector-icons/Ionicons';

const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 1;

class Dashboard extends Component {

  constructor(props)
  {
    super();
    this.state = {
      Categories:[],
      selectedTabId:2,
      CategoryName:[],
      Cities:[],
      Result:[],
      searchURL:'',
      searchText: '',
      loader: true,
      category_id:2,
      city_id:1,
      token:'',
Images:[],
      selectedIndex: 0,
      selectedTab: 0,
      selected: undefined,
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      ENTRIES1: [
              {
                  title: 'Beautiful and dramatic Antelope Canyon',
                  subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
                 illustration: 'https://d1m6qo1ndegqmm.cloudfront.net/uploadimages/sales_offer_mainpic_20090513124212sahibaan_banner.JPG'
              },
              {
                  title: 'Earlier this morning, NYC',
                  subtitle: 'Lorem ipsum dolor sit amet',
                 illustration: 'https://d1m6qo1ndegqmm.cloudfront.net/uploadimages/coupons/9159-Legacy-Restaurant_500x200.jpg'
              },
              {
                  title: 'White Pocket Sunset',
                  subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
                 illustration: 'https://i.ibb.co/ynq4Gb9/C6-Lh-Chqw-BJRe-KWIh-Wy-Q9.jpg'
              },
              {
                  title: 'Acrocorinth, Greece',
                  subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
                 illustration: 'https://i.ibb.co/7n8S6KB/Pvq7-BOht-T1c4-EPh4sp8-I.jpg'
              },

          ]
    }
    this.openDrawer = this.openDrawer.bind(this);
    this.TabSwitch = this.TabSwitch.bind(this);
    this.fetchData=this.fetchData.bind(this);
  }


  openDrawer() {
    this.props.navigation.toggleDrawer();
}

  fetchData() {
    const { city_id, selectedTabId, token } = this.state;

    this.setState({ progressVisible: true });

    const url = `${baseURL}/user/offers?category_id=${selectedTabId}&city_id=${city_id}`;

    axios.get(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(response => {
      this.setState({ Result: response.data.data });
    })
    .finally(response => {
      this.setState({ progressVisible: false });
    })

    this.carausalImages();
  }

  async componentDidMount() {
    let token = await AsyncStorage.getItem('token');

    this.setState({ token: token });

    // console.log("token in Dashboard:", token);
    // console.log("idddddd:",email);
    if (token == null || token == '' || token == undefined) {
      this.props.navigation.navigate('Login');
    }

    // console.log("will mount");
    axios.get(`${baseURL}/categories`)
    .then(response => {
      this.setState({ Categories: response.data.data });

      // console.log("Cate-----------:",this.state.Categories);

      response.data.data.map((x,i) => {
        this.state.CategoryName.push(x.name);
        // console.log("CatName:",this.state.CategoryName);  // value={x.id}  />
      })
    })
    .catch(error => console.log(error))

    // fetch(`${baseURL}/categories`)
    // .then(response => response.json())
    // .then((responseJson)=> {
    //   this.setState({
    //    Categories: responseJson.data,
    //   });
    //   console.log("Cate-----------:",this.state.Categories);
    //   this.state.Categories.map( (x,i) =>
    //   {
    //     this.state.CategoryName.push(x.name);

    //     console.log("CatName:",this.state.CategoryName);  // value={x.id}  />
    //   })

    // })
    // .catch(error=>console.log(error)) //to catch the errors if any

    axios.get(`${baseURL}/cities`)
    .then(response => {
      this.setState({ Cities: response.data.data.data });

      this.fetchData();
    })
    .catch(error => console.log(error))

    // this.setState({
    //   searchURL:"https://www.cliquesdodia.com.br/public_html/api/api/search?category_id="+2+"&city_id="+1
    //  });
  }


  carausalImages() {
    const { city_id, selectedTabId } = this.state;
    // this.state.Images = [];

    axios.get(`${baseURL}/featured-slider?category_id=${selectedTabId}&city_id=${city_id}`)
    .then(response => {
      response.json()
    })
    .then(responseJson => {
      // debugger;
      // console.log("Images-----------:",this.state.Images);

      responseJson.data.map((Item)=>{
        console.log("Images-----------:",Item);
        this.state.Images.push({
          title:'abc',
          subtitle:'Earlier this morning, NYC',
          id:Item.id,
          illustration:Item.image
        })
        this.setState({ Images: this.state.Images },
          () => { console.log("Images---araay--------:",this.state.Images) }
        );
      })
    })
    .catch(error => {
      // debugger;
      console.log(error)
    })
    .finally(response => {

    })
  }

  handleOTP = (text) => {
    this.setState({
      searchText: text
        }, () => {
          this.fetchData();
        });
  }

TabSwitch = (index: number) =>
{
  this.setState(prevState => ({ ...prevState, selectedTab: index }))
  console.log("selected tab:",index);
  // this.setState({ selectedTabId:2ndex+1 });
  var id=index+2;
  if(id!=6)
  {
    this.setState({
      selectedTabId:id
        }, () => {
          this.fetchData();
        });
  }
  else{
    this.setState({
      selectedTabId:1
        }, () => {
          this.fetchData();
        });
  }

  // this.state.selectedTableId = index+1;
  // console.log("selected tab id-------::",this.state.selectedTabId)0

}

_renderItem ({item, index}) {
  return <CarouselItem data={item} even={(index + 1) % 2 === 0} />;
}
_renderItemWithParallax ({item, index}, parallaxProps) {
  return (
      <CarouselItem
        data={item}
        entryBorderRadius
        parallax={true}
        parallaxProps={parallaxProps}
      />
  );
}


CityList = () =>{
  return( this.state.Cities.map( (x,i) => {
        return( <Picker.Item label={x.name} key={i} value={x.id}  />)} ));
}

mainExample (number, title) {
  const { slider1ActiveSlide } = this.state;

  return (
      <View style={styles.marginT15}>
          <Carousel
            ref={c => this._slider1Ref = c}
            data={this.state.Images}
            renderItem={this._renderItemWithParallax}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            hasParallaxImages={true}
            firstItem={SLIDER_1_FIRST_ITEM}
            inactiveSlideScale={0.94}
            inactiveSlideOpacity={0.7}
            // inactiveSlideShift={20}
            containerCustomStyle={styles.slider}
            contentContainerCustomStyle={styles.sliderContentContainer}
            loop={true}
            loopClonesPerSide={2}
            autoplay={true}
            autoplayDelay={500}
            autoplayInterval={3000}
            onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
          />

      </View>
  );
}


  render() {
    const example1 = this.mainExample(1, 'stack layout | Loop | Autoplay | Parallax | Scale | Opacity | Pagination with tappable dots');
// console.log("hello");
    const {selectedTab } = this.state
    if(IS_ANDROID){
      StatusBar.setBackgroundColor("rgba(0,0,0,0.2)")
      StatusBar.setBarStyle("light-content")
      StatusBar.setTranslucent(true)
    }


    // console.log(getStatusBarHeight());
    return (
      <Container>

         <ScrollView>
          <Header  rounded style={[styles.Header,]} >
            <Left  style={[styles.headerLeft]}>
              <Button onPress={this.openDrawer}  transparent>
              <Image style={{height:15,width:18}} source={require('./../../../assets/menu.png')} />
              </Button>
            </Left>
            <Body style={[styles.headerBody,]}>


            {
              (this.state.Cities)?
                <Picker
                  mode="dropdown"
                  // iosIcon={<Icon style={[styles.colorGreen]} name="arrow-down" />}
                  placeholder="City"
                  placeholderIconColor={'#fff'}
                  placeholderStyle={{ color: "#fff" }}
                  placeholderIconColor="#fff"
                  style={{height: 10, width:200,color:'#fff'}}
                  selectedValue={this.state.selected}
                  onValueChange={(value, itemIndex) =>
                    this.setState({
                      selected: value,
                      city_id:value
                        }, () => {
                          this.fetchData();
                        })
                  }>
                    { this.CityList() }
                    {/* CityList = () =>{
  return( this.state.Cities.map( (x,i) => {
        return( <Picker.Item label={x.name} key={i} value={x.id}  />)} ));
} */}


                </Picker>
        :null
        }
            </Body>
            <Right style={[styles.headerRight]}>
              <Button small transparent>
              <Image style={{height:15,width:15}} source={require('./../../../assets/cart.png')} />
              </Button>
            </Right>

          </Header>

          <ProgressDialog
          visible={this.state.progressVisible}
          title="Buscando dados"
          message="por favor, espere..."
        />

          <View style={[styles.SearchHeader]}>
                <Item  style={[styles.marginLR5,styles.marginTB5,styles.bgColorWhite,styles.paddingLR10,styles.height32]}>
                    {/* <Icon name="ios-search" /> */}
                    <Input style={[styles.fontSize12]}
                       value={this.state.searchText}
                       onChangeText={this.handleOTP}
                    placeholder="Pesquisar" />
                </Item>
          </View>



           <View style={styles.flexRow}>
             {/* <Text>Immmm</Text> */}
           <Tabs  selectedIndex={selectedTab} TabSwitch={this.TabSwitch}  values={this.state.CategoryName}/>



           </View>

                    {
                          (this.state.Images)?
                          <ScrollView

                          scrollEventThrottle={200}
                          directionalLockEnabled={true}
                          >
                            { example1 }

                          </ScrollView>:null
                    }

        {/* Deal of the day */}



        <ProgressLoader
                visible={this.state.visible}
                isModal={true} isHUD={true}
                hudColor={"#000000"}
                color={"#FFFFFF"} />



        {/* Offers for You */}


          <View>
          {
              (this.state.Result.length!=0)?
          <List style={[styles.marginT5,styles.marginLR5]}>
         {

         this.state.Result.map( (x,i) =>
         (
          // console.log("Tittle:",x.title);  // value={x.id}  />
            // console.log("images:",x.images),

          //  console.log("min_price:",x.min_price);
          //  console.log("short_desc:",x.short_desc);
          //  console.log("id:",x.id);
          //  console.log("Tittle:",x.title);

           <ListItem thumbnail onPress={()=> this.props.navigation.navigate('OfferDetail',{itemId:x.id})}>
           <Left style={[]}>
           <Image style={{height:65,width:80}} source={{uri:x.images}} />
           {/* <Image style={{height:65,width:80}} source={require('./../../../assets/images/2.jpg')} /> */}

           </Left>
           <Body>
             <Text style={[styles.fontSize14,styles.colorGrey,styles.fontWeight500]}>{x.title}</Text>
             <Text  style={[styles.fontSize13]} note numberOfLines={2}>{x.short_desc} </Text>
             <View style={[styles.flexRow]} note numberOfLines={1}>
                  {/* <Text style={[styles.fontSize13,styles.colorGrey]}>deR</Text> */}
                    <Text  style={[styles.colorGrey,styles.fontSize13,styles.LineThrough]} note numberOfLines={1}> deR$ {x.min_price}</Text>


                  {/* <Text style={[styles.fontSize13,styles.colorGrey,styles.LineThrough]}> poR</Text> */}
                    <Text  style={[styles.colorGreen,styles.fontSize14,styles.fontWeight500]} note numberOfLines={1}>  poR$ {x.max_price}</Text>

             </View>

           </Body>
           <Right>
                 <Button  transparent>
                    {
                      (this.state.AddRemove2)? <Image style={{height:35,width:35}} source={require('./../../../assets/Fruits/Fruits/pluse.png')} />
                       :<Image style={{height:25,width:25}} source={require('./../../../assets/like.png')} />
                    }

                     </Button>
           </Right>
   </ListItem>


          ))



  }





            {/* <ListItem thumbnail onPress={()=> this.props.navigation.navigate('Account')}>
                    <Left style={[]}>
                    <Image style={{height:65,width:80}} source={require('./../../../assets/images/2.jpg')} />

                    </Left>
                    <Body>
                      <Text style={[styles.fontSize14,styles.colorGrey,styles.fontWeight500]}>Restaurante Miyoshi</Text>
                      <Text  style={[styles.fontSize13]} note numberOfLines={2}>Buffet de Sushi Livre com pratos Queents e Hots </Text>
                      <View style={[styles.flexRow]} note numberOfLines={1}>
                      <Text style={[styles.fontSize13,styles.colorGrey,styles.marginR10]}>a partri de</Text>
                        <Text  style={[styles.colorGreen,styles.fontSize13]} note numberOfLines={1}>R$ 15</Text>

                      </View>

                    </Body>
                    <Right>
                          <Button  transparent>
                             {
                               (this.state.AddRemove2)? <Image style={{height:35,width:35}} source={require('./../../../assets/Fruits/Fruits/pluse.png')} />
                                :<Image style={{height:25,width:25}} source={require('./../../../assets/like.png')} />
                             }

                              </Button>
                    </Right>
            </ListItem>

            <ListItem thumbnail onPress={()=> this.props.navigation.navigate('Account')}>
                    <Left style={[]}>
                    <Image style={{height:65,width:80}} source={require('./../../../assets/images/3.png')} />

                    </Left>
                    <Body>
                      <Text style={[styles.fontSize14,styles.colorGrey,styles.fontWeight500]}>Restaurante Miyoshi</Text>
                      <Text  style={[styles.fontSize13]} note numberOfLines={2}>Buffet de Sushi Livre com pratos Queents e Hots </Text>
                      <View style={[styles.flexRow]} note numberOfLines={1}>
                      <Text style={[styles.fontSize13,styles.colorGrey,styles.marginR10]}>a partri de</Text>
                        <Text  style={[styles.colorGreen,styles.fontSize13]} note numberOfLines={1}>R$ 15</Text>

                      </View>

                    </Body>
                    <Right>
                          <Button  transparent>
                             {
                               (this.state.AddRemove2)? <Image style={{height:35,width:35}} source={require('./../../../assets/Fruits/Fruits/pluse.png')} />
                                :<Image style={{height:25,width:25}} source={require('./../../../assets/like1.png')} />
                             }

                              </Button>
                    </Right>
            </ListItem>


            <ListItem thumbnail onPress={()=> this.props.navigation.navigate('Account')}>
                    <Left style={[]}>
                    <Image style={{height:65,width:80}} source={require('./../../../assets/images/4.jpg')} />

                    </Left>
                    <Body>
                      <Text style={[styles.fontSize14,styles.colorGrey,styles.fontWeight500]}>Restaurante Miyoshi</Text>
                      <Text  style={[styles.fontSize13]} note numberOfLines={2}>Buffet de Sushi Livre com pratos Queents e Hots </Text>
                      <View style={[styles.flexRow]} note numberOfLines={1}>
                      <Text style={[styles.fontSize13,styles.colorGrey,styles.marginR10]}>a partri de</Text>
                        <Text  style={[styles.colorGreen,styles.fontSize13]} note numberOfLines={1}>R$ 15</Text>

                      </View>

                    </Body>
                    <Right>
                          <Button  transparent>
                             {
                               (this.state.AddRemove2)? <Image style={{height:35,width:35}} source={require('./../../../assets/Fruits/Fruits/pluse.png')} />
                                :<Image style={{height:25,width:25}} source={require('./../../../assets/like1.png')} />
                             }

                              </Button>
                    </Right>
            </ListItem> */}

             </List>:<View style={[styles.alignCenter,styles.ValignBottom,styles.marginT40]}>
                <Image style={[styles.ValignBottom,styles.HW80,styles.alignCenter]} source={require('./../../../assets/box.png')} />
                <Text style={[styles.fontWeight500,styles.alignCenter,styles.marginT20,styles.colorGreen,styles.fontSize18]}>Dados Não Econtrados </Text>
                </View>
          }
    </View>




        {/* ---------End------- Offers for You */}


       </ScrollView>

       <Footer style={[styles.bgColorWhite,styles.borderTop]}>
          <FooterTab style={[styles.bgColorWhite]}>
            <Button onPress={()=> this.props.navigation.navigate('Dashboard')}>
              <Image active style={[styles.icon20]} source={require('./../../../assets/home.png')} />
            </Button>
            <Button  onPress={()=> this.props.navigation.navigate('Coupons')}>
            <Image style={[styles.icon20]} source={require('./../../../assets/coupon.png')} />
            </Button>

            <Button  onPress={()=> this.props.navigation.navigate('offers')}>
            <Image style={[styles.icon20]} source={require('./../../../assets/offer.png')} />
            </Button>

            <Button onPress={()=> this.props.navigation.navigate('Account1')}>
            <Image style={[styles.icon20]} source={require('./../../../assets/user.png')} />
            </Button>
          </FooterTab>
          </Footer>
        </Container>

    );
  }
}
export default Dashboard;
