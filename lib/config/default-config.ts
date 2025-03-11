export const defaultConfig = {
  device: {
    name: "IoT-Gateway-001",
    model: "IoT-GW-5000",
    version: "2.1.0"
  },
  network: {
    interfaces: {
      eth0: {
        type: "ethernet",
        enabled: true,
        mode: "dhcp",
        link: {
          speed: "auto",
          duplex: "auto"
        },
        ipv4: {
          mode: "dhcp"
        }
      },
      wlan0: {
        type: "wireless",
        enabled: false,
        mode: "client",
        wifi: {
          ssid: "",
          security: {
            mode: "wpa2",
            password: ""
          },
          channel: "auto",
          band: "2.4",
          hidden: false
        },
        ipv4: {
          mode: "dhcp"
        }
      }
    },
    dhcp: {
      enabled: false,
      pool: {
        start: "192.168.1.100",
        end: "192.168.1.200"
      }
    }
  },
  protocols: {
    modbus: {
      enabled: false,
      mode: "tcp",
      tcp: {
        port: 502,
        max_connections: 5,
        timeout: 30
      },
      serial: {
        port: "ttyS0",
        baudrate: 9600,
        data_bits: 8,
        parity: "none",
        stop_bits: 1
      }
    },
    mqtt: {
      enabled: false,
      broker: {
        address: "localhost",
        port: 1883,
        client_id: "iot-gateway",
        tls: {
          enabled: false,
          version: "1.2",
          verify_server: true,
          allow_insecure: false
        }
      }
    }
  },
  hardware: {
    com_ports: {
      com1: {
        mode: "rs232",
        baudrate: 9600
      },
      com2: {
        mode: "rs485",
        baudrate: 115200
      }
    },
    watchdog: {
      enabled: false,
      timeout: 30
    }
  }
} 