import { buttonVariants } from "@/components/ui/button";
import { redis } from "@/lib/redis";
import { protocol, rootDomain } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;

  return {
    title: `${subdomain}`,
    description: `Subdomain page for ${subdomain}.${rootDomain}`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const subdomainData = await redis.get(`subdomain:${subdomain}`);

  if (!subdomainData) return notFound();

  return (
    <div className="w-full flex flex-col">
      <div className="w-full max-w-xl mx-auto px-2 py-8 space-y-6">
        <Link
          href={`${protocol}://${rootDomain}`}
          className={buttonVariants({ size: "icon" })}
        >
          <ArrowLeft />
        </Link>
        <h1 className="text-3xl font-bold">
          Welcome to {subdomain}.{rootDomain}
        </h1>
      </div>
    </div>
  );
}
