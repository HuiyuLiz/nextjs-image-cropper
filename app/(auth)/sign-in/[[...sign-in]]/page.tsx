import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-lvh w-full items-center justify-center">
      <SignIn />;
    </div>
  );
}
