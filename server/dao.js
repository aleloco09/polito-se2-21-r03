
'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('se2.db', (err) => {
  if(err) throw err;
});

exports.getNumTicketsQueuedByServiceType = (ticket) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) FROM service_type_ticket WHERE serviceTypeId=?';
    db.get(sql, [ticket.serviceTypeId], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
};

exports.getCountersByServiceTypeId = (ticket) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT counterId FROM counter_service_type WHERE serviceTypeId=?';
    db.all(sql, [ticket.serviceTypeId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const counters = rows.map((e) => ({ counterId: e.counterId }));
      resolve(counters);
    });
  });
};

exports.getNumberOfServedServices = (ticket) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) FROM counter_service_type WHERE counterId=?';
    db.get(sql, [ticket.counterId], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
};

exports.getTicketToServe = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT serviceTypeId 
    FROM counter_service_type 
    WHERE counterId = ?
    HAVING COUNT(*) = (
      SELECT MAX(*) 
      FROM service_type_ticket
      WHERE serviceTypeId IN(
        SELECT serviceTypeId 
        FROM counter_service_type 
        WHERE counterId = ?)
    )`;
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }if(rows.length == 0){
        resolve(null)
      }
      else if(rows.length > 1){
        // caso di 2 code della stessa lunghezza
        const list = rows
          .map(r => ({serviceTypeId: id, serviceTime: this.getServiceTimeByServiceTypeId(r.serviceTypeId)}))
          .sort((a, b) => a.serviceTime - b.serviceTime);
        resolve(list[0]);
      }else{
        resolve(rows[0])
      }
    });
  });
};

exports.getServiceTimeByServiceTypeId = (ticket) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT serviceTime FROM service_type WHERE serviceTypeId=?';
    db.get(sql, [ticket.serviceTypeId], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
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

/*exports.createTask = (task) => {
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
};*/

exports.createTicket = (ticket) => {
  return new Promise((resolve, reject) => {
      const [ticketId, counterId, position, ticketNumber, serviceTypeId, creationDate, ewt] = ticket;
      const sql = 'INSERT INTO ticket (ticketId, counterId, position, ticketNumber, serviceTypeId, creationDate, ewt) VALUES(?, ?, ?, ?, ?, ?, ?)';
          db.run(sql, [ticketId, counterId, position, ticketNumber, serviceTypeId, creationDate, ewt], function (err) {
          if (err) {
              reject(err);
              return;
          }
          resolve(this.lastID);
      });
  })
};

/*exports.updateTask=(task)=>{
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

}*/

exports.handleTicket=(ticket)=>{
  return new Promise((resolve, reject) => {
      const sql = 'UPDATE ticket SET counterId=? WHERE id=?';
          db.run(sql, [ticket.counterId, ticket.ticketId], function (err) {
          if (err) {
              reject(err);
              return;
          }
          resolve(true);
      });
  })
}

/*exports.deleteTask=(task)=>{
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
}*/

exports.deleteTicket=(ticket)=>{
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM service_type_ticket WHERE ticketId=?';
        db.run(sql, [ticket.ticketId], function (err) {
        if (err) {
            reject(err);
            return;
        }
        resolve(true);
    });
})
}
