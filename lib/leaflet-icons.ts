import L from "leaflet";
import MarkerLogo from "@/app/assets/location-marker.webp"

// فیکس آیکون پیش‌فرض Leaflet در Next.js (وگرنه عکس مارکر نمایش داده نمی‌شه)
export const defaultMarkerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// مارکر کاربر: دایره‌ی آبی با آدمک سفید داخلش
const personSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
       viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
  </svg>
`;

export const userMarkerIcon = L.divIcon({
  className: "", // کلاس پیش‌فرض Leaflet (پس‌زمینه سفید) رو حذف می‌کنه
  html: `
    <div style="
      width:40px;height:40px;border-radius:50%;
      background:#000000;border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,.35);
      display:flex;align-items:center;justify-content:center;">
      ${personSvg}
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20], // مرکز دایره روی مختصات
});