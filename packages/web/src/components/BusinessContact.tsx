'use client';

import { PhoneIcon, EnvelopeIcon, GlobeAltIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { type BusinessContact as BusinessContactType, type BusinessLocation } from '@/lib/api';

interface BusinessContactProps {
  contact: BusinessContactType;
  location?: BusinessLocation;
  locale: 'en' | 'zh';
}

export function BusinessContact({ contact, location, locale }: BusinessContactProps) {
  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleDirections = () => {
    if (location) {
      const address = `${location.addressLines.join(', ')}, ${location.city}, ${location.state} ${location.zip}`;
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Contact Information
      </h3>

      <div className="space-y-4">
        {/* Phone */}
        {contact.phone && (
          <div className="flex items-center">
            <PhoneIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <button
              onClick={() => handleCall(contact.phone!)}
              className="ml-3 text-chinese-red-600 hover:text-chinese-red-700 transition-colors"
            >
              {contact.phone}
            </button>
          </div>
        )}

        {/* Email */}
        {contact.email && (
          <div className="flex items-center">
            <EnvelopeIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <button
              onClick={() => handleEmail(contact.email!)}
              className="ml-3 text-chinese-red-600 hover:text-chinese-red-700 transition-colors"
            >
              {contact.email}
            </button>
          </div>
        )}

        {/* Website */}
        {contact.website && (
          <div className="flex items-center">
            <GlobeAltIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <a
              href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 text-chinese-red-600 hover:text-chinese-red-700 transition-colors"
            >
              Visit Website
            </a>
          </div>
        )}

        {/* Address */}
        {location && (
          <div className="flex items-start">
            <MapPinIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <div className="text-gray-700">
                {location.addressLines.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
                <div>
                  {location.city}, {location.state} {location.zip}
                </div>
              </div>
              <button
                onClick={handleDirections}
                className="mt-2 text-chinese-red-600 hover:text-chinese-red-700 transition-colors text-sm"
              >
                Get Directions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}