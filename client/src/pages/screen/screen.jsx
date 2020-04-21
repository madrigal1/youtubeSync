/* eslint-disable max-len */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-alert */
/* eslint-disable no-console */
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import gsap from 'gsap';
import ReactPlayer from 'react-player';
import baseUrl from '../../baseUrl';
import './screen.css';

import Chat from '../../components/Chat/Chat';
import VotingPage from '../votingPage/votingPage';


let socket;


const Room = ({
  adminDisplay,
  setAdminDisplay,
  name,
  room,
  url,
  setUrl,
  ref,
  play,
  pause,
  setMessage,
  sendMessage,
  message,
  messages,
}) => (
  <>
    {/*  {adminDisplay && <AdminPanel setAdminDisplay={setAdminDisplay} room={room} setUrl={setUrl} />} */}
    <div className="screenWrapper">
      <div className="Movie">
        <ReactPlayer
          ref={ref}
          url={url || null}
          width="100%"
          height="100%"
          onPlay={play}
          onPause={pause}
        />
      </div>
      <div className="Chat">
        <Chat
          name={name}
          room={room}
          setMessage={setMessage}
          sendMessage={sendMessage}
          message={message}
          messages={messages}
        />
      </div>
    </div>
  </>
);


const Screen = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [url, setUrl] = useState(null);
  const [adminDisplay, setAdminDisplay] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [player, initPlayer] = useState(null);
  const [duration, setDuration] = useState(0);
  const [playing, handlePlay] = useState(false);
  const ENDPOINT = `${baseUrl}/`;


  useEffect(() => {
    const userObj = JSON.parse(sessionStorage.getItem('userYS'));
    const roomObj = JSON.parse(sessionStorage.getItem('room'));

    setName(userObj.name);
    setRoom(roomObj.name);
  }, []);

  useEffect(() => {
    socket = io(ENDPOINT);
    if (!name || !room) return;
    console.log(name, room);
    socket.emit('join', { name, room }, (err) => {
      if (err) {
        console.log(err);
        alert(err);
      }
    });
  }, [name, room, ENDPOINT]);

  useEffect(() => {
    socket.on('adminCheck', ({ isAdmin }) => {
      console.log('SET ADMIN ACTIVATE', isAdmin);
      setAdmin(isAdmin);
      setAdminDisplay(isAdmin);
    });
    socket.on('message', (message) => {
      console.log('SET MESSAGES ACTIVATE', message);
      setMessages([...messages, message]);
    });
    socket.on('roomData', ({ users }) => {
      setUsers({ users });
    });
    socket.on('playerHandler', ({ playing, duration }) => {
      console.log('DURATION ACTIVATE', playing, duration);
      if (!admin) {
        handlePlay(playing);
        setDuration(duration);
        player.seekTo(duration, 'seconds');
      } else {
        console.log('reached');
      }
    });
    socket.on('clientUrl', (url) => {
      console.log('Initial check');
      console.log('');
      if (!admin) {
        console.log('SET URL ACTIVATE');
        setUrl(url);
      }
    });
    return () => {
      socket.emit('disconnect');
      socket.off();
    };
  });

  useEffect(() => {
    console.log('SETURL', url, admin);
    if (admin) {
      socket.emit('setUrl', url, (err) => {
        if (err) {
          console.log(err);
          alert(err);
        }
      });
    }
  }, [url, admin]);

  useEffect(() => {
    socket.emit('handlePlayPause', { playing, duration }, (err) => {
      if (err) {
        console.log(err);
        alert(err);
      }
    });
  }, [duration, playing]);


  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  const play = () => {
    console.log('onPlay');
    console.log(player);
    const timestamp = player.getCurrentTime();
    setDuration(timestamp);
    handlePlay(true);
  };

  const pause = () => {
    console.log('onPause');
    console.log(player);
    const timestamp = player.getCurrentTime();
    setDuration(timestamp.toString());
    handlePlay(false);
  };
  const ref = (pl) => {
    initPlayer(pl);
  };


  return (
    <>
      <VotingPage room={room} />
      {/*  <Room
        adminDisplay={adminDisplay}
        setAdminDisplay={setAdminDisplay}
        name={name}
        room={room}
        url={url}
        setUrl={setUrl}
        ref={ref}
        play={play}
        pause={pause}
        setMessage={setMessage}
        sendMessage={sendMessage}
        message={message}
        messages={messages}
      /> */}
    </>
  );
};

export default Screen;
