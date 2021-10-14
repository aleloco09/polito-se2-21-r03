
'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');


// open the database
const db = new sqlite.Database('tasks.db', (err) => {
  if(err) throw err;
});

exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
      db.get(sql, [email], (err, row) => {
        if (err) 
          reject(err);
        else if (row === undefined) {
          resolve(false);
        }
        else {
          const user = {id: row.id, username: row.email, name: row.name};
          // check the hashes with an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
         bcrypt.compare(password, row.hash).then(result => {
            if(result)
            resolve(user);
            else
              resolve(false);
          });
        }
    });
  });
}

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) 
          reject(err);
        else if (row === undefined)
          resolve({error: 'User not found.'});
        else {
          // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
          const user = {id: row.id, username: row.email, name: row.name}
          resolve(user);
        }
    });
  });
};


exports.getAllTasks = (user) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM tasks WHERE user=?';
      db.all(sql, [user], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const tasks = rows.map((e) => ({ id: e.id ,description: e.description, important: e.important, private: e.private, deadline: e.deadline, completed: e.completed, user: e.user  }));
        resolve(tasks);
      });
    });
};


exports.getFilteredTasks = (filter,user) => {
  return new Promise((resolve, reject) => {
    let sql="";   
    switch(filter){
        case "All":
          sql= 'SELECT * FROM tasks WHERE user=?';
          break;
        case "Important":
          sql='SELECT * FROM tasks WHERE important=1 AND user=?';
          break;
        case "Private":
          sql='SELECT * FROM tasks WHERE private=1 AND user=?';
          break;
        case "Today":
          sql=`SELECT * FROM tasks WHERE DATETIME(deadline, 'start of day')=(DATETIME('now','start of day')) AND user=?`;
          break;
        case "Next7Days":
          sql=`SELECT * FROM tasks WHERE deadline>=(DATETIME('now', 'start of day')) AND deadline<=(DATETIME('now', '+7 day')) AND user=?`; 
          break;
        default:
          break;
    }
    
    db.all(sql, [user], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const tasks = rows.map((e) => ({ id: e.id ,description: e.description, important: e.important, private: e.private, deadline: e.deadline, completed: e.completed, user: e.user  }));
      resolve(tasks);
    });
  });
};

exports.getTask = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM tasks WHERE id = ?';
      db.all(sql, [id], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const tasks = rows.map((e) => ({ id: e.id ,description: e.description, important: e.important, private: e.private, deadline: e.deadline, completed: e.completed, user: e.user  }));
        resolve(tasks);
      });
    });
};

exports.createTask = (task) => {
    // {description:, important:, private:, deadline:, user:,}
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO tasks (description, important, private, deadline, user) VALUES(?, ?, ?, ?, ?)';
            db.run(sql, [task.description, task.important, task.private, task.deadline, task.user], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    })
};

exports.updateTask=(task)=>{
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE tasks SET description=?, important=?, private=?, deadline=? WHERE id=?';
        db.run(sql, [task.description, task.important, task.private, task.deadline, task.id], function (err) {
        if (err) {
            reject(err);
            return;
        }
        resolve(true);
    });
})

}

exports.completeTask=(task)=>{
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE tasks SET completed=? WHERE id=?';
        db.run(sql, [task.completed, task.id], function (err) {
        if (err) {
            reject(err);
            return;
        }
        resolve(true);
    });
})

}

exports.deleteTask=(task)=>{
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM tasks WHERE id=?';
        db.run(sql, [task.id], function (err) {
        if (err) {
            reject(err);
            return;
        }
        resolve(true);
    });
})

}