var http = require('http');
var socketio = require('socket.io');
var allowedOrigins = "http://localhost:* http://127.0.0.1:* http://gobber.jespercarlsson.com gobber.jespercarlsson.com:* 178.62.52.134:*"
class WebSocket {
  init(app) {
    this.server = http.Server(app);
    this.io = socketio(this.server, {
      origins: allowedOrigins
    });
    global.io = this.io;
  }

  listen(port, fn) {
    this.server.listen(port, fn);
  }

  emit(event, data) {
    this.io.emit(event, data);
  }
  
  on(event, fn) {
    this.io.on(event, fn);
  }

  emit_to_client(id, event, data) {
    this.io.to(id).emit(event, data);
  }
}

var socket = new WebSocket();

module.exports = socket;
