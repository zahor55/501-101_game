import React, { Component } from 'react'
import {View, Alert, I18nManager, AsyncStorage} from 'react-native'
import { Card, Button } from 'react-native-elements'
import DialogInput from 'react-native-dialog-input';

const STORAGE_KEY = 'SAVED_PLAYERS';
// const styles = StyleSheet.create({
//   user: {
//     height: 150,
//     width: 100,
//     flexDirection: 'row',
//     justifyContent: 'space-around'
//   },
//   image: {
//     height: 50,
//     width: 50
//   },
//   name: {
//     fontSize: 25
//   }
// });

export default class Users extends Component {
    static numOfPlayer=0;
    static highScore=0;
  constructor(props) {
    super(props);
    I18nManager.forceRTL(true);
    this.reset = this.reset.bind(this);
    this.incNumber = this.incNumber.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.state = {
        playerAlive:true,
        value: 0,
        burn:0,
        last: 0,
        isDialogVisible: false,
        name: this.props.title
    }
  }

    async componentDidMount(){
      Users.numOfPlayer++;
      this.setState({value:this.props.score});
        let name=await AsyncStorage.getItem(STORAGE_KEY);
        if (name !== null) {
            const restoredArray = JSON.parse(name);
            let x=false;
            let p;
            for (p in restoredArray)
                if (p.name===this.state.name)
                    x=true;
            if(x!==true){           //the player dont exist
                let player={
                    name:this.state.name,
                    value:this.state.value
                };

                //restoredArray.push(player);
                //wait AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(restoredArray))

            }
        }



  }
  async reset(){
      this.setState({ value: 0 });
      Alert.alert(`הנקודות של ${this.props.title} אופסו`);
      let name=await AsyncStorage.getItem(STORAGE_KEY);
      const restoredArray = JSON.parse(name);
      let p;
      for (p in restoredArray){
          if(p.name===this.state.name){
              p.value=0;
              break
          }
      }
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(restoredArray)).then(()=>{
          console.log(restoredArray)
      })

  }
  incNumber(valueToUpload) {
    this.setState({ value: this.state.value + valueToUpload });
    if (this.state.value > 500) {
      Alert.alert('נגמר המשחק!!!!')
    }

  }
  showDialog(toggle) {
    if (toggle == false) {
      this.setState({ isDialogVisible: false })
    }
    else {
      this.setState({ isDialogVisible: true })
    }
  }
  render() {
      if(this.state.playerAlive){
          return (
              <View>
                  <DialogInput isDialogVisible={this.state.isDialogVisible}
                               cancelText={"בטל"}
                               submitText={"הוסף"}
                               title={"הוספת ניקוד"}
                               message={`כמה להוסיף ל${this.state.name}`}
                               hintInput={"הכנס ניקוד כאן"}
                               textInputProps={{ keyboardType: 'numeric' }}
                               submitInput={(inputText) => {
                                   try{
                                       let x=parseInt(inputText);
                                       this.setState({
                                           last:this.state.value,
                                           value: this.state.value + x
                                       });


                                   }
                                   catch (e) {
                                       Alert.alert('יש לכתוב רק מספרים')
                                   }


                                   this.showDialog(false)
                               }}
                               closeDialog={() => { this.showDialog(false) }}>
                  </DialogInput>
                  <Card
                      title={`   ${this.state.name}:${this.state.value}(${this.state.last})  כמות הפעמים שנשרף:${this.state.burn}`}>
                      <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginLeft: 0 }}>
                          <Button
                              backgroundColor='#03A9F4'
                              buttonStyle={{ width: '75%', borderRadius: 10, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                              title={"להוסיף ניקוד"}
                              onPress={() => {
                                  this.showDialog(true)
                              }} />

                          <Button
                              backgroundColor='#03A9F4'
                              title={"איפוס נקודות"}
                              buttonStyle={{ width: '75%', borderRadius: 10, marginLeft: 0, marginRight: 10, marginBottom: 0 }}
                              onPress={() => {
                                  Alert.alert(
                                      "מחיקת ניקוד לשחקן",
                                      "בטוח שאתה רוצה למחוק ניקוד ל" + this.props.title,
                                      [
                                          {
                                              text: "לא",
                                              onPress: () => console.log("Cancel Pressed"),
                                              style: "cancel"
                                          },
                                          { text: "תמחק לו את הניקוד", onPress: () => this.reset() }
                                      ])
                              }} />
                      </View>
                      <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginLeft: 0,marginTop:20}}>
                          <Button
                              backgroundColor='#03A9F4'
                              buttonStyle={{ width: '75%', borderRadius: 10, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                              title={"מחיקת שחקן"}
                              onPress={() => {
                                  Alert.alert(
                                      "מחיקת שחקן",
                                      "בטוח שאתה רוצה למחוק את " + this.props.title,
                                      [
                                          {
                                              text: "לא",
                                              onPress: () => console.log("Cancel Pressed"),
                                              style: "cancel"
                                          },
                                          { text: "מחוק אותו", onPress: () => {
                                                  this.setState({
                                                      playerAlive:false
                                                  })
                                              } }
                                      ])
                              }} />

                          <Button
                              backgroundColor='#03A9F4'
                              title={"    שריפת שחקן     "}
                              buttonStyle={{ width: '75%', borderRadius: 10, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                              onPress={() => {
                                  Alert.alert(
                                      "שריפת שחקן",
                                      "בטוח שאתה רוצה לשרוף את " + this.props.title,
                                      [
                                          {
                                              text: "לא",
                                              onPress: () => console.log("Cancel Pressed"),
                                              style: "cancel"
                                          },
                                          { text: "שרוף אותו", onPress: () => {
                                                  this.setState({
                                                      burn:this.state.burn+1,
                                                      last:this.state.value,
                                                      value:0
                                                  })
                                              } }
                                      ])
                              }} />
                      </View>

                  </Card>
              </View>)
      }
      else{
          Users.numOfPlayer--;
          return (<View/>)
      }
  }

}