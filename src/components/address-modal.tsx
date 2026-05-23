"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";
export default function AddressModal() {
  const [inputText, setInputText] = useState("");

  return (
    <Dialog>
      <DialogTrigger>住所を選択</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>住所</DialogTitle>
          <DialogDescription className="sr-only">
            住所登録と選択
          </DialogDescription>
        </DialogHeader>
        <Command shouldFilter={false} className="max-w-sm rounded-lg border">
          <div className="bg-muted mb-4">
            <CommandInput
              value={inputText}
              onValueChange={setInputText}
              placeholder="Type a command or search..."
            />
          </div>
          <CommandList>
            {inputText ? (
              <>
                // サジェスチョン表示
                <CommandEmpty>No results found.</CommandEmpty>
                <div>サジェスチョン表示</div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-2">保存済みの住所</h3>
                <CommandItem className="p-5">Calendar</CommandItem>
                <CommandItem className="p-5">Search Emoji</CommandItem>
                <CommandItem className="p-5">Calculator</CommandItem>
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
