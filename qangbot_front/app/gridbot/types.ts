export interface Bot {
  name: string;
  id: number;
  contractName: string;
  exchangeName: string;
  status: boolean,
  interval : number
}

export type BotList = Bot[]
