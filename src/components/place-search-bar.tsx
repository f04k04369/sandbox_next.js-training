"use client";
import React, { useEffect, useState, useRef } from "react";
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
import {
  AlertCircle,
  LoaderCircle,
  MapPinIcon,
  SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface PlaceSearchBarProps {
  lat: number;
  lng: number;
}

export default function PlaceSearchBar({lat, lng}: PlaceSearchBarProps) {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  useEffect(() => {
    setSessionToken(uuidv4());
  }, []);
  const [suggestions, setSuggestions] = useState<RestaurantSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const clickedOnItem = useRef(false);
  const router = useRouter();

  const fetchSuggestions = useDebouncedCallback(async (input: string) => {
    if (!input.trim() || !sessionToken) {
      setSuggestions([]);
      return;
    }
    console.log(input);
    setErrorMessage(null);
    try {
      const response = await fetch(
        `/api/restaurant/autocomplete?input=${input}&sessionToken=${sessionToken}&lat=${lat}&lng=${lng}`,
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
    if (!sessionToken) return;
    setIsLoading(true);
    setOpen(true);
    fetchSuggestions(inputText);
  }, [inputText, sessionToken]);

  const handleBlur = () => {
    if (clickedOnItem.current) {
      clickedOnItem.current = false;
      return;
    }
    setOpen(false);
  };
  const handleFocus = () => {
    if (inputText) {
      setOpen(true);
    }
  };

  const handleSelectSuggestion = (suggestion: RestaurantSuggestion) => {
    console.log("suggestion", suggestion);
    setOpen(false);

    if (suggestion.type === "placePrediction") {
      if (suggestion.placeId) {
        router.push(
          `/restaurant/${suggestion.placeId}?sessionToken=${sessionToken}`,
        );
      }
      setSessionToken(uuidv4());
    } else if (suggestion.query.trim()) {
      router.push(
        `/search?restaurant=${encodeURIComponent(suggestion.query.trim())}`,
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    setOpen(false);
    if (!inputText.trim()) {
      setOpen(false);
      router.push("/");
      return;
    }

    router.push(`/search?restaurant=${encodeURIComponent(inputText.trim())}`);
  };

  return (
    <Command className="overflow-visible bg-muted" shouldFilter={false}>
      <CommandInput
        value={inputText}
        placeholder="Type a command or search..."
        className=""
        onValueChange={setInputText}
        onKeyDown={handleKeyDown}
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
                <CommandItem
                  key={value}
                  value={value}
                  className="p-5"
                  onSelect={() => handleSelectSuggestion(suggestion)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    clickedOnItem.current = true;
                  }}
                >
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
