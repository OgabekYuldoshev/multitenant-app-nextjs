"use client";

import React, { useActionState } from "react";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { createSubdomainAction } from "@/app/action";
import { Loader2 } from "lucide-react";

interface ActionState {
  success: boolean;
  message: string;
}

export default function SubdomainForm() {
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    createSubdomainAction,
    {
      success: false,
      message: "",
    }
  );

  return (
    <div className="block">
      <form action={action} className="flex items-center gap-2">
        <Input name="subdomain" placeholder="Enter your subdomain..." />
        <Button type="submit" className="shrink-0">
          {isPending && <Loader2 className="animate-spin" />}
          Create
        </Button>
      </form>

      {!state.success && (
        <p className="text-destructive text-sm mt-2">{state.message}</p>
      )}
    </div>
  );
}
