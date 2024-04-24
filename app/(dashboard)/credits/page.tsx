import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import BreadCrumb from "@/components/breadcrumb";
import Checkout from "@/components/shared/checkout";
import { Heading } from "@/components/ui/heading";
import { plans } from "@/constants/data";
import { getUserById } from "@/lib/actions/user.actions";

const breadcrumbItems = [{ title: "Credits", link: "/credits" }];
export default async function page() {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <Heading
          title={"Credits"}
          description={
            "Start with a free plan and upgrade as you grow. All plans include unlimited team members."
          }
        />
        <section className="w-full py-12">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
            <div className="mx-auto grid max-w-sm gap-4 sm:max-w-none sm:grid-cols-3 lg:gap-6 xl:grid-cols-3">
              {plans.map((plan) => (
                <div
                  className="divide-y overflow-hidden rounded-lg border dark:divide-gray-700"
                  key={plan._id}
                >
                  <div className="space-y-4 p-4 sm:p-6">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <h4 className="text-2xl font-bold">${plan.price}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {plan.credits} credits
                    </p>
                    <div>
                      {plan.inclusions.map((inclusion) => (
                        <div
                          className="my-4 flex items-center space-x-2 text-sm  dark:text-gray-400"
                          key={inclusion.label}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>{inclusion.label}</div>
                        </div>
                      ))}
                    </div>
                    <Checkout
                      plan={plan.name}
                      amount={plan.price}
                      credits={plan.credits}
                      buyerId={user._id}
                    ></Checkout>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
