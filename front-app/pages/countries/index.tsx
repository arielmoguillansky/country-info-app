import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Country {
  countryCode: string;
  name: string;
}

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/get-countries", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((err) => console.error(err));
  }, []);

  if (countries.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-[24px]">
        No countries found
      </div>
    );
  }

  const handleClick = (countryCode: string) => {
    router.push(`/country/${countryCode}`);
  };

  return (
    <div className="overflow-x-auto">
      <h1 className="mx-auto w-fit text-[48px] uppercase p-8">
        List of Countries
      </h1>
      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
        <thead className="ltr:text-left rtl:text-right">
          <tr>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Code
            </th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Name
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {countries &&
            countries.map((country) => (
              <tr
                key={country.countryCode}
                className="odd:bg-gray-50 cursor-pointer hover:bg-slate-300"
                onClick={() => handleClick(country.countryCode)}
              >
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {country.countryCode}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {country.name}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
