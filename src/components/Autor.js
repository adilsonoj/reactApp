import React, { Component } from 'react';
import api from '../services/api';
import InputCustomizado from './inputCustomizado';
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

    PubSub.publish("limpa-erros",{});

    try{
      const response = await api.post('autores',
      JSON.stringify({nome:this.state.nome,email:this.state.email,senha:this.state.senha}));
       console.log(response); 
    
       PubSub.publish('atualiza-lista-autores',response.data);        
         this.setState({nome:'',email:'',senha:''}); 
     
    }catch(error){
      console.log(error.response.data)
      new TratadorErros().publicaErros(error.response.data);
    }

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