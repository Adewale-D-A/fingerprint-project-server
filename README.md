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
