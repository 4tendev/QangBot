

export interface Grid {
  id: number;
  buy : number,
  sell : number
  size : number,
  nextPosition : number,
  status : number,

}
export interface Bot {
  name: string;
  id: number;
  contractName: string;
  exchangeName: string;
  status: boolean,
  interval : number,
  accountName : string,
  grids : Grid[]
}


