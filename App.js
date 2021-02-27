import React from 'react';
import { StyleSheet, Text, View,StatusBar, 
   TouchableOpacity, SafeAreaView, ScrollView,FlatList, ActivityIndicator,ToastAndroid, BackHandler } from 'react-native';

import {AntDesign} from "@expo/vector-icons"
import { SearchBar,Tile,Button} from 'react-native-elements';
import * as Animatable from "react-native-animatable";
import WebView from 'react-native-webview';
import AnimatedHideView from 'react-native-animated-hide-view';
import{createAppContainer} from 'react-navigation'
import {createStackNavigator} from "react-navigation-stack";


class App extends React.Component {
  state = {
    search: '',
    recent:[
    ],
    
    ChildVisible:true,
    
  };
  


  _startAnimation = ()=>{
    
  }
  updateSearch = (value) => {
    this.setState({ search : value });
  };
  _searching=()=>{
    this.setState({
      search:'',
      recent: [{name:this.state.search}].concat(this.state.recent),
      
    });}

    _press =({item,index})=>{
      return(
      <View style={styles.lineContainer}>
        
        <Text style={{fontSize:20}}>{item.name}  </Text>
        
        <TouchableOpacity> 
        <AntDesign onPress={
          ()=>{
            const new_ = [...this.state.recent];
            new_.splice(index,1);
            this.setState({recent:new_});
          }
        } name="closecircleo" size={20}/> 
        </TouchableOpacity>
        </View> );
    }



 //웹뷰를 위해
  constructor(props) {
      super(props);
      this.WEBVIEW_REF = React.createRef();
  }

  // 이벤트 등록
  componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  // 이벤트 해제
  componentWillUnmount() {
      this.exitApp = false;
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  // 이벤트 동작
  handleBackButton = () => {
      // 2000(2초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
      if (this.exitApp == undefined || !this.exitApp) {
          ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
          this.exitApp = true;
          
          //this.WEBVIEW_REF.current.goBack();
          this.timeout = setTimeout(
              () => {
                  this.exitApp = false;
              },
              2000    // 2초
          );
      } else {
          clearTimeout(this.timeout);

          BackHandler.exitApp();  // 앱 종료
      }
      return true;
  }
  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack
    });
  }

  /*
  <View style={{flex:1,width:"100%",backgroundColor:"red",zIndex:-10}}>
          <WebView
            style={{flex:1,width:"100%"}}
            source={{uri:'http://m.inven.co.kr/fifaonline4/player/'}}
            ref={this.WEBVIEW_REF}
            onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          /> 
      </View>
    */
  render() {
    const { search } = this.state;
    const isChildVisible = this.state.ChildVisible;


    return (
      <SafeAreaView style={styles.container}>
      <StatusBar hidden={true}/>
      <View style={{width:"100%",height:"100%",backgroundColor:"white",zIndex:-10}}>
        <View style={{marginTop:"100%",marginLeft:"10%"}}>
          <Text>선수db검색을 위한 공간입니다.</Text>
          <Text>피파인벤을 링크해두었었는데, 관련정책을 더 확인한 후 수정할게요! </Text>
        </View>
      </View>
      <AnimatedHideView 
       visible={isChildVisible}
       style={{zIndex:10,position: 'absolute'}}>
          <View style={styles.container}>
            
            <Animatable.View style={styles.card} animation="slideInDown" iterationCount={1} direction="alternate"> 
              <Tile
                imageContainerStyle={{backgroundColor:"snow",marginTop:0,}}
                onPress={this._startAnimation}
                activeOpacity ={1}
                title="피파온라인4 전적검색"
                titleStyle={{color:"black"}}
                featured
                captionStyle={{color:"black"}}
                caption="Data based on NEXON DEVELOPERS"
              />
              <SearchBar
                placeholder="닉네임을 입력해 주세요"
                onChangeText={this.updateSearch}
                value={search}
                round={true}
                containerStyle={styles.search,{backgroundColor:"snow"}}
                inputContainerStyle={{backgroundColor:"black"}}
                onEndEditing={
                  this._searching,
                  () =>{
                  this.props.navigation.navigate('Prof',
                  {name:search})}
                }
              />
              <View style={{height:"100%",backgroundColor:"white",opacity:0.8}}>
              </View>
              
          </Animatable.View>

                
          </View>
        </AnimatedHideView>
        <View style={{width:"100%",flex:1,zIndex:10, position:'absolute',paddingRight:10,backgroundColor:"snow",alignItems:"flex-end"}}>
          <TouchableOpacity  > 
          <Text  onPress={
            ()=>{
              this.setState({ChildVisible:!this.state.ChildVisible});
            }
          }style={{color:"black",fontSize:18}}>검색창 on/off </Text> 
          </TouchableOpacity>
        </View>

      </SafeAreaView>

    );
  }
}

//디테일화면
class Details extends React.Component{
  
  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }
  
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    
    const { navigation } = this.props;
    const text = JSON.stringify(navigation.getParam('vsid', 'none'));
    this.setState({vsid:text.slice(1,text.length-1),detail_array:[]});
    //{JSON.stringify(navigation.getParam('받은거 이름', '기본값'))} 

    fetch("https://api.nexon.co.kr/fifaonline4/v1.0/matches/"+text.slice(1,text.length-1)
    ,{headers: {Authorization:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiNTUzOTA0ODEwIiwiYXV0aF9pZCI6IjIiLCJ0b2tlbl90eXBlIjoiQWNjZXNzVG9rZW4iLCJzZXJ2aWNlX2lkIjoiNDMwMDExNDgxIiwiWC1BcHAtUmF0ZS1MaW1pdCI6IjIwMDAwOjEwIiwibmJmIjoxNTcyNjkzOTU3LCJleHAiOjE2MzU3NjU5NTcsImlhdCI6MTU3MjY5Mzk1N30.Vgey-uDJYTTrROKq6_RSJlSjK0Q6DbZ2mIgyCxrTDKQ"},})
  .then(response => response.json())
  .then((json) => {
     this.setState({
      detail_array: {
      "닉":json.matchInfo[0].nickname,
      "닉2":json.matchInfo[1].nickname,
      "날짜":json.matchDate,
      "점유율":json.matchInfo[0].matchDetail.possession,
      "점유율2":json.matchInfo[1].matchDetail.possession,
      "슈팅개수":json.matchInfo[0].shoot.shootTotal,
      "유효슈팅":json.matchInfo[0].shoot.effectiveShootTotal,
      "슈팅개수2":json.matchInfo[1].shoot.shootTotal,
      "유효슈팅2":json.matchInfo[1].shoot.effectiveShootTotal,
      "골":json.matchInfo[0].shoot.goalTotal,
      "골2":json.matchInfo[1].shoot.goalTotal,

      "파울":json.matchInfo[0].matchDetail.foul,
      "파울2":json.matchInfo[1].matchDetail.foul,

      "드리블":json.matchInfo[0].matchDetail.dribble,
      "드리블2":json.matchInfo[1].matchDetail.dribble,

      "경고":json.matchInfo[0].matchDetail.yellowCards,
      "경고2":json.matchInfo[1].matchDetail.yellowCards,

      "퇴장":json.matchInfo[0].matchDetail.redCards,
      "퇴장2":json.matchInfo[1].matchDetail.redCards,
      
      "패스시도":json.matchInfo[0].pass.passTry,
      "패스시도2":json.matchInfo[1].pass.passTry,
      "패스성공":json.matchInfo[0].pass.passSuccess,
      "패스성공2":json.matchInfo[1].pass.passSuccess,

      "블락":json.matchInfo[0].defence.blockTry,
      "블락2":json.matchInfo[1].defence.blockTry,
      "블락성공":json.matchInfo[0].defence.blockSuccess,
      "블락성공2":json.matchInfo[1].defence.blockSuccess,
      
      "태클":json.matchInfo[0].defence.tackleTry,
      "태클2":json.matchInfo[1].defence.tackleTry,
      "태클성공":json.matchInfo[0].defence.tackleSuccess,
      "태클성공2":json.matchInfo[1].defence.tackleSuccess,
      
      "코너킥":json.matchInfo[0].matchDetail.cornerKick,
      "코너킥2":json.matchInfo[1].matchDetail.cornerKick,
    }
     });
     }).catch((error) =>{
      console.error(error);
    }).then(this.setState({isLoading:false}));
  
  }
  
  // 이벤트 해제
componentWillUnmount() {
    this.exitApp = false;
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
}

// 이벤트 동작
handleBackButton = () => {
  this.props.navigation.navigate('Prof');
  return true;
}

  render(){
    const det_array = this.state.detail_array;
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(
      
      <View style={{flex: 1}}>
          <Tile
                imageContainerStyle={{backgroundColor:"snow",marginTop:0,}}
                onPress={this._startAnimation}
                activeOpacity ={1}
                title={"매치 상세정보입니다."}
                titleStyle={{color:"black"}}
                featured
                captionStyle={{color:"black"}}
                caption={det_array['날짜']}
            />
          <ScrollView >
          <View style={{backgroundColor:"white"}}>
          <View style={{marginTop:19,alignContent:"center",alignItems:"center"}}>
            <Text style={{color:"gray"}}>경기결과</Text>
            <Text style={{fontSize:25}}> 
              <Text style={{color:det_array['골'] > det_array['골2'] ? "black" : "gray"}}>{det_array['닉']}
              </Text> vs <Text style={{color:det_array['골'] > det_array['골2'] ? "gray" : "black"}}>
              {det_array['닉2']}</Text> 
            </Text>  
          </View>
          <View style={{alignContent:"center",alignItems:"center"}}>
            <Text style={{fontSize:25}}> 
              <Text style={{color:det_array['골'] > det_array['골2'] ? "black" : "gray"}}>{det_array['골']}
              </Text> : <Text style={{color:det_array['골'] > det_array['골2'] ? "gray" : "black"}}>
              {det_array['골2']}</Text> 
            </Text>  
          </View>

            


            <View style={{marginTop:19,alignContent:"center",alignItems:"center"}}>
              <Text style={{color:"gray"}}>점유율</Text>
              <Text style={{fontSize:20,color:det_array['점유율'] > det_array['점유율2'] ? "black" : "gray"}}> <Text>{det_array['점유율']}%
              </Text> : <Text style={{fontSize:20,color:det_array['점유율'] > det_array['점유율2'] ? "gray" : "black"}}>
              {det_array['점유율2']}%</Text> </Text>
            </View>

            <View style={{marginTop:19,alignContent:"center",alignItems:"center"}}>
              <Text style={{color:"gray"}}>코너킥</Text>
              <Text style={{fontSize:20,color:det_array['코너킥'] > det_array['코너킥2'] ? "black" : "gray"}}> <Text>{det_array['코너킥']}회
              </Text> : <Text style={{fontSize:20,color:det_array['코너킥'] > det_array['코너킥2'] ? "gray" : "black"}}>
              {det_array['코너킥2']}회</Text> </Text>
            </View>
            
            <View style={{marginTop:19,alignContent:"center",alignItems:"center"}}>
              <Text style={{color:"gray"}}>슈팅개수</Text>
              <Text style={{fontSize:20,color:det_array['슈팅개수'] > det_array['슈팅개수2'] ? "black" : "gray"}}> <Text>{det_array['슈팅개수']}개
              </Text> : <Text style={{fontSize:20,color:det_array['슈팅개수'] > det_array['슈팅개수2'] ? "gray" : "black"}}>
              {det_array['슈팅개수2']}개</Text> </Text>
            </View>

            <View style={{marginTop:19,alignContent:"center",alignItems:"center"}}>
              <Text style={{color:"gray"}}>유효슈팅</Text>
              <Text style={{fontSize:20,color:det_array['유효슈팅'] > det_array['유효슈팅2'] ? "black" : "gray"}}> <Text>{det_array['유효슈팅']}개
              </Text> : <Text style={{fontSize:20,color:det_array['유효슈팅'] > det_array['유효슈팅2'] ? "gray" : "black"}}>
              {det_array['유효슈팅2']}개</Text> </Text>
            </View>
            

            
            <View style={{marginTop:19,alignContent:"center",alignItems:"center"}}>
              <Text style={{color:"gray"}}>파울</Text>
              <Text style={{fontSize:20,color:det_array['파울'] > det_array['파울2'] ? "black" : "gray"}}> <Text>{det_array['파울']}회
              </Text> : <Text style={{fontSize:20,color:det_array['파울'] > det_array['파울2'] ? "gray" : "black"}}>
              {det_array['파울2']}회</Text> </Text>
            </View>

            
            <View style={{marginTop:19,alignContent:"center",alignItems:"center"}}>
              <Text style={{color:"gray"}}>드리블</Text>
              <Text style={{fontSize:20,color:det_array['드리블'] > det_array['드리블2'] ? "black" : "gray"}}> <Text>{det_array['드리블']}회
              </Text> : <Text style={{fontSize:20,color:det_array['드리블'] > det_array['드리블2'] ? "gray" : "black"}}>
              {det_array['드리블2']}회</Text> </Text>
            </View>

            <View style={{marginTop:19,alignContent:"center",alignItems:"center"}}>
              <Text style={{color:"gray"}}>경고</Text>
              <Text style={{fontSize:20,color:det_array['경고'] > det_array['경고2'] ? "black" : "gray"}}> <Text>{det_array['경고']}
              </Text> : <Text style={{fontSize:20,color:det_array['경고'] > det_array['경고2'] ? "gray" : "black"}}>
              {det_array['경고2']}</Text> </Text>
            </View>

            <View style={{marginTop:19,alignContent:"center",alignItems:"center"}}>
              <Text style={{color:"gray"}}>퇴장</Text>
              <Text style={{fontSize:20,color:det_array['퇴장'] > det_array['퇴장2'] ? "black" : "gray"}}> <Text>{det_array['퇴장']}
              </Text> : <Text style={{fontSize:20,color:det_array['퇴장'] > det_array['퇴장2'] ? "gray" : "black"}}>
              {det_array['퇴장2']}</Text> </Text>
            </View>

            <View style={{marginTop:19,alignContent:"center",alignItems:"center"}}>
              <Text style={{color:"gray"}}>패스시도</Text>
              <Text style={{fontSize:20,color:det_array['패스시도'] > det_array['패스시도2'] ? "black" : "gray"}}> <Text>{det_array['패스시도']}회
              </Text> : <Text style={{fontSize:20,color:det_array['패스시도'] > det_array['패스시도2'] ? "gray" : "black"}}>
              {det_array['패스시도2']}회</Text> </Text>
            </View>

            <View style={{marginTop:19,alignContent:"center",alignItems:"center"}}>
              <Text style={{color:"gray"}}>패스성공</Text>
              <Text style={{fontSize:20,color:det_array['패스성공'] > det_array['패스성공2'] ? "black" : "gray"}}> <Text>{det_array['패스성공']}회
              </Text> : <Text style={{fontSize:20,color:det_array['패스성공'] > det_array['패스성공2'] ? "gray" : "black"}}>
              {det_array['패스성공2']}회</Text> </Text>
            </View>

            <View style={{marginTop:19,alignContent:"center",alignItems:"center"}}>
              <Text style={{color:"gray"}}>블락시도</Text>
              <Text style={{fontSize:20,color:det_array['블락'] > det_array['블락2'] ? "black" : "gray"}}> <Text>{det_array['블락']}회
              </Text> : <Text style={{fontSize:20,color:det_array['블락'] > det_array['블락2'] ? "gray" : "black"}}>
              {det_array['블락2']}회</Text> </Text>
            </View>

            <View style={{marginTop:19,alignContent:"center",alignItems:"center"}}>
              <Text style={{color:"gray"}}>블락성공</Text>
              <Text style={{fontSize:20,color:Number(det_array['블락성공']) > Number(det_array['블락성공2']) ? "black" : "gray"}}> <Text>{det_array['블락성공']}회
              </Text> : <Text style={{fontSize:20,color:det_array['블락성공'] > det_array['블락성공2'] ? "gray" : "black"}}>
              {det_array['블락성공2']}회</Text> </Text>
            </View>

            <View style={{marginTop:19,alignContent:"center",alignItems:"center"}}>
              <Text style={{color:"gray"}}>태클시도</Text>
              <Text style={{fontSize:20,color:det_array['태클'] > det_array['태클2'] ? "black" : "gray"}}> <Text>{det_array['태클']}회
              </Text> : <Text style={{fontSize:20,color:det_array['태클'] > det_array['태클2'] ? "gray" : "black"}}>
              {det_array['태클2']}회</Text> </Text>
            </View>

            <View style={{marginTop:19,alignContent:"center",alignItems:"center"}}>
              <Text style={{color:"gray"}}>태클성공</Text>
              <Text style={{fontSize:20,color:det_array['태클성공'] > det_array['태클성공2'] ? "black" : "gray"}}> <Text>{det_array['태클성공']}회
              </Text> : <Text style={{fontSize:20,color:det_array['태클성공'] > det_array['태클성공2'] ? "gray" : "black"}}>
              {det_array['태클성공2']}회</Text> </Text>
            </View>

          </View>
          </ScrollView>
      </View>

    );
  }
}

class Profile extends React.Component{
  
  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }
  // 이벤트 등록
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    
    const { navigation } = this.props;
    const text = JSON.stringify(navigation.getParam('name', '초밥가게부인'));
    //{JSON.stringify(navigation.getParam('받은거 이름', '기본값'))} 

    
    //유저 기본정보 조회
    fetch("https://api.nexon.co.kr/fifaonline4/v1.0/users?nickname="+text.slice(1,text.length-1)
    ,{headers: {Authorization:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiNTUzOTA0ODEwIiwiYXV0aF9pZCI6IjIiLCJ0b2tlbl90eXBlIjoiQWNjZXNzVG9rZW4iLCJzZXJ2aWNlX2lkIjoiNDMwMDExNDgxIiwiWC1BcHAtUmF0ZS1MaW1pdCI6IjIwMDAwOjEwIiwibmJmIjoxNTcyNjkzOTU3LCJleHAiOjE2MzU3NjU5NTcsImlhdCI6MTU3MjY5Mzk1N30.Vgey-uDJYTTrROKq6_RSJlSjK0Q6DbZ2mIgyCxrTDKQ"},})
    .then(response => response.json())
    .then((json) => {
       this.setState({
        nick: json.nickname,
        id: json.accessId,
        level: json.level,
        
        match_ids:[
          
        ],
        match_details:[
          
        ],
        match_deatils:[],
        //division 값 당 메타정보
        winlose : [0,0,0],
        goout : [0.0],
        divisions:{
          1100:"챌린지!!!",
          2000:"월드클래스 1!!",
          2100:"월드클래스 2!!",
          2200:"월드클래스 3!!",
          2300:"프로 1부!",
          2400:"프로 2부!",
          2500:"프로 3부!",
          2600:"세미프로 1부.",
          2700:"세미프로 2부.",
          2800:"세미프로 3부.",
          2900:"아마추어 1부..",
          3000:"아마추어 2부..",
          3100:"아마추어 3부...",
          800:"슈퍼챔피언스!!!!",
          900:"챔피언스!!!!",
          
        }
       });
       }
    
       
       )
       //유저 역대 최고등급 조회
       .then(()=>{
       if( this.state.id !=null){
        fetch("https://api.nexon.co.kr/fifaonline4/v1.0/users/"+this.state.id+"/maxdivision"
        ,{headers: {Authorization:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiNTUzOTA0ODEwIiwiYXV0aF9pZCI6IjIiLCJ0b2tlbl90eXBlIjoiQWNjZXNzVG9rZW4iLCJzZXJ2aWNlX2lkIjoiNDMwMDExNDgxIiwiWC1BcHAtUmF0ZS1MaW1pdCI6IjIwMDAwOjEwIiwibmJmIjoxNTcyNjkzOTU3LCJleHAiOjE2MzU3NjU5NTcsImlhdCI6MTU3MjY5Mzk1N30.Vgey-uDJYTTrROKq6_RSJlSjK0Q6DbZ2mIgyCxrTDKQ"},})
        .then(response => response.json())
        .then((json) => {
           this.setState({
            division_level: json[0].division
           });
           }).catch((error) =>{
            console.error(error);
            return error;
          });}
      })
      .then(()=>{
      this.setState({isLoading:false});})
       .catch((error) =>{
        console.error(error);
        return error;
        
      }
      
      
      );
      
      
      
       
}

// 이벤트 해제
componentWillUnmount() {
    this.exitApp = false;
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
}

// 이벤트 동작
handleBackButton = () => {
  this.props.navigation.navigate('Home');
  return true;
}
_press =({item,index})=>{
  this.setState({match_details:this.state.match_details.sort().reverse()})
  let first_color;
  let second_color;
  if (item[2]=="무"){
    first_color = "gray";
    second_color = "gray";
  }else{
    first_color = item[2]=="승"? "green":"red";
    second_color = item[2]=="승"? "red":"green";
  }
  return(
    <View style={{
      flex: 1,
      textAlign:"flex-start",
      alignContent:"flex-start",
      alignItems:"flex-start"
    }}>
    <TouchableOpacity onPress={
      () =>{
      this.props.navigation.navigate('Detail',
      {vsid:this.state.match_ids[index]})}
    }>
    <View style={{marginLeft:15,height:60,width:"90%",borderColor:"black",margin:10,padding:10}}>
       <Text><Text>{item[1]}</Text> <Text style={{color:first_color,fontSize:18}}>{item[2]}</Text> VS <Text>{item[3]}</Text> <Text style={{color:second_color,fontSize:18}}>{item[4]}</Text><Text >( {item[5]} : {item[6]} )</Text></Text>
       <Text style={{color:"gray",fontSize:12}}>{item[0]}</Text>
       
    </View>
    </TouchableOpacity>
   </View>
  );
}
_mainmatch=()=>{
  if(!this.state.isLoading){
    this.setState({isLoading:true});
   // 공식경기 매치정보 조회
   fetch("https://api.nexon.co.kr/fifaonline4/v1.0/users/"+this.state.id+"/matches?matchtype=50&limit=20"
   ,{headers: {Authorization:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiNTUzOTA0ODEwIiwiYXV0aF9pZCI6IjIiLCJ0b2tlbl90eXBlIjoiQWNjZXNzVG9rZW4iLCJzZXJ2aWNlX2lkIjoiNDMwMDExNDgxIiwiWC1BcHAtUmF0ZS1MaW1pdCI6IjIwMDAwOjEwIiwibmJmIjoxNTcyNjkzOTU3LCJleHAiOjE2MzU3NjU5NTcsImlhdCI6MTU3MjY5Mzk1N30.Vgey-uDJYTTrROKq6_RSJlSjK0Q6DbZ2mIgyCxrTDKQ"},})
   .then(response => response.json())
   .then((json) => {
      this.setState({
       match_ids: json,
      });
      }).catch((error) =>{
       console.error(error);
       return error;
     })
     .then(()=>{
     
    this.state.match_details = []
    
    for(var t =0; t< this.state.match_ids.length;t++){
      fetch("https://api.nexon.co.kr/fifaonline4/v1.0/matches/"+this.state.match_ids[t]
      ,{headers: {Authorization:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiNTUzOTA0ODEwIiwiYXV0aF9pZCI6IjIiLCJ0b2tlbl90eXBlIjoiQWNjZXNzVG9rZW4iLCJzZXJ2aWNlX2lkIjoiNDMwMDExNDgxIiwiWC1BcHAtUmF0ZS1MaW1pdCI6IjIwMDAwOjEwIiwibmJmIjoxNTcyNjkzOTU3LCJleHAiOjE2MzU3NjU5NTcsImlhdCI6MTU3MjY5Mzk1N30.Vgey-uDJYTTrROKq6_RSJlSjK0Q6DbZ2mIgyCxrTDKQ"},})
      .then(response => response.json())
      .then((json) => {
      this.setState({
        match_details : this.state.match_details.concat(
          [[
        json.matchDate,
        json.matchInfo[0].nickname,
        json.matchInfo[0].matchDetail.matchResult,
        json.matchInfo[1].nickname,
        json.matchInfo[1].matchDetail.matchResult,
        json.matchInfo[0].shoot.goalTotal,
        json.matchInfo[1].shoot.goalTotal,
        this.state.match_ids[t],
      ]]
        ),
       });
       
       }).catch((error) =>{
        console.error(error);
        return error;
      });
       
        
    
    
    
  }
  
  
  
  this.setState({isLoading:false});
  });
  
}
}
_submatch=()=>{
  if(!this.state.isLoading){
    this.setState({isLoading:true});
  // 감독경기 매치정보 조회
  fetch("https://api.nexon.co.kr/fifaonline4/v1.0/users/"+this.state.id+"/matches?matchtype=52&limit=20"
  ,{headers: {Authorization:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiNTUzOTA0ODEwIiwiYXV0aF9pZCI6IjIiLCJ0b2tlbl90eXBlIjoiQWNjZXNzVG9rZW4iLCJzZXJ2aWNlX2lkIjoiNDMwMDExNDgxIiwiWC1BcHAtUmF0ZS1MaW1pdCI6IjIwMDAwOjEwIiwibmJmIjoxNTcyNjkzOTU3LCJleHAiOjE2MzU3NjU5NTcsImlhdCI6MTU3MjY5Mzk1N30.Vgey-uDJYTTrROKq6_RSJlSjK0Q6DbZ2mIgyCxrTDKQ"},})
  .then(response => response.json())
  .then((json) => {
     this.setState({
      match_ids: json,
     });
     }).catch((error) =>{
      console.error(error);
      return error;
    }).then(()=>{
    
    this.state.match_details = []
   
   for(var t =0; t< this.state.match_ids.length;t++){
     fetch("https://api.nexon.co.kr/fifaonline4/v1.0/matches/"+this.state.match_ids[t]
     ,{headers: {Authorization:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiNTUzOTA0ODEwIiwiYXV0aF9pZCI6IjIiLCJ0b2tlbl90eXBlIjoiQWNjZXNzVG9rZW4iLCJzZXJ2aWNlX2lkIjoiNDMwMDExNDgxIiwiWC1BcHAtUmF0ZS1MaW1pdCI6IjIwMDAwOjEwIiwibmJmIjoxNTcyNjkzOTU3LCJleHAiOjE2MzU3NjU5NTcsImlhdCI6MTU3MjY5Mzk1N30.Vgey-uDJYTTrROKq6_RSJlSjK0Q6DbZ2mIgyCxrTDKQ"},})
     .then(response => response.json())
     .then((json) => {
     this.setState({
       match_details : this.state.match_details.concat(
         [[
       json.matchDate,
       json.matchInfo[0].nickname,
       json.matchInfo[0].matchDetail.matchResult,
       json.matchInfo[1].nickname,
       json.matchInfo[1].matchDetail.matchResult,
       json.matchInfo[0].shoot.goalTotal,
       json.matchInfo[1].shoot.goalTotal,
       this.state.match_ids[t],
     ]]
       ),
      });
      }).catch((error) =>{
       console.error(error);
       return error;
     });
      
       
 }
 this.setState({isLoading:false});
});
}
}
  render(){
    

    

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }
    return(
      <View style={{flex: 1, paddingTop:20,marginLeft:0}}>
        <View style={{marginTop:15,marginLeft:15}}>
          <Text style={{fontSize:15}}>  닉네임 : {this.state.nick}</Text>
          <Text style={{fontSize:15}}>  레벨 : {this.state.level}</Text>
          <Text style={{fontSize:15}}>  역대 최고등급 : {this.state.divisions[this.state.division_level]}</Text>
        </View>
        <View style={{marginTop:15,marginLeft:0}}>
          <Button
          buttonStyle={{borderColor:"black"}}
          titleStyle= {{color:"black"}}
            title="공식경기 기록 조회"
            type="outline"
            onPress={this._mainmatch}
          />
          <Button
          buttonStyle={{borderColor:"black"}}
          titleStyle= {{color:"black"}}
            title="감독모드 기록 조회"
            type="outline"
            onPress={this._submatch}
          />
        
        
        <Text style={{color:"gray"}}>   경기결과를 클릭해보세요</Text>
        </View>
        <ScrollView >
          <View style={styles.container,{marginTop:19}}>
            <FlatList 
              data = {this.state.match_details} 
              
              renderItem = {this._press}

              keyExtractor={(item,index)=>{return `${index}`}}
            />
          </View>
        </ScrollView>

      </View>
    );
    }
  }


const AppNavigator = createStackNavigator({
  Home: {
    screen: App,
    navigationOptions: {
      header: null,
    },
  },
  Prof: {
    screen:Profile,
    navigationOptions: {
      headerStyle:{
        backgroundColor:"snow",
      }
    }
  },
  Detail: {
    screen:Details,
    navigationOptions: {
      headerStyle:{
        backgroundColor:"snow",
      }
    }
  }
});
  
  

const styles = StyleSheet.create({
  container: {
  flex: 1,
  textAlign:"center",
  alignContent:"center",
  alignItems:"center",
  },
  search:{
    margin:0,
    backgroundColor:"black",
    borderBottomLeftRadius:15,
    borderBottomRightRadius:15,
  },
  lineContainer: {
    flexDirection:'row',
    justifyContent:'space-between', //가로 정렬하는데 compo사이를 균등하게 space로 구분
    alignItems:'center', //세로정렬
  },
});
export default createAppContainer(AppNavigator);
