export type Message = {
  id: number;
  username: string;
  body: string;
  createdAt: Date;
};

export type MessageCreate = {
  username: string;
  body: string;
};
