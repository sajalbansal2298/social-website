// eslint-disable-next-line no-shadow
export enum EventType {
  API = 'api_event', // Network requests
  DB = 'db_event', // Database events
  IPC = 'ipc_event', // Inter process (tab/window) communication
  TRACKING = 'tracking_event', // Tracking user activities
  UI = 'ui_event', // Special UI only updates
}
