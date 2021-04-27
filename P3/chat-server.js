//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');

const PUERTO = 8080;

//-- Preguntar si con copiar la carpeta de los modulos
//-- fuera de ejemplos sería suficiente para que esto funcionase

//-- Crear una nueva aplciacion web
const app = express();