import { Route53 } from "aws-sdk";

const route53 = new Route53({ region: process.env.REGION || "us-east-1" });

export const normalizeDomain = (domain: string) =>
  domain
    .toLowerCase()
    .split(".")
    .filter(zone => !!zone)
    .join(".");

export const getHostedZoneId = async ({
  rootDomain
}: {
  rootDomain: string;
}): Promise<string | undefined> => {
  const hostedZone = await route53.listHostedZonesByName({ DNSName: rootDomain }).promise();
  const { Id } =
    hostedZone.HostedZones.find(
      ({ Name }) =>
        normalizeDomain(Name).includes(normalizeDomain(rootDomain)) ||
        normalizeDomain(rootDomain).includes(normalizeDomain(Name))
    ) || {};
  return Id ? Id.split("/")[2] : undefined;
};
