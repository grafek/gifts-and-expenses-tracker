"use client";

import withAuth from "@/hoc/withAuth";
import Button from "./Button.client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { addGift, auth, getGifts, removeGift } from "@/lib/firebase";
import { type Gift } from "@/types";
import GiftForm from "./GiftForm.client";
import Select from "./Select.client";
import {
  CURRENT_MONTH,
  CURRENT_YEAR,
  DATETIME_FORMATTER,
  MONTHS,
  YEARS,
} from "@/globals";
import Image from "next/image";

const GiftsList: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [gifts, setGifts] = useState<Gift[]>();
  const [showForm, setShowForm] = useState(false);

  const fetchGifts = useCallback(async () => {
    const gifts = await getGifts(auth.currentUser?.uid!);
    setGifts(gifts);
  }, []);

  const handleAddGift = useCallback(async (gift: Gift) => {
    await addGift(auth.currentUser?.uid!, gift);
    const updatedGifts = await getGifts(auth.currentUser?.uid!);
    setGifts(updatedGifts);
    setShowForm(false);
  }, []);

  const handleGiftRemoval = useCallback(async (gift: Gift) => {
    await removeGift(auth.currentUser?.uid!, gift);
    const updatedGifts = await getGifts(auth.currentUser?.uid!);
    setGifts(updatedGifts);
  }, []);

  useEffect(() => {
    fetchGifts();
  }, [fetchGifts]);

  const filteredGifts = useMemo(
    () =>
      gifts?.filter((gift) => {
        if (selectedYear && selectedMonth) {
          return (
            new Date(gift.date).getFullYear().toString() == selectedYear &&
            new Date(gift.date).toLocaleString("default", { month: "short" }) ==
              selectedMonth
          );
        } else if (selectedYear) {
          return new Date(gift.date).getFullYear().toString() == selectedYear;
        } else if (selectedMonth) {
          return (
            new Date(gift.date).toLocaleString("default", { month: "short" }) ==
            selectedYear
          );
        } else {
          return true;
        }
      }),
    [gifts, selectedMonth, selectedYear],
  );

  return (
    <>
      <div className="flex items-center justify-between gap-4 pb-4">
        <div>
          <Button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="btn-transparent flex w-fit items-center gap-2"
          >
            <Image
              src={"/icons/add.svg"}
              alt="add-icon"
              width={24}
              height={24}
            />
            Add Gift
          </Button>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Select
            options={YEARS}
            value={selectedYear}
            onChange={async (e) => {
              setSelectedYear(e.target.value);
            }}
          />
          <Select
            options={MONTHS}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      </div>
      {showForm ? <GiftForm submitHandler={handleAddGift} /> : null}
      {!filteredGifts?.length && !showForm ? (
        <div className="py-4 text-center">
          No gifts recorded for {selectedMonth} {selectedYear}
        </div>
      ) : filteredGifts?.length ? (
        <div className="relative overflow-x-auto rounded-md">
          <table className="w-full table-auto text-sm">
            <thead className="bg-neutral-900/90 text-xs uppercase">
              <tr className="[&>th]:px-6 [&>th]:py-3">
                <th scope="col">Gift</th>
                <th scope="col">Giver</th>
                <th scope="col">Receiver</th>
                <th scope="col">Date</th>
                <th scope="col">Edit</th>
                <th scope="col">Remove</th>
              </tr>
            </thead>
            <tbody>
              {filteredGifts?.map((gift) => (
                <tr
                  className="text-center even:bg-neutral-900/70 hover:bg-neutral-800/70 [&>*]:px-6 [&>*]:py-4 [&>td]:whitespace-nowrap"
                  key={gift.id}
                >
                  <th scope="row" className="font-medium">
                    {gift.name}
                  </th>
                  <td>{gift.giver}</td>
                  <td>{gift.receiver}</td>
                  <td>{DATETIME_FORMATTER.format(new Date(gift?.date))}</td>
                  <td>
                    <Link
                      title={`edit gift ${gift.name}`}
                      href={`/gifts/edit/${gift.id}`}
                      className="flex justify-center transition-transform duration-300 hover:-translate-y-[2px]"
                    >
                      <Image
                        src={"/icons/edit.svg"}
                        alt="edit-icon"
                        width={24}
                        height={24}
                      />
                    </Link>
                  </td>
                  <td>
                    <Button
                      title={`Remove gift: ${gift.name}`}
                      className="mx-auto flex justify-center transition-transform duration-300 hover:-translate-y-[2px]"
                      onClick={() => {
                        handleGiftRemoval(gift);
                      }}
                    >
                      <Image
                        src={"/icons/recycle-bin.svg"}
                        alt="bin-icon"
                        width={20}
                        height={20}
                      />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
};

GiftsList.displayName = "Gifts Tracker";

export default withAuth(GiftsList);
