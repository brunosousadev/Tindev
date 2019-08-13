import React,{useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import io from 'socket.io-client';

import api from '../services/api';
import './Home.css';
import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import itsamatch   from '../assets/itsamatch.png';

export default function Main({match}){
    
    const [users, setUsers] = useState([]);
    const [name, setName] = useState([]);
    const [userAvatar, setUserAvatar] = useState([]);
    const [matchDev, setMatchDev] = useState(null);

    useEffect(()=>{        
    async function loadUsers(){
     const response = await api.get('/devs',{
        headers:{
            user: match.params.id,
        }
    })    
    setUsers(response.data.users);
    setName(response.data.name);
    setUserAvatar(response.data.avatar);
    }
    loadUsers();
    }, [match.params.id]);
    
    useEffect(()=>{
        const socket =  io('http://localhost:3333');
        setTimeout(() => {
            socket.emit('hello', {
                message: 'Hello Word'
            })
        }, 3000);


     },[match.params.id]);

    async function handleLike(id){
             await api.post(`/devs/${id}/likes`, null , {
         headers:{ user: match.params.id, }
    })
        setUsers(users.filter(user=> user._id !== id));
    }
     async function handleDislike(id){
        await api.post(`/devs/${id}/dislikes`, null , {
         headers:{ user: match.params.id, }
    })
        setUsers(users.filter(user=> user._id !== id));
    }



return (
    <div className ="main-container">    
       <Link to="/">
        <img src={logo} alt="Tindev"/>
    </Link>
    <div className="subMain-container">
        <img  src={userAvatar} alt="Hello"/>   
        <strong >{name}</strong>
    </div>
     
          {users.length> 0 ? (
            <ul>
    {users.map(user => (
                 <li key={user._id}>
                     <img src={user.avatar} alt={user.name}/>   
                        <footer>            
                        <strong>{user.name}</strong>
                        <p>{user.bio} </p>
                    </footer>
                <div className="buttons">
                        <button type="button" onClick={()=>handleDislike(user._id)}>
                            <img src={dislike} alt="dislike"/>   
                        </button>
                        <button type="button" onClick={()=>handleLike(user._id)}>
                            <img src={like} alt="like"/>   
                        </button>
                </div> 
            </li>
            ))}     
        
            </ul>        
            ) : (
            <div className="empty"> Acabou :( </div>
            )}      
            {matchDev && (

            <div className="match-container">
            <img src={itsamatch} alt="It's a match" />

            <img className="avatar" src={matchDev.avatar} alt=""/>
            <strong>{matchDev.name}</strong>
            <p>{matchDev.bio}</p>

            <button type="button" onClick={() => setMatchDev(null)}>FECHAR</button>
        </div>
            )}
</div>
)
}
