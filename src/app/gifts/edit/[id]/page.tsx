"use client";
import GiftForm from "@/components/GiftForm.client";
import { FormSkeleton } from "@/components/Loaders.server";
import { useAuthContext } from "@/context/AuthContext";
import { auth, getGiftById, updateGift } from "@/lib/firebase";
import { type Gift } from "@/types";
import { type Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Page({ params }: { params: Params }) {
  const [gift, setGift] = useState<Gift | null>(null);

  const router = useRouter();

  const { loading, user } = useAuthContext();

  useEffect(() => {
    (async () => {
      if (!loading) {
        const data = await getGiftById(auth.currentUser?.uid!, params.id);
        setGift(data);
      }
    })();
  }, [loading, params.id, user?.uid]);

  const handleUpdateGift = useCallback(
    async (gift: Gift) => {
      await updateGift(user?.uid as string, gift);

      router.push("/expenses");
    },
    [router, user?.uid]
  );

  if (loading || !gift) {
    return (
      <section className="center">
        <FormSkeleton />
      </section>
    );
  }

  return (
    <>
      <h1 className="text-lg font-semibold">Editing gift</h1>
      <GiftForm submitHandler={handleUpdateGift} defaultValues={gift} />
    </>
  );
}
