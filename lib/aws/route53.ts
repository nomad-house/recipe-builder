import { Route53 } from "aws-sdk";

const route53 = new Route53({ region: process.env.REGION || "us-east-1" });

export const normalizeDomain = (domain: string) =>
  domain
    .toLowerCase()
    .split(".")
    .filter(zone => !!zone)
    .join(".");

export const getHostedZoneId = async ({
  domainName
}: {
  domainName: string;
}): Promise<string | undefined> => {
  const hostedZone = await route53.listHostedZonesByName({ DNSName: domainName }).promise();
  const { Id } =
    hostedZone.HostedZones.find(
      ({ Name }) =>
        normalizeDomain(Name).includes(normalizeDomain(domainName)) ||
        normalizeDomain(domainName).includes(normalizeDomain(Name))
    ) || {};
  return Id ? Id.split("/")[2] : undefined;
};
