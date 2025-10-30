import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CountryMinimal, StateMinimal, CityMinimal } from "@/types/api/companies";
import { getCountries, getStates, getCities } from "@/api/companies";

interface LocationFilterProps {
  selectedCountry: number | null;
  selectedState: number | null;
  selectedCity: number | null;
  onLocationChange: (country: number | null, state: number | null, city: number | null) => void;
  className?: string;
}

export default function LocationFilter({
  selectedCountry,
  selectedState,
  selectedCity,
  onLocationChange,
  className,
}: LocationFilterProps) {
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState<CountryMinimal[]>([]);
  const [states, setStates] = useState<StateMinimal[]>([]);
  const [cities, setCities] = useState<CityMinimal[]>([]);
  const [loading, setLoading] = useState(false);

  // Load countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await getCountries();
        setCountries(data);
      } catch (error) {
        console.error("Failed to load countries:", error);
      }
    };
    loadCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const loadStates = async () => {
        setLoading(true);
        try {
          const data = await getStates(selectedCountry);
          setStates(data);
          setCities([]); // Clear cities when country changes
        } catch (error) {
          console.error("Failed to load states:", error);
        } finally {
          setLoading(false);
        }
      };
      loadStates();
    } else {
      setStates([]);
      setCities([]);
    }
  }, [selectedCountry]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedState) {
      const loadCities = async () => {
        setLoading(true);
        try {
          const data = await getCities(selectedState);
          setCities(data);
        } catch (error) {
          console.error("Failed to load cities:", error);
        } finally {
          setLoading(false);
        }
      };
      loadCities();
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const handleCountrySelect = (countryId: number) => {
    onLocationChange(countryId, null, null);
  };

  const handleStateSelect = (stateId: number) => {
    onLocationChange(selectedCountry, stateId, null);
  };

  const handleCitySelect = (cityId: number) => {
    onLocationChange(selectedCountry, selectedState, cityId);
  };

  const handleClear = () => {
    onLocationChange(null, null, null);
  };

  const getSelectedLocationText = () => {
    if (selectedCity) {
      const city = cities.find(c => c.id === selectedCity);
      return city?.name;
    }
    if (selectedState) {
      const state = states.find(s => s.id === selectedState);
      return state?.name;
    }
    if (selectedCountry) {
      const country = countries.find(c => c.id === selectedCountry);
      return country?.name;
    }
    return "Select location...";
  };

  const selectedCountryData = countries.find(c => c.id === selectedCountry);
  const selectedStateData = states.find(s => s.id === selectedState);
  const selectedCityData = cities.find(c => c.id === selectedCity);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Location</label>
        {(selectedCountry || selectedState || selectedCity) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-6 px-2 text-xs"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className={cn(
              "truncate",
              !selectedCountry && !selectedState && !selectedCity && "text-muted-foreground"
            )}>
              {getSelectedLocationText()}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <div className="max-h-60 overflow-auto">
            {/* Countries */}
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Countries</div>
              {countries.map((country) => (
                <div
                  key={country.id}
                  className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm cursor-pointer"
                  onClick={() => handleCountrySelect(country.id)}
                >
                  <span className="text-sm">{country.name}</span>
                </div>
              ))}
            </div>

            {/* States */}
            {selectedCountry && (
              <div className="p-2 border-t">
                <div className="text-xs font-medium text-muted-foreground mb-2 px-2">States</div>
                {loading ? (
                  <div className="p-2 text-sm text-muted-foreground">Loading...</div>
                ) : states.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No states available</div>
                ) : (
                  states.map((state) => (
                    <div
                      key={state.id}
                      className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm cursor-pointer"
                      onClick={() => handleStateSelect(state.id)}
                    >
                      <span className="text-sm">{state.name}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Cities */}
            {selectedState && (
              <div className="p-2 border-t">
                <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Cities</div>
                {loading ? (
                  <div className="p-2 text-sm text-muted-foreground">Loading...</div>
                ) : cities.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No cities available</div>
                ) : (
                  cities.map((city) => (
                    <div
                      key={city.id}
                      className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm cursor-pointer"
                      onClick={() => handleCitySelect(city.id)}
                    >
                      <span className="text-sm">{city.name}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected location badges */}
      <div className="flex flex-wrap gap-1">
        {selectedCountryData && (
          <Badge
            variant="secondary"
            className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
            onClick={() => onLocationChange(null, null, null)}
          >
            {selectedCountryData.name}
            <X className="h-3 w-3 ml-1" />
          </Badge>
        )}
        {selectedStateData && (
          <Badge
            variant="secondary"
            className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
            onClick={() => onLocationChange(selectedCountry, null, null)}
          >
            {selectedStateData.name}
            <X className="h-3 w-3 ml-1" />
          </Badge>
        )}
        {selectedCityData && (
          <Badge
            variant="secondary"
            className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
            onClick={() => onLocationChange(selectedCountry, selectedState, null)}
          >
            {selectedCityData.name}
            <X className="h-3 w-3 ml-1" />
          </Badge>
        )}
      </div>
    </div>
  );
}
