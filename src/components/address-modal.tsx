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
import { Address, AddressSuggestion } from "@/types";
import { AlertCircle, LoaderCircle, MapPin, Trash2 } from "lucide-react";
import {
  deleteAddressAction,
  selectAddressAction,
  selectSuggestionAction,
} from "@/app/(private)/actions/addressActions";
import useSWR from "swr";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface AddressResponse {
  addressList: Address[];
  selectedAddress: Address | null;
}

export default function AddressModal() {
  const [inputText, setInputText] = useState("");

  const [sessionToken, setSessionToken] = useState("");
  useEffect(() => {
    setSessionToken(uuidv4());
  }, []);

  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
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

  const fetcher = async (url: string) => {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.error);
    }

    const data = await response.json();

    return data;
  };

  const {
    data,
    error,
    isLoading: loading,
    mutate,
  } = useSWR<AddressResponse>(`/api/address`, fetcher);

  console.log("swrdata", data);

  if (error) {
    console.error("error", error);
  }

  const triggerLabel = loading
    ? "読み込み中..."
    : error
      ? "住所を取得できません"
      : (data?.selectedAddress?.name ?? "住所を選択");

  const handleSelectSuggestion = async (suggestion: AddressSuggestion) => {
    try {
      await selectSuggestionAction(suggestion, sessionToken);
      setSessionToken(uuidv4());

      setInputText("");

      await mutate();

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("予期せぬエラーが発生しました");
    }
    // serverActions呼び出し
  };

  const handleSelectAddress = async (address: Address) => {
    // alert("address");
    try {
      await selectAddressAction(address.id);
      await mutate(
        (current) =>
          current
            ? { ...current, selectedAddress: address }
            : { addressList: [address], selectedAddress: address },
        { revalidate: true },
      );
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("予期せぬエラーが発生しました");
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    console.log("addressId", addressId);
    const ok = window.confirm("住所を削除しますか？");
    if (!ok) return;
    try {
      const selectedAddressId = data?.selectedAddress?.id;
      await deleteAddressAction(addressId);
      mutate();

      if (selectedAddressId === addressId) {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      alert("予期せぬエラーが発生しました");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{triggerLabel}</DialogTrigger>
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
                {data?.addressList.map((address) => (
                  <CommandItem
                    key={address.id}
                    onSelect={() => handleSelectAddress(address)}
                    className={cn(
                      "p-5 justify-between items-center",
                      address.id === data?.selectedAddress?.id && "bg-muted",
                    )}
                  >
                    <div>
                      <p className="font-bold">{address.name}</p>
                      <p>{address.address_text}</p>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(address.id);
                      }}
                      size={"icon"}
                      variant={"ghost"}
                    >
                      <Trash2 />
                    </Button>
                  </CommandItem>
                ))}
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
