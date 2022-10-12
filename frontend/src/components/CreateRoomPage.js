import React,{Component, useState, useEffect} from "react"
import { Link, useNavigate } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { withRouter } from "react-router";

export default function CreateRoomPage(props) {  
   
    const {
        votesToSkip = 2,
        guestCanPause = true,
        update = false,
        roomCode =  null,
        updateCallback = () => {},
    } = props;
    
    const initialState = {
      guestCanPause: guestCanPause,
      votesToSkip: votesToSkip,
      errorMsg: "",
      successMsg: "",
      };
    
    const [state,setState] = useState(initialState)
    const navigate = useNavigate()


    const handleVotesChange = (e) => {
        setState({
          votesToSkip: e.target.value,
        });
      }
    
    const handleGuestCanPauseChange = (e) => {
        setState({
          guestCanPause: e.target.value === "true" ? true : false,
        });
      }
    
    const handleRoomButtonPressed = () => { // post request, send info from frontend to backend
        const requestOptions = {
            method: "POST",        
            headers: { "Content-Type": "application/json" },       
            body: JSON.stringify({
            votes_to_skip: state.votesToSkip,
            guest_can_pause: state.guestCanPause,
          }),
        };
        fetch("/api/create-room", requestOptions) //fetch the backend api and send the requestOptions
          .then((response) => response.json()) // turn the response to json
          .then((data) => console.log(data)); // and print in the console
          // .then((data) => navigate("/room/" + data.code));   
      }
    
    const handleUpdateButtonPressed = () => {
        const requestOptions = {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            votes_to_skip: state.votesToSkip,
            guest_can_pause: state.guestCanPause,
            code: roomCode,
          }),
        };
        fetch("/api/update-room", requestOptions).then((response) => {
          if (response.ok) {
            setState({
              successMsg: "Room updated successfully!",
            });
          } else {
            setState({
              errorMsg: "Error updating room...",
            });
          }
          updateCallback();
        });
      }

    const renderCreateButtons = () => {
      return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleRoomButtonPressed}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
      );}
    
    const renderUpdateButtons = () => {
        return (
          <Grid item xs={12} align="center">
            <Button
              color="primary"
              variant="contained"
              onClick={handleUpdateButtonPressed}
            >
              Update Room
            </Button>
          </Grid>
        );
      }

    
    const title = update ? "Update Room" : "Create a Room";

    return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Collapse
                      in={state.errorMsg != "" || state.successMsg != ""}
                    >
                      {state.successMsg != "" ? (
                        <Alert
                          severity="success"
                          onClose={() => {
                            setState({ successMsg: "" });
                          }}
                        >
                         {state.successMsg}
                        </Alert>
                      ) : (
                        <Alert
                          severity="error"
                          onClose={() => {
                          setState({ errorMsg: "" });
                        }}
                        >
                         {state.errorMsg}
                        </Alert>
                      )}
                    </Collapse>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        {title}
                    </Typography>
                </ Grid>
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText component="span">
                            <div align="center">Guest Control of Playback State</div>
                        </FormHelperText>
                        <RadioGroup
                            row
                            defaultValue={guestCanPause.toString()}
                            onChange={handleGuestCanPauseChange}
                        >
                            <FormControlLabel
                                value="true"
                                control={<Radio color="primary" />}
                                label="Play/Pause"
                                labelPlacement="bottom"
                            />
                            <FormControlLabel
                                value="false"
                                control={<Radio color="secondary" />}
                                label="No Control"               
                                labelPlacement="bottom"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField
                            required={true}
                            type="number"
                            onChange={handleVotesChange}
                            defaultValue={state.votesToSkip}
                            inputProps={{
                                min: 1,
                                style: { textAlign: "center" },          
                            }}
                        />
                        <FormHelperText component="span">
                            <div align="center">Votes Required To Skip Song</div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                {update
                ? renderUpdateButtons()
                : renderCreateButtons()}
            </Grid>
        )

}


