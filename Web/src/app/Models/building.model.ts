export interface BuildingModel {
  id: string;
  name: string;
  image: string;
}
export interface BUpgradeModel {
  _RequiredBuilding: number;
  _RequiredLevel: number;
  _RequiredGold: number;
  _RequiredElixr: number;
  _RequiredGem: number;
  _GoldRate: number;
  _ElixrRate: number;
  _GemReward: number;
  _Time: number;
}
