import React, { Component,useState, useEffect, }  from "react";
import { useNavigate, Navigate, useParams } from "react-router-dom";  
import { Grid, Button, Typography } from "@material-ui/core";
import { Link, Route } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";


export default function Room(props){
    const initialState = {
        votesToSkip: 2,
        guestCanPause: false,
        isHost: false,
        showSettings: false,
        spotifyAuthenticated: false,
        song:{},
    }
    const [roomData, setRoomData] = useState(initialState) 
    const { roomCode } = useParams()
    const navigate = useNavigate()

    const clearRoomCode = () => {
      setState({roomCode: null})
      }
    <Route path='/room/:roomCode' element={<Room clearRoomCodeCallback={clearRoomCode} />} />

    const getRoomDetails = () => {
      fetch("/api/get-room?code=" + roomCode)
          .then(res => {
            if (!res.ok) {
              props.clearRoomCodeCallback; // clears roomCode state in HomePage
              navigate("/");
            } else {
              return res.json();
            }})
          .then(data => {
            setRoomData({
              ...roomData, 
              votesToSkip: data.votes_to_skip,
              guestCanPause: data.guest_can_pause,
              isHost: data.is_host,
            });
            if (roomData.isHost) {
              authenticateSpotify();
            }                     
          })
    }

    useEffect(() => {
      getRoomDetails();
      console.log(roomData)
      },[]); //It renders when the object changes .If we use roomData and/or roomCode then it rerenders infinite times
    
    // check and render the current song every second; clearIntervel
    useEffect(() => {
      getCurrentSong();
      // setInterval(() => getCurrentSong, 1000);
      },[roomData]); 

    
    const authenticateSpotify = () => {
      // fetch auth state
      fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setRoomData({
          ...roomData,
          spotifyAuthenticated: data.status,
        });
        console.log(data.status);
        console.log(roomData);
        // if not authenticated, redirect to spotify auth page
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      }).catch((error)=>{
        console.log(error)
      });
    }
    

    const getCurrentSong = () => {
      fetch("/spotify/current-song")
        .then((response) => {
          if (!response.ok) {
            return {};
          } else {           
            return response.json();
          }
        })
        .then((data) => {
          setRoomData({
            ...roomData,
            song: data
          });
          console.log(data);
        });
    }
    

    const leaveBottonPressed = () => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      };
      fetch("/api/leave-room" , requestOptions)
      .then(_response => {
        props.clearRoomCodeCallback; // clears roomCode state in HomePage
        navigate("/");
      })
    }
    

    const updateShowSettings = (value) => {
      setRoomData({
        ...roomData,
        showSettings: value,
      });
    }


    const renderSettings=() =>  {
      return (
        <Grid container spacing={1}>
          <Grid item xs={12} align="center">
            <CreateRoomPage
              update={true}
              votesToSkip={roomData.votesToSkip}
              guestCanPause={roomData.guestCanPause}
              roomCode={roomCode}
              updateCallback={getRoomDetails}
            />
          </Grid>
          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => updateShowSettings(false)}
            >
              Close
            </Button>
          </Grid>
        </Grid>
      );
    }

    const renderSettingsButton = () => {
      return (
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => updateShowSettings(true)}
          >
            Settings
          </Button>
        </Grid>
      );
    }



    if (roomData.showSettings) {
      return renderSettings();
      }
    return (       
        <Grid container spacing={1} >
          <Grid item xs={12} align="center">
            <Typography variant="h4" component="h4">
              RoomCode: {roomCode}
            </Typography>
          </Grid>
          {/* <Grid item xs={12} align="center">
            <Typography variant="h6" component="h6">
              Votes: {roomData.votesToSkip}
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <Typography variant="h6" component="h6">
              Guest Can Pause: {roomData.guestCanPause.toString()} 
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <Typography variant="h6" component="h6">
              Host: {roomData.isHost.toString()}
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <Typography variant="h6" component="h6">
              spotifyAuthenticated: {roomData.spotifyAuthenticated.toString()}
            </Typography>
          </Grid> */}
          <MusicPlayer {...roomData.song} />
          
          <Grid item xs={12} align="center" style={{marginTop:"40px"}}>
            {/* {roomData.isHost ? renderSettingsButton() : null} */}
            <Button variant="contained" color="secondary" onClick={leaveBottonPressed}>
              Leave Room
            </Button>
          </Grid>
        </Grid>

      )
}


