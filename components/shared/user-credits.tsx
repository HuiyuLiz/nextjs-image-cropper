import { auth } from "@clerk/nextjs";

import { getUserById } from "@/lib/actions/user.actions";

import { Button } from "../ui/button";

export default async function UserCredits() {
  const { userId } = auth();

  const user = await getUserById(userId as string);

  return (
    <div>
      <Button variant={"outline"}>Credit : {user?.creditBalance}</Button>
    </div>
  );
}
