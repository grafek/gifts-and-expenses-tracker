"use client";

import withAuth from "@/hoc/withAuth";

const GiftsList: React.FC = () => {
  return (
    <ul>
      <li>gift 1</li>
      <li>gift 2</li>
      <li>gift 3</li>
      <li>gift 4</li>
      <li>gift 5</li>
    </ul>
  );
};

GiftsList.displayName = "Gifts Tracker";

export default withAuth(GiftsList);
