export interface VillageModel {
  address: string;
  data: VillageData;
}
export interface VillageData {
  Attack: number;
  Defence: number;
  Elixr: number;
  ElixrRate: number;
  Gold: number;
  GoldRate: number;
  Steal: number;
  TimeStamp: number;
}
export interface CurrentBuildStatus {
  _Level: string;
  _CoolOff: string;
}
export interface CurrentTroopStatus {
  _Count: string;
}
export interface TroopQueueModel {
  Attack: string;
  Count: string;
  Defence: string;
  ID: string;
  Steal: string;
  Time: string;
}
