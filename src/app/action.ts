/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { redis } from "@/lib/redis";
import { protocol, rootDomain } from "@/lib/utils";
import { redirect } from "next/navigation";


export async function createSubdomainAction(state: any, formData: FormData) {
  const subdomain = formData.get('subdomain') as string

  if (!subdomain) {
    return {
      success: false,
      message: 'Invalid subdomain'
    }
  }

  const validateSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

  if (subdomain !== validateSubdomain) {
    return {
      success: false,
      message:
        'A subdomain may only include lowercase letters, numbers, and hyphens. Please enter a valid one.'
    };
  }

  const subdomainAlreadyExists = await redis.get(`subdomain:${validateSubdomain}`)

  if (subdomainAlreadyExists) {
    return {
      success: false,
      message: 'Subdomain already exists'
    }
  }

  await redis.set(`subdomain:${subdomain}`, {
    createdAt: Date.now(),
  });

  await redis.expire(`subdomain:${subdomain}`, 10)
  redirect(`${protocol}://${subdomain}.${rootDomain}`);
}