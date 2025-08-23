"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CurrencyData {
  country: string;
  currencyName: string;
  currencyCode: string;
}

const africanCurrencies: CurrencyData[] = [
  { country: "Algeria", currencyName: "Dinar", currencyCode: "DZD" },
  { country: "Angola", currencyName: "Angolan Kwanza", currencyCode: "AOA" },
  { country: "Benin", currencyName: "CFA Franc", currencyCode: "XOF" },
  { country: "Botswana", currencyName: "Pula", currencyCode: "BWP" },
  { country: "Burkina Faso", currencyName: "CFA Franc BCEAO", currencyCode: "XOF" },
  { country: "Burundi", currencyName: "Burundi Franc", currencyCode: "BIF" },
  { country: "Cameroon", currencyName: "CFA Franc BEAC", currencyCode: "XAF" },
  { country: "Cape Verde", currencyName: "Cape Verde Escudo", currencyCode: "CVE" },
  { country: "Central African Republic", currencyName: "CFA Franc BEAC", currencyCode: "XAF" },
  { country: "Chad", currencyName: "CFA Franc BEAC", currencyCode: "XAF" },
  { country: "Comoros", currencyName: "Comoros Franc", currencyCode: "KMF" },
  { country: "Cote d'Ivoire", currencyName: "CFA Franc BCEAO", currencyCode: "XOF" },
  { country: "Democratic Republic of Congo", currencyName: "Francs", currencyCode: "CDF" },
  { country: "Djibouti", currencyName: "Djibouti Franc", currencyCode: "DJF" },
  { country: "Egypt", currencyName: "Pound", currencyCode: "EGP" },
  { country: "Equatorial Guinea", currencyName: "CFA Franc BEAC", currencyCode: "XAF" },
  { country: "Eritrea", currencyName: "Eritrean Nakfa", currencyCode: "ERN" },
  { country: "Eswatini", currencyName: "Lilangeni", currencyCode: "SZL" },
  { country: "Ethiopia", currencyName: "Birr", currencyCode: "ETB" },
  { country: "Gabon", currencyName: "CFA Franc BEAC", currencyCode: "XAF" },
  { country: "Gambia", currencyName: "Dalasi", currencyCode: "GMD" },
  { country: "Ghana", currencyName: "Cedi", currencyCode: "GHS" },
  { country: "Guinea", currencyName: "Franc", currencyCode: "GNF" },
  { country: "Guinea-Bissau", currencyName: "Guinea-Bissau Peso", currencyCode: "GWP" },
  { country: "Kenya", currencyName: "Shillings", currencyCode: "KES" },
  { country: "Lesotho", currencyName: "Loti", currencyCode: "LSL" },
  { country: "Liberia", currencyName: "Dollar", currencyCode: "LRD" },
  { country: "Libya", currencyName: "Dinar", currencyCode: "LYD" },
  { country: "Madagascar", currencyName: "Malagasy Ariary", currencyCode: "MGA" },
  { country: "Malawi", currencyName: "Kwacha", currencyCode: "MWK" },
  { country: "Mali", currencyName: "CFA Franc BCEAO", currencyCode: "XOF" },
  { country: "Mauritania", currencyName: "Ouguiya", currencyCode: "MRO" },
  { country: "Mauritius", currencyName: "Rupees", currencyCode: "MUR" },
  { country: "Morocco", currencyName: "Dirham", currencyCode: "MAD" },
  { country: "Mozambique", currencyName: "Metical", currencyCode: "MZN" },
  { country: "Namibia", currencyName: "Dollar", currencyCode: "NAD" },
  { country: "Niger", currencyName: "CFA Franc BCEAO", currencyCode: "XOF" },
  { country: "Nigeria", currencyName: "Naira", currencyCode: "NGN" },
  { country: "Republic of the Congo", currencyName: "Franc BEAC", currencyCode: "XAF" },
  { country: "Rwanda", currencyName: "Franc", currencyCode: "RWF" },
  { country: "São Tomé and Príncipe", currencyName: "Dobra", currencyCode: "STD" },
  { country: "Senegal", currencyName: "CFA Franc BCEAO", currencyCode: "XOF" },
  { country: "Seychelles", currencyName: "Rupees", currencyCode: "SCR" },
  { country: "Sierra Leone", currencyName: "Leone", currencyCode: "SLL" },
  { country: "Somalia", currencyName: "Shillings", currencyCode: "SOS" },
  { country: "South Africa", currencyName: "Rand", currencyCode: "ZAR" },
  { country: "South Sudan", currencyName: "Pound", currencyCode: "SSP" },
  { country: "Sudan", currencyName: "Pound", currencyCode: "SDG" },
  { country: "Tanzania", currencyName: "Shillings", currencyCode: "TZS" },
  { country: "Togo", currencyName: "CFA Franc BCEAO", currencyCode: "XOF" },
  { country: "Tunisia", currencyName: "Dinar", currencyCode: "TND" },
  { country: "Uganda", currencyName: "Shillings", currencyCode: "UGX" },
  { country: "Zambia", currencyName: "Kwacha", currencyCode: "ZMW" },
  { country: "Zimbabwe", currencyName: "Dollar", currencyCode: "ZWD" },
];

interface CurrencySelectorProps {
  onCurrencyChange: (currencyCode: string) => void;
  defaultValue?: string;
}

export function CurrencySelector({ onCurrencyChange, defaultValue }: CurrencySelectorProps) {
  const [selectedCurrency, setSelectedCurrency] = React.useState<string | undefined>(defaultValue);

  React.useEffect(() => {
    if (selectedCurrency) {
      onCurrencyChange(selectedCurrency);
    }
  }, [selectedCurrency, onCurrencyChange]);

  const handleValueChange = (value: string) => {
    setSelectedCurrency(value);
  };

  return (
    <Select onValueChange={handleValueChange} value={selectedCurrency}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a currency" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>African Currencies</SelectLabel>
          {africanCurrencies.map((data) => (
            <SelectItem key={data.currencyCode} value={data.currencyCode}>
              {data.country} ({data.currencyCode}) - {data.currencyName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
