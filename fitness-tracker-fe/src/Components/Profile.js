
import { useState, useEffect } from 'react';
import {  Dialog, DialogActions, DialogContent, TextField } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';


const BASE_URL = "https://murmuring-journey-02933.herokuapp.com/api"
let routineId = undefined;
let count = undefined;
let duration = undefined;
let isPublic = true;
let activityId = undefined;
let goal = '';
let name = '';

const Profile = () => {
  const [routines, setRoutines] = useState();
  const [routinesActivities, setRoutinesActivities] = useState();
  const [deletedRoutine, setDeletedRoutine] = useState();
  const [activities, setActivities] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [modalDisplay, setModalDisplay] = useState(false);
  const [addRoutineActivity, setAddRoutineActivity] = useState(false);
  


  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getActivities = async () => {
    await fetch(`${BASE_URL}/activities`, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json())
      .then(result => {
        console.log(result);
        setActivities(result);
      })
      .catch(console.error);
  }
  const updateRoutine = async (event, routineId) => {
    event.preventDefault();
    console.log(name, goal);
    await fetch(`${BASE_URL}/routines/${routineId}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        name: name,
        goal: goal
      })
    }).then(response => response.json())
      .then(result => {
        console.log(result);
      })
      .catch(console.error);
  }
  const createRoutine = async (event) => {
    event.preventDefault();
    await fetch(`${BASE_URL}/routines`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        name: name,
        goal: goal,
        isPublic: isPublic
      })
    }).then(response => response.json())
      .then(result => {
        console.log(result);
      })
      .catch(console.error);
    userRoutines();
  }
  const userRoutines = async () => {
    await fetch(`${BASE_URL}/users/${localStorage.getItem('user')}/routines`, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json())
      .then(result => {
        console.log("user routines is", result);
        setRoutines(result);
      })
      .catch(console.error);
  }
  const deleteRoutine = async (id) => {
    await fetch(`${BASE_URL}/routines/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(response => response.json())
      .then(result => {
        console.log(result);
        setDeletedRoutine(result);
      })
      .catch(console.error);
    userRoutines();
  }

  const addActivityToRoutine = async (activityId, routineId) => {
    await fetch(`${BASE_URL}/routines/${routineId}/activities`, {
      method: "POST",
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        activityId: activityId,
        count: count, 
        duration: duration
      })
    }).then(response => response.json())
      .then(result => {
        console.log(result);
      })
      .catch(console.error);
    setAddRoutineActivity(false);
  }
  
  const getRoutineId = (id) => {
    routineId = id;
    console.log(routineId)
    return routineId;
  }
  
  const getActivityId = (id) => {
    activityId = id;
    return activityId;
  }
  
  useEffect(() => {
    getActivities();
    userRoutines();
  }, [setActivities, setDeletedRoutine, setRoutines]);

  const renderActivities = (routineId) => {
    return (<div>
      {activities ? activities.map((activity, index) => {
        console.log(activity.id, routineId);
      return (
        <div className="card" key={index} id={activity.id}>
          <header>
            <h3 className="cardTitle">{activity.name.toUpperCase()}</h3>
            <hr />
            <h3 className="cardSubtitle">Description: {activity.description}</h3>
          </header>
          <input
            type="number"
            placeholder="count"
            onChange={(event) => { count = event.target.value }}
          />
          <input
            type="number"
            placeholder="duration"
            onChange={(event) => { duration = event.target.value }}
          />
          <button onClick={() => { getActivityId(activity.id); addActivityToRoutine(activity.id, routineId) }}>Add this activity</button>
      </div>
      )
    }) : null}
      </div>)
  }

  return (
    <>
      {localStorage.getItem('user') ?
        <div className="homeContent">
          <div className="createText">Create an routine below</div>
          <div className="createRoutine">
            <form className="createRoutine">
              <label>
                Name:
              <input 
                type="text" 
                name="routineName" 
                onChange={(event) => {name = event.target.value}} 
              />
              </label>
              <label>
                Goal
              <input 
                type="text" 
                name="routineGoal"
                onChange={(event) => {goal = event.target.value}}          
              />
              </label>
              <button className="actionButton" type="submit" onClick={createRoutine}>Create Routine</button>
            </form>
            {routines ? routines.map((routine, index) => {
              return (
                <div className="card" key={index} id={routine.id} onClick={()=> getRoutineId(routine.id)}>
                  <header>
                    <h3 className="cardTitle">{routine.name}</h3>
                    <h3 className="cardSubtitle">Goal: {routine.goal}</h3>
                    <p className="cardContent">Creator: {routine.creatorName}</p>
                    <div className="activitiesBox">
                      <h3 className="cardSubtitle">Activities:</h3>
                      {routine.activities.length ? routine.activities.map((activity, index) => {
                          return (
                            <div className="subContent" key={index}>
                              <h2>Activity: </h2>
                              <header>
                                <h3 className="cardSubtitle">-{activity.name}</h3>
                                <h3 className="cardSubtitle">-{activity.description}</h3>
                                {activity.goal ? <h3 className="cardTitle">Goal: {activity.goal}</h3> : null}
                                <h3 className="cardSutitle">Count: {activity.count} reps</h3>
                                <h3 className="cardSubtitle">Duration: {activity.duration} minutes</h3>
                              </header>
                            </div>
                          )
                        }) : null} 
                    </div>
                    <button onClick={() => { setAddRoutineActivity(true)}}>Add activity to routine</button>
                    {addRoutineActivity && renderActivities(routine.id)}
                  </header>
                  <button className="actionButton" onClick={() => setModalDisplay(true)}>Edit Routine</button>
                  <button className="actionButton" onClick={() => deleteRoutine(routine.id)}>Delete Routine</button>
                  </div>
              )
            }): null}  
        </div>
      </div>: <h3>Please log in to create a routine and/or activities.</h3>}
    </>   
  )
}
export default Profile;