'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('./server/se2.db', (err) => {
  if(err) throw err;
});

exports.getFirstTicketFromQueue = (serviceTypeId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT MIN(ticketId) FROM service_type_ticket WHERE serviceTypeId=?';
        db.get(sql, [serviceTypeId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);
        });
    });
};

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

exports.getLongestQueueToServe = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT serviceTypeId 
    FROM counter_service_type 
    WHERE counterId = ?
    GROUP BY serviceTypeId
    HAVING COUNT(*) = (
      SELECT MAX(serviceTypeId) 
      FROM service_type_ticket
      WHERE serviceTypeId IN(
        SELECT serviceTypeId 
        FROM counter_service_type 
        WHERE counterId = ?)
      GROUP BY serviceTypeId
    )`;
    db.all(sql, [id,id], (err, rows) => {
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

exports.handleTicket=(ticket)=>{
  return new Promise((resolve, reject) => {
      const sql = 'UPDATE ticket SET counterId=? FROM ticket WHERE id=?';
          db.run(sql, [ticket.counterId, ticket.ticketId], function (err) {
          if (err) {
              reject(err);
              return;
          }
          resolve(true);
      });
  })
}

exports.updateTicketStatus=(status,ticketId)=>{
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE status SET status=? FROM service_type_ticket WHERE ticketId=?';
        db.run(sql, [status,ticketId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    })
}