import mapboxgl from 'mapbox-gl';

interface Company {
  name: string;
  coordinates: [number, number];
  industry: string;
}

const industryIcons: { [key: string]: string } = {
  Technology: '/icons/tech.svg',
  Finance: '/icons/finance.svg',
  Retail: '/icons/retail.svg',
  Healthcare: '/icons/healthcare.svg',
  Education: '/icons/education.svg',
};

/**
 * createMarker
 * Adds a custom marker to a Mapbox map using company info and industry icon.
 */
export function createMarker(map: mapboxgl.Map, company: Company) {
  const markerElement = document.createElement('div');
  markerElement.className = 'custom-marker';

  markerElement.innerHTML = `
    <img src="${industryIcons[company.industry] || '/icons/default.svg'}" 
    alt="${company.industry}" width="40" height="40" />
  `;

  new mapboxgl.Marker(markerElement)
    .setLngLat(company.coordinates)
    .setPopup(new mapboxgl.Popup().setHTML(`<h3>${company.name}</h3><p>${company.industry}</p>`))
    .addTo(map);
}
