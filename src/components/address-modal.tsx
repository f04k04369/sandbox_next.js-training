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
import { AddressSuggestion } from "@/types";
import { AlertCircle, LoaderCircle, MapPin } from "lucide-react";
import { selectSuggestionAction } from "@/app/(private)/actions/addressActions";
import useSWR from "swr";

export default function AddressModal() {
  const [inputText, setInputText] = useState("");

  const [sessionToken, setSessionToken] = useState("");
  useEffect(() => {
    setSessionToken(uuidv4());
  }, []);

  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
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
      const data: AddressSuggestion[] = await response.json();
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

  const fetcher = (url:string) => fetch(url).then((res) => res.json());

  const { data, error, isLoading:loading } = useSWR(`/api/address`, fetcher);
  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  const handleSelectSuggestion = async (suggestion: AddressSuggestion) => {
    try {
      await selectSuggestionAction(suggestion, sessionToken);
      setSessionToken(uuidv4());
    } catch (error) {
      console.error(error);
      alert("予期せぬエラーが発生しました");
    }
    // serverActions呼び出し
  };

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
                <CommandEmpty>
                  <div className="flex items-center justify-center">
                    {isLoading ? (
                      <LoaderCircle className="animate-spin" />
                    ) : errorMessage ? (
                      <div className="flex items-center text-destructive gap-2">
                        <AlertCircle />
                        <p>{errorMessage}</p>
                      </div>
                    ) : (
                      "住所が見つかりません"
                    )}
                  </div>
                </CommandEmpty>
                {suggestions.map((suggestion) => (
                  <CommandItem
                    onSelect={() => handleSelectSuggestion(suggestion)}
                    key={suggestion.placeId}
                    className="p-5"
                  >
                    <MapPin />
                    <div>
                      <p className="font-bold">{suggestion.placeName}</p>
                      <p className="text-muted-foreground">
                        {suggestion.address_text}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </>
            ) : (
              // 登録済み住所
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
