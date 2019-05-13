import React, { Component } from 'react';
import api from '../services/api';
import InputCustomizado from './inputCustomizado';
import $ from 'jquery';
import PubSub from 'pubsub-js';

import TratadorErros from  '../Models/TratadorErros';


class FormularioAutor extends Component {

  state = {
    nome:'',
    senha:'',
    email:''
  }

  setNome = (e)=> {
    this.setState({nome: e.target.value})
  }
  setEmail = (e)=> {
    this.setState({email: e.target.value})
  }

  setSenha = (e)=> {
    this.setState({senha: e.target.value})
  }

 

  enviaForm =  async (e)=>{
    e.preventDefault();
   
  /*   let data = {
      nome: this.state.nome,
      email: this.state.email,
      id:2
    };
    this.setState(state => ({ 
      lista: state.lista.concat(data),
      nome: '',
      email: '',
      senha: ''
    })); */

    /*  const response = await api.post('autores',
     JSON.stringify({nome:this.state.nome,email:this.state.email,senha:this.state.senha}))
    console.log(response);  */

    $.ajax({
      url:'http://localhost:8080/api/autores',
      contentType:'application/json',
      dataType:'json',
      type:'post',
      data: JSON.stringify({nome:this.state.nome,email:this.state.email,senha:this.state.senha}),
      success: novaListagem => {
        PubSub.publish('atualiza-lista-autores',novaListagem);        
        this.setState({nome:'',email:'',senha:''});       
      },
      error: erro => {
        console.log(erro.responseJSON.status);
        if(erro.status === 400) {
          new TratadorErros().publicaErros(erro.responseJSON);
        }
      }  ,
      beforeSend: function(){
        PubSub.publish("limpa-erros",{});
      }     
    });

  }

  render() {
    return (
              <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                  <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} label="Nome"/>                                              
                  <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} label="Email"/>                                              
                  <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} label="Senha"/>       
                  <div className="pure-control-group">                                  
                    <label></label> 
                    <button type="submit" className="pure-button pure-button-primary" >Gravar</button>                                    
                  </div>
                </form>             

              </div>  
                      

    );
  }
}

class TabelaAutores extends Component {
    render(){
        return(
            <div>            
            <table className="pure-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>email</th>
                </tr>
              </thead>
              <tbody>
                {this.props.lista.map(autor => (
                  <tr key={autor.id}>
                    <td>{autor.nome}</td>
                    <td>{autor.email}</td>
                  </tr>
                ))}
                
              </tbody>
            </table> 
          </div>    
        );
    }
}

export default class AutorBox extends Component {
    state = { lista: [] }

    async componentDidMount(){
        const response = await api.get('autores');
        console.log(response);
        //retorna os 10 ultimos elementos do response
        this.setState({lista: response.data});
      // this.setState({lista: [{nome: "adilson", email: "adilsonoj@yahoo.com.b", id:"1"}]})
      PubSub.subscribe('atualiza-lista-autores', (topico,novaLista) => {
        this.setState({lista:novaLista});
      });
    }

      render(){
        return (
          <div>
            <FormularioAutor/>
            <TabelaAutores lista={this.state.lista}/>
    
          </div>
        );
      }
}