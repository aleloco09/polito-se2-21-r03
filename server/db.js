'use strict';
const sqlite = require('sqlite3');
const db = new sqlite.Database('./server/se2.db', (err) => {
    if (err) throw err;
});
db.run('DROP TABLE [IF EXISTS] service_type_ticket');
db.run('DROP TABLE [IF EXISTS] counter_service_type');
db.run('DROP TABLE [IF EXISTS] ticket');

exports.getDB = (populate = false) => {
    if(!populate){
        return db;
    }

    db.serialize(function () {
        db.run(`create table ticket
                (
                    ticketId             INTEGER
                        primary key autoincrement,
                    counterId            INTEGER,
                    position             INTEGER,
                    serviceTypeId        INTEGER,
                    ticketNumber         INTEGER,
                    creationDate         DATETIME,
                    estimatedWaitingTime TIME,
                    officeId             INTEGER
                );`);

        let insertTicket = db.prepare('INSERT INTO ticket VALUES (?,?,?,?,?,?,?)')
        insertTicket.run(null,null,1,null,Date.now(),null,1);
        insertTicket.run(null,null,3,null,Date.now(),null,1);
        insertTicket.run(null,null,5,null,Date.now(),null,1);
        for (let i = 1; i < 6; i++) {
            insertTicket.run(null,null,i,null,Date.now(),null,1);
        }
        insertTicket.finalize();

        db.run(`create table service_type_ticket
                (
                    serviceTypeId INTEGER                not null
                        references service_type,
                    ticketId      INTEGER                not null
                        references ticket,
                    status        text default "CREATED" not null
                );`);

        let insertST = db.prepare('INSERT INTO service_type_ticket VALUES (?,?,?)')
        for (let i = 1; i < 6; i++) {
            insertST.run(i,i,"CREATED");
        }
        insertST.finalize();

        db.run(`create table counter_service_type
                (
                    counterId     INTEGER not null
                        references counter (counterId),
                    serviceTypeId INTEGER not null
                        references service_type
                );`);

        let insertCS = db.prepare('INSERT INTO counter_service_type VALUES (?,?)')
        for (let i = 1; i < 6; i++) {
            insertCS.run(i,i);
        }
        insertCS.finalize();
        return db;
    })
}