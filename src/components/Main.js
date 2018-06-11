import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  AsyncStorage,
} from 'react-native';

import Note from './Note'

class Main extends Component{

  constructor(props){
    super(props);
    this.state = {
      noteArray: [],
      noteText: '',
      controle: true,
    }
  }

  render() { 

    if(this.state.controle == true){
      {this.ComponentWillMount()}
    }

    let notes = this.state.noteArray.map((val, key) => {
      return <Note key={key} keyval={key} val={val}
              deleteMethod = {() => this.deleteNote(key)}/>
    });


    return (
      <View style={styles.container}>
        <View style = {styles.header}>
          <Text style = {styles.headerText}>Lista de Atividades</Text>
        </View>

        <ScrollView style = {styles.scrollContainer}>
          {notes}
        </ScrollView>

        <View style = {styles.footer}>
            <TextInput
             onChangeText = {(noteText) => this.setState({noteText})}
             value={this.state.noteText}
             style = {styles.textInput}
             placeholder = 'O que você tem que fazer ?'
             placeholderTextColor = 'white'
             underlineColorAndroid = 'transparent'>

            </TextInput>
        </View>

        <TouchableOpacity 
          style = {styles.addButton}
          onPress = {this.addNote.bind(this)}>
          <Text style = {styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
  addNote (noteArray, controle){
    if(this.state.noteText){
      var d = new Date();
      this.state.noteArray.push({
       'date':d.getDay() + 
        "/" + d.getMonth() + 
        "/" + d.getFullYear(),
        'note': this.state.noteText
      });
      this.setState({noteArray: this.state.noteArray})
      this.setState({noteText: ''})
      {this.salvar()}
      this.setState({controle: true})
    }
  }

  deleteNote(key, controle){
    this.state.noteArray.splice(key, 1);
    this.setState({noteArray: this.state.noteArray})
    {this.salvar()}
    this.setState({controle: true})
  }

  salvar = ((noteArray) => {
    try{
      let notas = this.state.noteArray
      AsyncStorage.setItem('nomes', JSON.stringify(notas))
    }catch(error){
      alert(error)
    }

  })

  carregar = async (noteArray) =>{
      try{
        var auxnotas = await AsyncStorage.getItem('nomes')
        auxnotas = JSON.parse(auxnotas)
        if(auxnotas.length > 0){
          this.setState({
            noteArray: auxnotas
          })  
        }
        
      }catch(error){
        alert(error)
      }
  }

  ComponentWillMount(){
    if(this.state.controle == true){
      this.carregar()   
    }
      this.setState({
        controle: false
      })
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#E91E63',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 10,
    borderBottomColor: '#ddd',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    padding: 26,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  textInput: {
    alignSelf: 'stretch',
    color: '#fff',
    padding: 20,
    backgroundColor: '#252525',
    borderTopWidth: 2,
    borderTopColor: '#ededed',
  },
  addButton: {
    position: 'absolute',
    zIndex: 11,
    right: 17,
    bottom: 70,
    backgroundColor: '#E91E63',
    width: 70,
    height: 70,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
  },
});

export default Main;
