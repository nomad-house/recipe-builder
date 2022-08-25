import { EventMeta } from "@trusted-resources/contracts";

export interface IpfsMeta {
  cid: string;
  body?: any;
}

export interface EventDetails extends Omit<EventMeta, "cid"> {
  ipfs: IpfsMeta;
  highlight?: boolean;
}
