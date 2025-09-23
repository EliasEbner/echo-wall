export type Message = {
  id: number;
  username: string;
  body: string;
  createdAt: string;
};

export type MessageCreate = {
  username: string;
  body: string;
};
