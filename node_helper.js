/* Magic Mirror
 * Node Helper: MMM-SmartTouch
 *
 * By SmartBuilds.io - Pratik and Eben
 * https://smartbuilds.io
 * MIT Licensed.
 */
const Blynk = require('blynk-library');
const NodeHelper = require("node_helper");
const piToken = 'BO9Ej28AzpoEsaCs0WXiS3mqSO2KE8mZ';
const globalSwitchButtonPin = 1;
const blynkServer = 'sonos.local';
const blynkServerPort = 8442;

module.exports = NodeHelper.create({
  start: function () {
    this.started = false;
    this.config = {};
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === 'CONFIG') {
      if (!this.started) {
        this.config = payload;
        this.started = true;
        console.log("Smart Touch module has started")
        this.sendSocketNotification("SHUTIT", payload);
      }
    }

    if (notification === "BLYNKSEND") {
      const blynk = new Blynk.Blynk(piToken, options = {
        connector : new Blynk.TcpClient( options = { addr: blynkServer, port: blynkServerPort })
      });
      blynk.on('connect', () => {
        const bridge = new blynk.WidgetBridge(99);
        bridge.setAuthToken(piToken);
        bridge.virtualWrite(globalSwitchButtonPin, 1);
        blynk.disconnect(false);
      });
    }

    if (notification === "SHUTDOWN") {
      console.log("Shutting down Rpi...")
      require('child_process').exec('shutdown -h now', console.log)
    }

    if (notification === "RESTART") {
      console.log("Restarting Rpi...")
      require('child_process').exec('sudo reboot', console.log)
    }
  },
});
