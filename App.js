
import React from 'react';
import { StyleSheet, View, ScrollView, AsyncStorage, Alert, I18nManager } from 'react-native';
import Users from './Components/Users'
import {Button, Card, Header, Text,Overlay} from 'react-native-elements'
import DialogInput from 'react-native-dialog-input';

const STORAGE_KEY = 'SAVED_PLAYERS';
export default class App extends React.Component {

  constructor(props) {
    super(props);
    // this.getItem()
    I18nManager.forceRTL(true);
    this.setup = this.setup.bind(this);
    this.addPlayers = this.addPlayers.bind(this);
    this.state = {
        isDialogVisible: false,
        isStartMassageVisible:true,
        players: 0,
        arr: [],
        imgArr: ["animel", "football", "clown", "home", "tennis",]
    }
  }

    componentDidMount() {

        this.load()
    }
    load = async () => {
        try {
            const name = await AsyncStorage.getItem(STORAGE_KEY);
            if (name !== null) {
                const restoredArray = JSON.parse(name);
                let p;
                for (p in restoredArray){
                    let joined = this.state.arr.concat(this.addUser(p.name,p.value));
                    this.setState({ arr: joined })
                }
            }
        } catch (e) {
            console.log("PROBLEM WITH LOADING PLAYERS")
        }
    };
  addUser(inputText,score) {
    return (
      <Users title={inputText} score={score} view="animel" key={this.state.arr.length} imgNum={this.state.imgArr[this.state.arr.length <= 4 ? this.state.arr.length : 4]} />
    )
  }
  setup(name) {
    this.state.players++;
    this.state.arr.push(name)
  }
  addPlayers(x) {
    this.setState({
      isDialogVisible: x
    })
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <Header
          leftComponent={{
            icon: 'clear', color: '#fff', onPress: () => {
              Alert.alert("למחוק את כולם??", "האם אתה בטוח??",
                [
                  {
                    text: "מה פתאום",
                    onPress: () => { console.log("Cancel Pressed") },
                    style: "cancel"
                  },
                  {
                    text: "בטוח", onPress: () => {
                      this.setState({
                          arr: [],
                          players: 0,
                          isStartMassageVisible:true
                      })
                    }
                  }
                ])
            }
          }}
          centerComponent={{ text: '501 זוגות', style: { color: '#fff' } }}
          rightComponent={{ icon: 'add', color: '#fff', onPress: () => this.addPlayers(true) }}
        />
        <Overlay isVisible={this.state.isStartMassageVisible}>
              <View>
                  <Text h4 style={{marginBottom: 10,textAlign:"center"}}>
                      משחק 501
                  </Text>
                  <Text h5>
                      להתחלת משחק חדש והוספת שחקן ראשון יש ללחוץ על הכפתור התחתון
                      {"\n"}
                  </Text>

                  <Button
                      onPress = {()=>{
                      this.addPlayers(true);

                  }}
                      buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                      title='הוספת שחקן חדש למשחק' />
              </View>
          </Overlay>
          {/*{this.state.isStartMassageVisible && <Card*/}
          {/*    title='אין שחקנים קיימים'*/}
          {/*    >*/}
          {/*    */}
          {/*</Card>}*/}

        <DialogInput isDialogVisible={this.state.isDialogVisible}
          cancelText={"בטל"}
          submitText={"הוסף"}
          title={"הוספת שחקן"}
          message={`מי השחקן שתרצה להוסיף`}
          hintInput={"הכנס שם כאן"}
          textInputProps={{ keyboardType: 'default' }}
          submitInput={(inputText) => {
              let joined = this.state.arr.concat(this.addUser(inputText,0));
              this.setState({ arr: joined ,isStartMassageVisible:false});
              console.log(this.state.arr);
              this.addPlayers(false)

          }}
          closeDialog={() => { this.addPlayers(false) }}>
        </DialogInput>
        {this.state.arr}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f2b59',


  },
  section: {
    flex: 2,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionLarge: {
    flex: 2,
    justifyContent: 'space-around',
  }
});
