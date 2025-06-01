import React from "react";
import { TextEffect } from "../components/motion-primitives/text-effect";
import SubdomainForm from "@/components/subdomain-form";
import { redis } from "@/lib/redis";
import { protocol, rootDomain } from "@/lib/utils";
import Link from "next/link";

export default async function Page() {
  const keys = await redis.keys("subdomain:*");
  const values = await redis.mget<{ createdAt: number }[]>(...keys);

  const items = keys.map((key, index) => ({
    key: key.replace("subdomain:", ""),
    ...values[index],
  }));

  console.log(items);
  return (
    <div className="w-full flex flex-col">
      <div className="w-full max-w-xl mx-auto px-2 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <TextEffect per="char" preset="fade" className="text-3xl font-bold">
            Multi Tenant App
          </TextEffect>
        </div>
        <SubdomainForm />
        <ul>
          {items.map((item) => (
            <li
              key={item.key}
              className="border-b last:border-b-0 p-4 cursor-pointer"
            >
              <Link href={`${protocol}://${item.key}.${rootDomain}`}>
                {item.key}
              </Link>
              <div className="flex items-center justify-between mt-2">
                <Link
                  href={`${protocol}://${item.key}.${rootDomain}`}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  {item.key + "." + rootDomain}
                </Link>
                {item.createdAt ? (
                  <span className="text-sm text-muted-foreground">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Deleting...
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
