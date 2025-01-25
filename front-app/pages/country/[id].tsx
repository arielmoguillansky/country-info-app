import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
interface Country {
  borders: {
    countryCode: string;
    officialName: string;
    region: string;
  }[];
  commonName: string;
  countryCode: string;
  officialName: string;
  population: {
    populationCounts: {
      year: number;
      value: number;
    }[];
  };
  flag: {
    flag: string;
  };
}

export default function CountryList() {
  const [countryInfo, setCountryInfo] = useState<Country>();
  const [chartLabels, setChartLabels] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady || !router.query.id) {
      return;
    }
    fetch("/api/get-country-info", {
      method: "POST",
      body: JSON.stringify({
        countryId: router?.query?.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
        setChartLabels(data.population.populationCounts.map((x) => x.year));
      })
      .catch((err) => console.error(err));
  }, [router.isReady, router.query]);

  if (!countryInfo || Object.keys(countryInfo).length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-[24px]">
        No country found
      </div>
    );
  }

  const handleClick = (countryCode: string) => {
    router.push(`/country/${countryCode}`);
  };

  const labels = chartLabels;
  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: labels.map((x) => {
          const o = countryInfo.population.populationCounts.find(
            (y) => y.year === x
          );
          return o?.value || 0;
        }),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Population over time",
      },
    },
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center gap-x-6 justify-center p-12">
        <h1 className="text-[48px] uppercase w-fit">
          {countryInfo?.officialName}
        </h1>
        <div className="relative w-14 h-10">
          <Image
            src={countryInfo?.flag?.flag}
            alt={`${countryInfo?.officialName}'s flag`}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
      <div className="mb-12">
        <h2 className="text-[32px] mb-6">Borders</h2>
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Code
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Official Name
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Region
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {countryInfo.borders &&
              countryInfo.borders.map((country) => (
                <tr
                  key={country.countryCode}
                  className="odd:bg-gray-50 cursor-pointer hover:bg-slate-300"
                  onClick={() => handleClick(country.countryCode)}
                >
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    {country.countryCode}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {country.officialName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {country.region}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2 className="text-[32px] mb-6">Population Chart</h2>
        <Line options={options} data={data} />
      </div>
    </div>
  );
}
