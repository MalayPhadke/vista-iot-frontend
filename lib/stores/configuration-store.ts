import { create } from 'zustand'
import YAML from 'yaml'
// defaultConfig will be typed with ConfigSchema in its own file later
import { defaultConfig } from '@/lib/config/default-config'

// --- BEGIN: Inserted Interface Definitions ---

// Canonical IOTag definition (originally from io-tag-detail.tsx)
export interface IOTag {
  id: string;
  name: string;
  dataType: string;
  registerType?: string;
  address: string;
  description: string;
  source?: string;
  defaultValue?: string | number;
  scanRate?: number;
  conversionType?: string;
  scaleType?: string;
  readWrite?: string;
  startBit?: number;
  lengthBit?: number;
  spanLow?: number;
  spanHigh?: number;
  formula?: string;
  scale?: number;
  offset?: number;
  clampToLow?: boolean;
  clampToHigh?: boolean;
  clampToZero?: boolean;
  signalReversal?: boolean;
  value0?: string;
  value1?: string;
}

// Canonical DeviceConfig definition (originally from device-form.tsx)
export interface DeviceConfig {
  id: string;
  enabled: boolean;
  name: string;
  deviceType: string;
  unitNumber: number;
  tagWriteType: string;
  description: string;
  addDeviceNameAsPrefix: boolean;
  useAsciiProtocol: number; // Assuming number based on typical usage
  packetDelay: number;
  digitalBlockSize: number;
  analogBlockSize: number;
  tags: IOTag[];
}

// Canonical SerialPortSettings definition (originally from io-tag-form.tsx)
export interface SerialPortSettings {
  port: string;
  baudRate: number;
  dataBit: number;
  stopBit: number | string;
  parity: string;
  rts: boolean;
  dtr: boolean;
  enabled: boolean;
}

// Canonical IOPortConfig definition (originally from io-tag-form.tsx)
export interface IOPortConfig {
  id: string;
  type: string;
  name: string;
  description: string;
  scanTime: number;
  timeOut: number;
  retryCount: number;
  autoRecoverTime: number;
  scanMode: string;
  enabled: boolean;
  serialSettings?: SerialPortSettings;
  devices: DeviceConfig[];
}

// --- Sub-interfaces for ConfigSchema (derived from defaultConfig.ts) ---
interface DeviceInfo {
  name: string;
  model: string;
  version: string;
  location: string;
  description: string;
}

interface IPv4StaticConfig {
  address: string;
  netmask: string;
  gateway: string;
}

interface DNSConfig {
  primary: string;
  secondary: string;
}

interface IPv4Config {
  mode: string;
  static: IPv4StaticConfig;
  dns?: DNSConfig;
}

interface EthernetLinkConfig {
  speed: string;
  duplex: string;
}

interface EthernetInterface {
  type: string;
  enabled: boolean;
  mode: string;
  link: EthernetLinkConfig;
  ipv4: IPv4Config;
}

interface WifiSecurity {
  mode: string;
  password: string;
}

interface WifiConfig {
  ssid: string;
  security: WifiSecurity;
  channel: string;
  band: string;
  hidden: boolean;
}

interface WirelessInterface {
  type: string;
  enabled: boolean;
  mode: string;
  wifi: WifiConfig;
  ipv4: IPv4Config;
}

interface NetworkInterfaces {
  eth0: EthernetInterface;
  wlan0: WirelessInterface;
}

// Define a basic FirewallRule, expand if structure is known
interface FirewallRule {
  id?: string; // Example property
  action: string;
  protocol?: string;
  source_ip?: string;
  description?: string;
}

interface FirewallConfig {
  enabled: boolean;
  default_policy: string;
  rules: FirewallRule[];
}

interface NetworkConfig {
  interfaces: NetworkInterfaces;
  firewall: FirewallConfig;
}

interface ModbusTCPConfig {
  port: number;
  max_connections: number;
  timeout: number;
}

interface ModbusSerialConfig {
  port: string;
  baudrate: number;
  data_bits: number;
  parity: string;
  stop_bits: number;
}

// Define a basic ModbusMapping, expand if structure is known
interface ModbusMapping {
  id?: string; // Example property
  register: number;
  type: string;
}

interface ModbusConfig {
  enabled: boolean;
  mode: string;
  tcp: ModbusTCPConfig;
  serial: ModbusSerialConfig;
  slave_id: number;
  mapping: ModbusMapping[];
}

interface MQTTTLSConfig {
  enabled: boolean;
  version: string;
  verify_server: boolean;
  allow_insecure: boolean;
  cert_file: string;
  key_file: string;
  ca_file: string;
}

interface MQTTAuthConfig {
  enabled: boolean;
  username: string;
  password: string;
}

interface MQTTBrokerConfig {
  address: string;
  port: number;
  client_id: string;
  keepalive: number;
  clean_session: boolean;
  tls: MQTTTLSConfig;
  auth: MQTTAuthConfig;
}

// Define a basic MQTTTopic, expand if structure is known
interface MQTTTopic {
  path: string;
  qos: number;
}

interface MQTTTopics {
  publish: MQTTTopic[];
  subscribe: MQTTTopic[];
}

interface MQTTConfig {
  enabled: boolean;
  broker: MQTTBrokerConfig;
  topics: MQTTTopics;
}

interface ProtocolsConfig {
  modbus: ModbusConfig;
  mqtt: MQTTConfig;
}

interface ComPortSetting {
  mode: string;
  baudrate: number;
  data_bits: number;
  parity: string;
  stop_bits: number;
  flow_control: string;
}

interface ComPortsConfig {
  com1: ComPortSetting;
  com2: ComPortSetting;
}

interface WatchdogConfig {
  enabled: boolean;
  timeout: number;
  action: string;
  custom_command: string;
}

interface GPIOInput { id?: string; state?: boolean; }
interface GPIOOutput { id?: string; state?: boolean; }

interface GPIOConfig {
  inputs: GPIOInput[];
  outputs: GPIOOutput[];
}

interface HardwareConfig {
  com_ports: ComPortsConfig;
  watchdog: WatchdogConfig;
  gpio: GPIOConfig;
}

interface SSHConfig {
  enabled: boolean;
  port: number;
  allow_root: boolean;
  password_auth: boolean;
}

interface UserConfig { id?: string; username: string; }
interface CertificateConfig { id?: string; name: string; }

interface SecurityConfig {
  ssh: SSHConfig;
  users: UserConfig[];
  certificates: CertificateConfig[];
}

interface RemoteSyslogConfig {
  enabled: boolean;
  server: string;
  port: number;
}

interface LoggingConfig {
  level: string;
  max_size: string;
  max_files: number;
  remote_syslog: RemoteSyslogConfig;
}

interface AutoUpdateConfig {
  enabled: boolean;
  schedule: string;
  channel: string;
}

interface BackupConfig {
  enabled: boolean;
  schedule: string;
  retain: number;
  location: string;
}

interface MaintenanceConfig {
  auto_update: AutoUpdateConfig;
  backup: BackupConfig;
}

interface IOSetupConfig {
  ports: IOPortConfig[]; // Key change: explicitly IOPortConfig[]
}

// The main configuration schema
export interface ConfigSchema {
  device: DeviceInfo;
  network: NetworkConfig;
  protocols: ProtocolsConfig;
  hardware: HardwareConfig;
  security: SecurityConfig;
  logging: LoggingConfig;
  maintenance: MaintenanceConfig;
  io_setup: IOSetupConfig;
}

// --- END: Inserted Interface Definitions ---

// ConfigState interface, modified to use ConfigSchema
export interface ConfigState {
  config: ConfigSchema; // MODIFIED: Use ConfigSchema
  lastUpdated: string;
  isDirty: boolean;
  updateConfig: (path: string[], value: any) => void;
  resetConfig: () => void;
  getYamlString: () => string;
  getLastUpdated: () => string;
  setDirty: (isDirty: boolean) => void;
  getConfig: () => ConfigSchema; // MODIFIED: Return type is ConfigSchema
}

// The store implementation
export const useConfigStore = create<ConfigState>((set, get) => ({
  config: defaultConfig as ConfigSchema, // Assert defaultConfig conforms to ConfigSchema
  lastUpdated: new Date().toISOString(),
  isDirty: false,

  updateConfig: (path: string[], value: any) => {
    set(state => {
      // Use a deep copy for state updates to avoid direct mutation issues.
      // JSON.parse(JSON.stringify(...)) is a common simple deep copy method.
      const newConfig = JSON.parse(JSON.stringify(state.config)) as ConfigSchema;
      let current: any = newConfig; // Use 'any' for dynamic path navigation
      
      for (let i = 0; i < path.length - 1; i++) {
        if (current[path[i]] === undefined || typeof current[path[i]] !== 'object') {
          current[path[i]] = {}; // Create path if it doesn't exist or isn't an object
        }
        current = current[path[i]];
      }
      
      if (path.length > 0) {
        current[path[path.length - 1]] = value;
      } else {
        // If path is empty, replace the entire config.
        // Ensure 'value' conforms to ConfigSchema if this case is used.
        return { 
          config: value as ConfigSchema, // Assert value conforms
          lastUpdated: new Date().toISOString(),
          isDirty: true 
        };
      }
      
      return { 
        config: newConfig,
        lastUpdated: new Date().toISOString(),
        isDirty: true 
      };
    });
  },

  resetConfig: () => {
    set({ 
      // Ensure defaultConfig is treated as ConfigSchema upon reset
      config: JSON.parse(JSON.stringify(defaultConfig)) as ConfigSchema, 
      lastUpdated: new Date().toISOString(),
      isDirty: true 
    });
  },

  getYamlString: () => {
    return YAML.stringify(get().config, { indent: 2 });
  },

  getLastUpdated: () => {
    return get().lastUpdated;
  },

  setDirty: (isDirty: boolean) => {
    set({ isDirty });
  },

  getConfig: () => {
    return get().config; // This now correctly returns ConfigSchema
  }
}));