Notes (to be done):
- Check deployment options - final progress check, need to have CBA's input for hosting options
  * Migrate to PostgreSQL
- Create User Manual
  * Key Reminders
    >  Student & Custodian slip copies will manually write the Received & Returned signed by names for verification/final step of borrowing process.
        It is left to manual because availabilty of student who will come to receive & return items will vary.
    > Registering users via import csv would need every new email to be unique, not existing. Therefore, direct the admin to first export users csv, then fill that file in with new users to be imported. 

MIGRATING TO PostgreSQL:
- Check if id column name for each table can be _id to retain attribute name being used in frontend. but if id needs to be unique for the table, manually check each _id instance in frontend react components
- when migrating, modify sql or db.js files, server.js, and route files
- if different id column name, check and modify frontend components

- final notes: DONE MIGRATION, deleted seeding files etc

Attaching .sql file to the project
- contains sql schema for all tables

Instructions to devs when setting up on their units: 
- download PostgreSQL
- create hmbs_db locally
- run hmbs_db_schema.sql sql queries
- import data from csv files in csv_files folder