"use client";
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { v4 as uuidv4 } from "uuid";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { RestaurantSuggestion } from "@/types";
import { AlertCircle, LoaderCircle, MapPinIcon, SearchIcon } from "lucide-react";

export default function PlaceSearchBar() {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [sessionToken, setSessionToken] = useState(uuidv4());
  const [suggestions, setSuggestions] = useState<RestaurantSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fetchSuggestions = useDebouncedCallback(async (input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }
    console.log(input);
    setErrorMessage(null);
    try {
      const response = await fetch(
        `/api/restaurant/autocomplete?input=${input}&sessionToken=${sessionToken}`,
      );
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        return;
      }
      const data: RestaurantSuggestion[] = await response.json();
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
      setOpen(false);
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    setIsLoading(true);
    setOpen(true);
    fetchSuggestions(inputText);
  }, [inputText]);
  const handleBlur = () => {
    setOpen(false);
  };
  const handleFocus = () => {
    if (inputText) {
      setOpen(true);
    }
  };

  return (
    <Command className="overflow-visible bg-muted" shouldFilter={false}>
      <CommandInput
        value={inputText}
        placeholder="Type a command or search..."
        className=""
        onValueChange={setInputText}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      {open && (
        <div className="relative">
          <CommandList className="absolute bg-background w-full shadow-md rounded-lg">
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
                  "レストランが見つかりません"
                )}
              
              </div>
            </CommandEmpty>
            {suggestions.map((suggestion, index) => {
              const label =
                suggestion.type === "placePrediction"
                  ? suggestion.placeName
                  : suggestion.query;
              const value =
                suggestion.type === "placePrediction"
                  ? (suggestion.placeId ?? `place-${index}`)
                  : suggestion.query;

              return (
                <CommandItem key={value} value={value} className="p-5">
                  {suggestion.type === "queryPrediction" ? (
                    <SearchIcon />
                  ) : (
                    <MapPinIcon />
                  )}
                  <p>{label}</p>
                </CommandItem>
              );
            })}
          </CommandList>
        </div>
      )}
    </Command>
  );
}
