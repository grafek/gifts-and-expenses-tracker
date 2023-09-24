import withAuth from "@/hoc/withAuth";
import { Spinner } from "./Loaders.server";
import Button from "./Button.client";
import Input from "./Input.client";
import { type Gift } from "@/types";
import { useCallback, useState } from "react";
import { DATETIME_FORMATTER } from "@/globals";

type GiftFormProps = {
  submitHandler: (gift: Gift) => Promise<void>;
  defaultValues?: Gift;
};

const INITIAL_GIFT: Gift = {
  name: "",
  giver: "",
  receiver: "",
  date: new Date().toISOString().slice(0, 10),
};
const MAX_GIFTNAME_LENGTH = 40;

const GiftForm: React.FC<GiftFormProps> = ({
  submitHandler,
  defaultValues,
}) => {
  const [gift, setGift] = useState<Gift>(defaultValues ?? INITIAL_GIFT);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (event: any) => {
      event.preventDefault();
      setError(null);

      const giftDate = DATETIME_FORMATTER.format(new Date(gift.date));

      if (gift.name.trim().length < 1) {
        setError("Name cannot be empty!");
        return;
      } else if (gift.name.trim().length > MAX_GIFTNAME_LENGTH) {
        setError(
          `Name cannot be longer than ${MAX_GIFTNAME_LENGTH} characters!`,
        );
        return;
      } else if (gift.giver.trim().length < 1) {
        setError("Giver cannot be empty!");
        return;
      } else if (gift.receiver.trim().length < 1) {
        setError("Receiver cannot be empty!");
        return;
      }
      setLoading(true);

      await submitHandler({ ...gift, date: giftDate });

      setGift(INITIAL_GIFT);
    },
    [gift, submitHandler],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-xl flex-col gap-4 py-6"
    >
      <div className="relative">
        <Input
          required
          type="text"
          name="name"
          value={gift.name}
          error={error}
          labelname="Gift"
          onChange={(e) => {
            setGift({ ...gift, name: e.target.value });
            setError(null);
          }}
        />
        <span
          className={`absolute bottom-1 right-2 text-xs ${
            gift.name.trim().length > MAX_GIFTNAME_LENGTH
              ? "text-red-600"
              : "text-[#888]"
          }`}
        >
          {gift.name.trim().length}/{MAX_GIFTNAME_LENGTH}
        </span>
      </div>
      <div className="relative">
        <Input
          required
          type="text"
          name="giver"
          labelname="Giver"
          error={error}
          value={gift.giver}
          onChange={(e) => {
            setGift({ ...gift, giver: e.target.value });
            setError(null);
          }}
        />
      </div>
      <div className="relative">
        <Input
          required
          type="text"
          name="receiver"
          labelname="Receiver"
          error={error}
          value={gift.receiver}
          onChange={(e) => {
            setGift({ ...gift, receiver: e.target.value });
            setError(null);
          }}
        />
      </div>
      <div className="relative">
        <Input
          required
          type="date"
          name="date"
          labelname="Date"
          error={error}
          onClick={(e) => e.currentTarget.showPicker()}
          value={new Date(gift.date).toISOString().slice(0, 10)}
          onChange={(e) => {
            setGift({
              ...gift,
              date: new Date(e.target.value).toISOString().slice(0, 10),
            });
            setError(null);
          }}
        />
      </div>

      <Button
        type="submit"
        title="submit"
        disabled={loading ? true : false}
        className="btn-primary mx-auto mt-2 flex w-fit items-center gap-3"
      >
        <span className="flex-1">Submit</span>
        {loading ? <Spinner /> : null}
      </Button>
      {error && (
        <p className="text-red-600" role="alert">
          {error}
        </p>
      )}
    </form>
  );
};

export default withAuth(GiftForm);
