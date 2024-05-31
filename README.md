# Fingerprint Final Year Project Server

> This repository contains the server for my final year fingerprint server developed in Node.js

## Maintenance

This server is written in Node, so technical knowledge of Node.js library is essential for any modification/maintenance of this codebase

>

 <table>
    <tr>
      <th>Task</th>
      <th>Docker command</th>
    </tr>
    <tr>
      <td>Build a docker image using docker compose</td>
      <td>docker-compose build</td>
    </tr>
    <tr>
      <td>Run the image locally</td>
      <td>docker run -d -p 8080:8080 --name fingerprint-project fingerprint-project:v1.1.5</td>
    </tr>
    <tr>
      <td>Push Docker image to Dockerhub</td>
      <td>docker tag fingerprint-project:v1.1.5 adewaleda/fingerprint-project:v1.1.5</td>
    </tr>
    <tr>
      <td></td>
      <td>docker push adewaleda/fingerprint-project:v1.1.5</td>
    </tr>
    <tr>
      <td>Pull image from DockerHub</td>
      <td>docker pull adewaleda/fingerprint-project:v1.1.5</td>
    </tr>
    </table>

 <table>
    <tr>
      <th>Package Name</th>
      <th>Use In App</th>
    </tr>
    <tr>
      <td>nodemon</td>
      <td>used in local development for realtime updates</td>
    </tr>
    <tr>
      <td>pm2</td>
      <td>used on server in production mode for authomtic restart on server crash</td>
    </tr>
    <tr>
      <td>express</td>
      <td>api service library for HTTP request and response cycle</td>
    </tr>
    <tr>
      <td>cookie-parser</td>
      <td>enable cookie from browsers</td>
    </tr>
</table>

## SQL commands

 <table>
    <tr>
      <th>Add new entry to table (students' table)</th>
      <th>INSERT INTO students (firstname,lastname,matric_number, email, username, hardware_user_id, password)
    VALUES("adewale","azeez","18/30GC027", "adewale.d.a@outlook.com", "ade", 44, "oluwadamilare");</th>
    </tr>
    <tr>
      <th>Create table with auto timestamp</th>
      <th>CREATE TABLE `users`.`lecturers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firstname` VARCHAR(50) NOT NULL,
  `lastname` VARCHAR(50) NULL,
  `title` VARCHAR(20) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `courses` JSON NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`updated_At` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);
</th>
<tr>
      <th>Alter table by adding a column</th>
      <th>ALTER TABLE `users`.`lecturers` 
ADD COLUMN `password` VARCHAR(50) NOT NULL AFTER `email`;
</th>
    </tr>
</table>
