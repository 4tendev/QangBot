export interface Grid {
  id: number;
  buy: number;
  sell: number;
  size: number;
  nextPosition: number;
  status: number;
}

export interface Contract {
  name: string;
  url: string;
}
export interface Bot {
  name: string;
  id: number;
  contract: Contract;
  lastheck: number;
  exchangeName: string;
  status: boolean;
  interval: number;
  accountName: string;
  grids: Grid[];
  gridsCreationLimit: number;
}
