export type Currency = "NGN" | "GBP" | "USD";

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  NGN: {
    code: "NGN",
    symbol: "₦",
    name: "Nigerian Naira",
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
  },
};

export const detectUserCurrency = async (): Promise<Currency> => {
  try {
    // Try to detect country from timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Nigeria timezones
    if (timezone.includes("Africa/Lagos")) {
      return "NGN";
    }
    
    // UK timezones
    if (timezone.includes("Europe/London")) {
      return "GBP";
    }

    // Try to get more accurate location using IP geolocation API
    const response = await fetch("https://ipapi.co/json/");
    if (response.ok) {
      const data = await response.json();
      const country = data.country_code;
      
      if (country === "NG") return "NGN";
      if (country === "GB") return "GBP";
    }
  } catch (error) {
    console.error("Error detecting currency:", error);
  }

  // Default to USD for rest of the world
  return "USD";
};

export const formatCurrency = (amount: number, currency: Currency): string => {
  const currencyInfo = CURRENCIES[currency];
  return `${currencyInfo.symbol}${amount.toLocaleString()}`;
};

export const getProductPrice = (
  product: any,
  currency: Currency
): number | null => {
  switch (currency) {
    case "NGN":
      return product.price_ngn;
    case "GBP":
      return product.price_gbp;
    case "USD":
      return product.price_usd;
    default:
      return product.price_usd || product.price_ngn || product.price_gbp;
  }
};
