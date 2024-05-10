export interface Bot {
  name: string;
  id: number;
  contractName: string;
  exchangeName: string;
}

export type BotList = Bot[]