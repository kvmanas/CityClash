export interface UserModel {
  _Towns: Array<string>;
  _GemsCount: number;
  Owner: Array<string>;
}
export interface SellOrders {
  Town: string;
  Seller: string;
  Buyer: string;
  TownIndex: number;
  SellPrice: BigInteger;
  SellIndex: number;
}
