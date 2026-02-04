import { useState, useMemo, useEffect, useRef } from "react";
import {
  Smartphone,
  Laptop,
  Battery,
  Cable,
  Headphones,
  Tablet,
  Watch,
  HardDrive,
  MapPin,
  Navigation,
  Filter,
  List,
  Map as MapIcon,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Search,
  LocateFixed,
} from "lucide-react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

interface Bin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  acceptedItems: string[];
  fillLevel: number;
  status: "operational" | "full" | "maintenance";
  distance?: number;
}

const BINS: Bin[] = [
  { id: 'mh-1', name: 'Mumbai E-Tech Hub', lat: 19.0760, lng: 72.8777, address: 'Andheri East, Mumbai, MH', acceptedItems: ['phone', 'battery', 'charger'], fillLevel: 35, status: 'operational' },
  { id: 'mh-2', name: 'BKC Green Bin', lat: 19.0600, lng: 72.8697, address: 'BKC, Mumbai, MH', acceptedItems: ['laptop', 'hard-drive'], fillLevel: 55, status: 'operational' },
  { id: 'mh-3', name: 'Navi Mumbai Recycle Point', lat: 19.0330, lng: 73.0297, address: 'Vashi, Navi Mumbai, MH', acceptedItems: ['phone', 'tablet'], fillLevel: 80, status: 'full' },
  { id: 'mh-4', name: 'Pune IT Park Bin', lat: 18.5204, lng: 73.8567, address: 'Hinjewadi, Pune, MH', acceptedItems: ['battery', 'cable', 'charger'], fillLevel: 20, status: 'operational' },
  { id: 'mh-5', name: 'Nagpur Eco Drop', lat: 21.1458, lng: 79.0882, address: 'Sitabuldi, Nagpur, MH', acceptedItems: ['phone', 'watch'], fillLevel: 40, status: 'operational' },
  { id: 'mh-6', name: 'Nashik Digital Bin', lat: 19.9975, lng: 73.7898, address: 'College Road, Nashik, MH', acceptedItems: ['laptop', 'charger'], fillLevel: 60, status: 'operational' },
  { id: 'mh-7', name: 'Aurangabad E-Waste Hub', lat: 19.8762, lng: 75.3433, address: 'CIDCO, Aurangabad, MH', acceptedItems: ['tablet', 'battery'], fillLevel: 25, status: 'operational' },
  { id: 'mh-8', name: 'Thane Smart Bin', lat: 19.2183, lng: 72.9781, address: 'Ghodbunder Rd, Thane, MH', acceptedItems: ['phone', 'headphones'], fillLevel: 70, status: 'operational' },
  { id: 'mh-9', name: 'Kolhapur E-Recycle', lat: 16.7050, lng: 74.2433, address: 'Shivaji Nagar, Kolhapur, MH', acceptedItems: ['cable', 'charger'], fillLevel: 15, status: 'operational' },
  { id: 'mh-10', name: 'Solapur Green Tech Bin', lat: 17.6599, lng: 75.9064, address: 'Station Rd, Solapur, MH', acceptedItems: ['battery', 'watch'], fillLevel: 90, status: 'full' },
  { id: 'ka-1', name: 'Bangalore Central Bin', lat: 12.9716, lng: 77.5946, address: 'MG Road, Bengaluru, KA', acceptedItems: ['phone', 'laptop'], fillLevel: 30, status: 'operational' },
  { id: 'ka-2', name: 'Electronic City E-Hub', lat: 12.8399, lng: 77.6770, address: 'Electronic City, KA', acceptedItems: ['hard-drive', 'cable'], fillLevel: 45, status: 'operational' },
  { id: 'ka-3', name: 'Whitefield Smart Bin', lat: 12.9698, lng: 77.7500, address: 'Whitefield, Bengaluru, KA', acceptedItems: ['tablet', 'charger'], fillLevel: 60, status: 'operational' },
  { id: 'ka-4', name: 'Mysore Digital Drop', lat: 12.2958, lng: 76.6394, address: 'VV Mohalla, Mysuru, KA', acceptedItems: ['phone', 'battery'], fillLevel: 20, status: 'operational' },
  { id: 'ka-5', name: 'Hubli Eco Bin', lat: 15.3647, lng: 75.1240, address: 'Keshwapur, Hubli, KA', acceptedItems: ['laptop', 'watch'], fillLevel: 50, status: 'operational' },
  { id: 'ka-6', name: 'Mangalore E-Waste Point', lat: 12.9141, lng: 74.8560, address: 'Hampankatta, Mangalore, KA', acceptedItems: ['phone', 'headphones'], fillLevel: 65, status: 'operational' },
  { id: 'ka-7', name: 'Belgaum Green Tech', lat: 15.8497, lng: 74.4977, address: 'Tilakwadi, Belgaum, KA', acceptedItems: ['battery', 'charger'], fillLevel: 10, status: 'operational' },
  { id: 'ka-8', name: 'Davangere E-Bin', lat: 14.4644, lng: 75.9218, address: 'PJ Extension, Davangere, KA', acceptedItems: ['tablet', 'cable'], fillLevel: 75, status: 'operational' },
  { id: 'ka-9', name: 'Udupi Smart Recycle', lat: 13.3409, lng: 74.7421, address: 'Manipal Rd, Udupi, KA', acceptedItems: ['phone', 'watch'], fillLevel: 40, status: 'operational' },
  { id: 'ka-10', name: 'Tumkur E-Drop', lat: 13.3392, lng: 77.1130, address: 'BH Road, Tumkur, KA', acceptedItems: ['laptop', 'battery'], fillLevel: 85, status: 'full' },
  { id: 'dl-1', name: 'Connaught Place Green Bin', lat: 28.6139, lng: 77.2090, address: 'CP, New Delhi, DL', acceptedItems: ['phone', 'charger'], fillLevel: 25, status: 'operational' },
  { id: 'dl-2', name: 'Dwarka E-Waste Hub', lat: 28.5921, lng: 77.0460, address: 'Sector 10, Dwarka, DL', acceptedItems: ['laptop', 'battery'], fillLevel: 55, status: 'operational' },
  { id: 'dl-3', name: 'Rohini Smart Bin', lat: 28.7490, lng: 77.0565, address: 'Sector 3, Rohini, DL', acceptedItems: ['tablet', 'cable'], fillLevel: 40, status: 'operational' },
  { id: 'dl-4', name: 'Saket Digital Drop', lat: 28.5244, lng: 77.2066, address: 'Saket, New Delhi, DL', acceptedItems: ['phone', 'watch'], fillLevel: 15, status: 'operational' },
  { id: 'dl-5', name: 'Karol Bagh E-Bin', lat: 28.6512, lng: 77.1900, address: 'Karol Bagh, DL', acceptedItems: ['battery', 'headphones'], fillLevel: 70, status: 'operational' },
  { id: 'dl-6', name: 'Lajpat Nagar Eco Point', lat: 28.5672, lng: 77.2436, address: 'Lajpat Nagar, DL', acceptedItems: ['charger', 'cable'], fillLevel: 60, status: 'operational' },
  { id: 'dl-7', name: 'Pitampura Green Tech', lat: 28.7033, lng: 77.1322, address: 'Pitampura, DL', acceptedItems: ['phone', 'tablet'], fillLevel: 35, status: 'operational' },
  { id: 'dl-8', name: 'Janakpuri E-Recycle', lat: 28.6219, lng: 77.0878, address: 'Janakpuri, DL', acceptedItems: ['laptop', 'hard-drive'], fillLevel: 90, status: 'full' },
  { id: 'dl-9', name: 'Vasant Kunj Smart Bin', lat: 28.5273, lng: 77.1494, address: 'Vasant Kunj, DL', acceptedItems: ['battery', 'watch'], fillLevel: 20, status: 'operational' },
  { id: 'dl-10', name: 'Mayur Vihar Digital Hub', lat: 28.6046, lng: 77.2893, address: 'Mayur Vihar, DL', acceptedItems: ['phone', 'charger'], fillLevel: 45, status: 'operational' },
];

const WASTE_TYPES = [
  { id: 'phone', label: 'Phone', icon: Smartphone, color: 'bg-blue-500' },
  { id: 'laptop', label: 'Laptop', icon: Laptop, color: 'bg-purple-500' },
  { id: 'tablet', label: 'Tablet', icon: Tablet, color: 'bg-indigo-500' },
  { id: 'battery', label: 'Battery', icon: Battery, color: 'bg-green-500' },
  { id: 'cable', label: 'Cable', icon: Cable, color: 'bg-orange-500' },
  { id: 'charger', label: 'Charger', icon: Cable, color: 'bg-yellow-500' },
  { id: 'headphones', label: 'Headphones', icon: Headphones, color: 'bg-pink-500' },
  { id: 'watch', label: 'Watch', icon: Watch, color: 'bg-teal-500' },
  { id: 'hard-drive', label: 'Hard Drive', icon: HardDrive, color: 'bg-red-500' },
];

export function BinFinder() {
  const [selectedWasteType, setSelectedWasteType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("list");
  const [filterOpen, setFilterOpen] = useState(false);
  const [onlyOperational, setOnlyOperational] = useState(true);
  const [maxDistance, setMaxDistance] = useState<number>(50);
  const [highlightedBin, setHighlightedBin] = useState<Bin | null>(null);

  const [locationMode, setLocationMode] = useState<"current" | "search">("search");

  // IMPORTANT CHANGE: start as null
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<L.Map | null>(null);
  const markersGroup = useRef<L.LayerGroup | null>(null);

  const routingControlRef = useRef<any>(null);
  const routeLinesRef = useRef<L.Polyline[]>([]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setHighlightedBin(null);
        },
        () => alert("Unable to retrieve your location")
      );
    }
  };

  const searchLocation = async () => {
    if (!searchInput) return;

    setIsSearching(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}`
      );

      const data = await response.json();

      if (data && data.length > 0) {
        setUserLocation({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        });

        setHighlightedBin(null);
      } else {
        alert("Location not found");
      }
    } catch (error) {
      alert("Error searching location");
    } finally {
      setIsSearching(false);
    }
  };

  const binsWithDistance = useMemo(() => {
    if (!userLocation) return [];

    return BINS.map((bin) => {
      const distance = Math.sqrt(
        Math.pow((bin.lat - userLocation.lat) * 111, 2) +
          Math.pow((bin.lng - userLocation.lng) * 111 * Math.cos((userLocation.lat * Math.PI) / 180), 2)
      );
      return { ...bin, distance };
    });
  }, [userLocation]);

  const filteredBins = useMemo(() => {
    if (!userLocation) return [];

    if (viewMode === "map" && highlightedBin) return [highlightedBin];

    let filtered = binsWithDistance;

    if (selectedWasteType) filtered = filtered.filter((bin) => bin.acceptedItems.includes(selectedWasteType));
    if (onlyOperational) filtered = filtered.filter((bin) => bin.status === "operational");

    filtered = filtered.filter((bin) => bin.distance! <= maxDistance);

    return filtered.sort((a, b) => a.distance! - b.distance!);
  }, [binsWithDistance, selectedWasteType, onlyOperational, maxDistance, highlightedBin, viewMode, userLocation]);

  // Initialize Leaflet Map ONLY when location exists
  useEffect(() => {
    if (!userLocation) return;

    if (viewMode === "map" && mapRef.current && !leafletInstance.current) {
      const center = highlightedBin ? [highlightedBin.lat, highlightedBin.lng] : [userLocation.lat, userLocation.lng];

      leafletInstance.current = L.map(mapRef.current).setView(center as L.LatLngExpression, 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(leafletInstance.current);

      markersGroup.current = L.layerGroup().addTo(leafletInstance.current);
    }

    return () => {
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, [viewMode, highlightedBin, userLocation]);

  // Draw Markers + Route
  useEffect(() => {
    if (!userLocation) return;
    if (!leafletInstance.current || !markersGroup.current) return;

    markersGroup.current.clearLayers();

    if (routingControlRef.current) {
      try {
        leafletInstance.current.removeControl(routingControlRef.current);
      } catch (err) {}
      routingControlRef.current = null;
    }

    if (routeLinesRef.current.length > 0) {
      routeLinesRef.current.forEach((line) => {
        try {
          leafletInstance.current?.removeLayer(line);
        } catch (err) {}
      });
      routeLinesRef.current = [];
    }

    const defaultIcon = L.icon({
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    // User Marker
    L.circleMarker([userLocation.lat, userLocation.lng], {
      radius: 8,
      fillColor: "#3b82f6",
      color: "#fff",
      weight: 3,
      fillOpacity: 1,
    })
      .addTo(markersGroup.current)
      .bindPopup("Your Location");

    // Bin Markers
    filteredBins.forEach((bin) => {
      const marker = L.marker([bin.lat, bin.lng], { icon: defaultIcon })
        .addTo(markersGroup.current!)
        .bindPopup(`<b>${bin.name}</b><br/>${bin.address}<br/><b>${bin.fillLevel}% Full</b>`);

      if (highlightedBin && bin.id === highlightedBin.id) {
        marker.openPopup();

        const router = L.Routing.osrmv1({
          serviceUrl: "https://router.project-osrm.org/route/v1",
          profile: "driving",
        });

        const control = L.Routing.control({
          waypoints: [L.latLng(userLocation.lat, userLocation.lng), L.latLng(bin.lat, bin.lng)],
          router,
          routeWhileDragging: false,
          showAlternatives: true,
          addWaypoints: false,
          collapsible: true,
          createMarker: () => null,
          lineOptions: {
            styles: [],
          },
        }).addTo(leafletInstance.current!);

        routingControlRef.current = control;

        router.route(
          [L.Routing.waypoint(L.latLng(userLocation.lat, userLocation.lng)), L.Routing.waypoint(L.latLng(bin.lat, bin.lng))],
          (err: any, routes: any[]) => {
            if (err || !routes || routes.length === 0) {
              alert("Routing failed.");
              return;
            }

            routes.sort((a, b) => a.summary.totalTime - b.summary.totalTime);
            const shortestRoute = routes[0];

            routes.forEach((route) => {
              const isShortest = route === shortestRoute;

              const line = L.polyline(route.coordinates, {
                color: isShortest ? "#10b981" : "#ef4444",
                weight: isShortest ? 6 : 4,
                dashArray: isShortest ? undefined : "6, 10",
                opacity: 0.9,
              }).addTo(leafletInstance.current!);

              const minutes = Math.round(route.summary.totalTime / 60);

              line.bindTooltip(`🕒 ${minutes} min`, {
                permanent: false,
                direction: "top",
                sticky: true,
                offset: [0, -5],
              });

              routeLinesRef.current.push(line);
            });

            const bounds = L.latLngBounds(shortestRoute.coordinates);
            leafletInstance.current?.fitBounds(bounds, { padding: [40, 40] });
          }
        );
      }
    });
  }, [filteredBins, viewMode, highlightedBin, userLocation]);

  const handleNavigate = (bin: Bin) => {
    setHighlightedBin(bin);
    setViewMode("map");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-600 bg-green-50";
      case "full":
        return "text-orange-600 bg-orange-50";
      case "maintenance":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What do you want to recycle?</h2>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {WASTE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setSelectedWasteType(selectedWasteType === type.id ? null : type.id);
                setHighlightedBin(null);
              }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                selectedWasteType === type.id
                  ? "border-emerald-500 bg-emerald-50 scale-105"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className={`w-12 h-12 ${type.color} rounded-full flex items-center justify-center`}>
                <type.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* LOCATION SELECT BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
        <div className="flex items-center gap-2">
          <MapPin className="text-emerald-600 w-5 h-5" />
          <select
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            value={locationMode}
            onChange={(e) => {
              const val = e.target.value as "current" | "search";
              setLocationMode(val);

              if (val === "current") {
                getCurrentLocation();
              }
            }}
          >
            <option value="search">Search Location</option>
            <option value="current">Current Location</option>
          </select>
        </div>

        {locationMode === "search" && (
          <div className="flex items-center gap-2 w-full md:w-auto flex-1">
            <input
              type="text"
              placeholder="Enter your location..."
              className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchLocation()}
            />
            <button
              onClick={searchLocation}
              disabled={isSearching}
              className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </button>
          </div>
        )}

        {locationMode === "current" && (
          <button
            onClick={getCurrentLocation}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            <LocateFixed className="w-4 h-4" />
            Use Current Location
          </button>
        )}

        {userLocation && (
          <div className="text-xs text-gray-500">
            Showing results near:{" "}
            <span className="font-semibold text-emerald-700">
              {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </span>
          </div>
        )}
      </div>

      {/* PLACEHOLDER BEFORE LOCATION */}
      {!userLocation ? (
        <div className="p-20 text-center border-2 border-dashed border-emerald-200 rounded-2xl text-gray-500 bg-gradient-to-br from-white via-emerald-50 to-white shadow-sm">
          <br></br>
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-5">
            <MapPin className="w-8 h-8 text-emerald-600" />
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2">Enter your location to find nearby bins</h3>

          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
            Choose <span className="font-semibold text-emerald-700">Search Location</span> or{" "}
            <span className="font-semibold text-emerald-700">Current Location</span> to view available e-waste bins near you.
          </p>

          {/* <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setLocationMode("search")}
              className="px-5 py-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition flex items-center justify-center gap-2 font-semibold text-gray-700"
            >
              <Search className="w-4 h-4" /> Search Location
            </button>

            <button
              onClick={() => {
                setLocationMode("current");
                getCurrentLocation();
              }}
              className="px-5 py-3 rounded-xl bg-emerald-600 text-white shadow-md hover:bg-emerald-700 transition flex items-center justify-center gap-2 font-semibold"
            >
              <LocateFixed className="w-4 h-4" /> Use Current Location
            </button>
          </div> */}
        </div>
      ) : (
        <>
          {/* TOP BAR */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-gray-900">
                {highlightedBin ? `Route to ${highlightedBin.name}` : `${filteredBins.length} bins found`}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {highlightedBin && (
                <button
                  onClick={() => setHighlightedBin(null)}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm hover:bg-emerald-100"
                >
                  <RefreshCw className="w-4 h-4" /> Reset View
                </button>
              )}

              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" /> <span className="text-sm">Filter</span>
              </button>

              <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 ${viewMode === "list" ? "bg-emerald-500 text-white" : "text-gray-600"}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`px-4 py-2 ${viewMode === "map" ? "bg-emerald-500 text-white" : "text-gray-600"}`}
                >
                  <MapIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* FILTER PANEL */}
          {filterOpen && (
            <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyOperational}
                  onChange={(e) => setOnlyOperational(e.target.checked)}
                  className="w-4 h-4 text-emerald-600"
                />
                <span className="text-sm text-gray-700">Only show operational bins</span>
              </label>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Search Radius: {maxDistance} km</label>
                <input
                  type="range"
                  min="1"
                  max="500"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>
          )}

          {/* LIST / MAP */}
          {viewMode === "list" ? (
            <div className="space-y-3">
              {filteredBins.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">
                    No bins found within {maxDistance}km. Try increasing radius or changing filters.
                  </p>
                </div>
              ) : (
                filteredBins.map((bin) => (
                  <div
                    key={bin.id}
                    className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{bin.name}</h4>
                        <p className="text-sm text-gray-600 flex items-start gap-1">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {bin.address}
                        </p>
                      </div>

                      <div className="text-right font-bold text-emerald-600">
                        {bin.distance!.toFixed(1)} km{" "}
                        <span className="block text-xs text-gray-500 font-normal">away</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          bin.status
                        )}`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current"></span>
                        {bin.status}
                      </span>

                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${bin.fillLevel}%` }}></div>
                      </div>

                      <span className="text-xs text-gray-600">{bin.fillLevel}%</span>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs text-gray-600 mb-2 font-medium">Accepts:</div>
                      <div className="flex flex-wrap gap-1">
                        {bin.acceptedItems.map((item) => (
                          <span key={item} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                            {WASTE_TYPES.find((t) => t.id === item)?.label || item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleNavigate(bin)}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                      <Navigation className="w-4 h-4" /> Navigate to Bin <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm relative">
              <div ref={mapRef} className="h-[600px] w-full bg-gray-100" style={{ zIndex: 0 }} />

              {highlightedBin && userLocation && (
                <div className="absolute bottom-4 left-4 z-[1000] bg-white p-3 rounded-lg shadow-lg border border-emerald-100 max-w-[250px]">
                  <h4 className="font-bold text-gray-900 text-sm">{highlightedBin.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">{highlightedBin.address}</p>

                  <div
                    className="text-xs font-semibold mb-2"
                    style={{ color: highlightedBin.distance! < 50 ? "#059669" : "#dc2626" }}
                  >
                    Distance: {highlightedBin.distance!.toFixed(1)} km
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setHighlightedBin(null)}
                      className="flex-1 text-xs bg-gray-100 py-1.5 rounded hover:bg-gray-200 font-medium"
                    >
                      Show All
                    </button>

                    <button
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${highlightedBin.lat},${highlightedBin.lng}`
                        )
                      }
                      className="flex-1 text-xs bg-emerald-600 text-white py-1.5 rounded hover:bg-emerald-700 font-medium"
                    >
                      External Directions
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
