"use client";
import React, { useEffect } from "react";
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
import { useDebouncedCallback } from "use-debounce";
import { v4 as uuidv4 } from "uuid";

export default function AddressModal() {
  const [inputText, setInputText] = useState("");

  const [sessionToken, setSessionToken] = useState("");
  useEffect(() => {
    setSessionToken(uuidv4());
  }, []);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fetchSuggestions = useDebouncedCallback(async (input: string) => {
    if (!input.trim() || !sessionToken) {
      setSuggestions([]);
      return;
    }
    console.log(input);
    setErrorMessage(null);
    try {
      const response = await fetch(
        `/api/address/autocomplete?input=${input}&sessionToken=${sessionToken}`,
      );
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        return;
      }
      const data = await response.json();
      console.log("data", data);
      setSuggestions(data);
    } catch (error) {
      console.error(error);
      setErrorMessage("予期せぬエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }, 500);
  useEffect(() => {
    if (!inputText.trim()) {
      setSuggestions([]);
      return;
    }
    if (!sessionToken) return;
    setIsLoading(true);
    fetchSuggestions(inputText);
  }, [inputText, sessionToken]);

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
