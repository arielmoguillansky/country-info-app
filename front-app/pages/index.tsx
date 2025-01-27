import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-[24px] md:text-[48px] mb-8">Country App</h1>
      <Link
        className="rounded-sm border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        href="countries"
      >
        List of Countries
      </Link>
    </div>
  );
}
