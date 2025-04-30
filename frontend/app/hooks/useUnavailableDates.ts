import { useEffect, useState } from "react";

interface UseUnavailableDatesProps {
  baseURL: string;
  referenceCode: string;
}

export const useUnavailableDates = ({
  baseURL,
  referenceCode,
}: UseUnavailableDatesProps) => {
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnavailableDates = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseURL}/api/bookings/unavailable-dates/${referenceCode}`
        );
        const result = await response.json();

        if (response.ok) {
          setUnavailableDates(
            Array.isArray(result.unavailableDates)
              ? result.unavailableDates
              : []
          );
        } else {
          console.error("Failed to fetch unavailable dates:", result);
          setError("Failed to fetch unavailable dates.");
        }
      } catch (err) {
        console.error("Error fetching unavailable dates:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchUnavailableDates();
  }, [baseURL, referenceCode]);

  return { unavailableDates, loading, error };
};
