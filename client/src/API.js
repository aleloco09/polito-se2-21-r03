import axios from "axios";
import dayjs from "dayjs"

const BASEURL = '/api';


async function getFilteredTasks(filter,user){
  let url = BASEURL+`/filters/filter=${filter}/user=${user}/tasks`;
  try{
      const res = await axios.get(url,{filter:filter,user:user});
        const data = await res.data;
        return data;
    } catch(error) {
            console.log(error);
            //alert("Si è verificato un errore, riprova.");
     };
};

async function addTask(description,urgent,isPrivate,deadline,user){
    let url = BASEURL+"/tasks";

    try{
        const res = await axios.post(url,{ 
            description: description,
            important: +urgent,
            private: +isPrivate,
            deadline: deadline.format('YYYY-MM-DD HH:mm'),
            user: user
            }
        );
        return res;
    }catch(error) {
            console.log(error);
            alert("Si è verificato un errore, riprova.");
     };
}

async function updateTask(id, description, isPrivate, deadline, important, user){
    let url = BASEURL+"/tasks";
    let d=dayjs(deadline);

    let og={
        id: +id,
        description: description,
        private: +isPrivate,
        deadline: d.format('YYYY-MM-DD HH:mm'),
        important: +important}

    try{
        let res = await axios.put(url,og );
        return res;
    } catch(error) {

        alert("Si è verificato un errore, riprova.");
    };
};

async function completeTask(id, completed){
    let url = BASEURL+`/tasks/id=${id}&completed=${completed}`;
    try{
        let res = await axios.put(url);
        return res;
    } catch(error) {

        alert("Si è verificato un errore, riprova.");
    };
}

async function deleteTask(taskId){
    let url = BASEURL+"/tasks/"+taskId;
    const res = await axios.delete(url);
    return res.data;
};

async function login(credentials) {
    
    let response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if(response.ok) {
        const user = await response.json();
        return user;
      }
      else {
        try {
          const errDetail = await response.json();
          throw errDetail.message;
        }
        catch(err) {
          throw err;
        }
      }
  }
  
  async function logout() {
    await fetch('/api/login/current', { method: 'DELETE' });
  }
  
  async function getUserInfo() {
    const response = await fetch(BASEURL + '/login/current');
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;  // an object with the error coming from the server
    }
  }


const API = {getFilteredTasks, addTask, updateTask, completeTask, deleteTask, login, logout, getUserInfo}
export default API;