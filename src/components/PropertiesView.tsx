import React, { useState, useRef } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Globe,
  HardDrive,
  Image as ImageIcon,
  Check,
  RefreshCw
} from 'lucide-react';
import { Property } from '../types';
import { sunsetImg, chalalaImg, riversideImg, gardenImg } from '../initialData';

interface PropertiesViewProps {
  properties: Property[];
  onAddProperty: (newProp: Omit<Property, 'id'>) => void;
  onUpdateProperty: (prop: Property) => void;
  onDeleteProperty: (id: number) => void;
}

export const PropertiesView: React.FC<PropertiesViewProps> = ({
  properties,
  onAddProperty,
  onUpdateProperty,
  onDeleteProperty
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProp, setEditingProp] = useState<Property | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lusaka');
  const [province, setProvince] = useState('Lusaka');
  const [propertyType, setPropertyType] = useState<Property['propertyType']>('Apartment');
  const [monthlyRent, setMonthlyRent] = useState(4500);
  const [status, setStatus] = useState<Property['status']>('Occupied');
  const [description, setDescription] = useState('Modern apartments with 2 bedrooms, close to town.');
  const [photo, setPhoto] = useState<string>(sunsetImg);

  // Image Upload Mode: 'local' | 'online' | 'preset'
  const [imageMode, setImageMode] = useState<'local' | 'online' | 'preset'>('local');
  const [onlineUrl, setOnlineUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onlinePresets = [
    { label: 'Modern Villa', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80' },
    { label: 'Urban Apartment', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80' },
    { label: 'Townhouse', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' },
    { label: 'Executive Residence', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (PNG, JPG, WEBP).');
        return;
      }
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyOnlineUrl = () => {
    if (onlineUrl.trim()) {
      setPhoto(onlineUrl.trim());
    }
  };

  const openAdd = () => {
    setName('Sunset Apartments');
    setAddress('Plot 123, Lusaka');
    setCity('Lusaka');
    setProvince('Lusaka');
    setPropertyType('Apartment');
    setMonthlyRent(4500);
    setStatus('Occupied');
    setDescription('Modern apartments with 2 bedrooms, close to town.');
    setPhoto(sunsetImg);
    setEditingProp(null);
    setShowAddModal(true);
  };

  const openEdit = (prop: Property) => {
    setEditingProp(prop);
    setName(prop.name);
    setAddress(prop.address);
    setCity(prop.city);
    setProvince(prop.province);
    setPropertyType(prop.propertyType);
    setMonthlyRent(prop.monthlyRent);
    setStatus(prop.status);
    setDescription(prop.description);
    setPhoto(prop.photo);
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProp) {
      onUpdateProperty({
        ...editingProp,
        name,
        address,
        city,
        province,
        propertyType,
        monthlyRent: Number(monthlyRent),
        status,
        description,
        photo
      });
    } else {
      onAddProperty({
        name,
        address,
        city,
        province,
        propertyType,
        monthlyRent: Number(monthlyRent),
        status,
        description,
        photo
      });
    }
    setShowAddModal(false);
  };

  const filtered = properties.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.propertyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Properties</h1>
          <p className="text-sm text-slate-500">Manage real estate listings, unit rents, and occupancy</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm shadow-blue-600/30 transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Property</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filter Top Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="text-xs text-slate-400">
            {filtered.length} properties listed
          </div>
        </div>

        {/* Properties Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Photo</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Rent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Photo */}
                  <td className="py-3 px-4">
                    <img
                      src={prop.photo}
                      alt={prop.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-10 object-cover rounded-md border border-slate-200 shadow-2xs"
                    />
                  </td>
                  {/* Name */}
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {prop.name}
                  </td>
                  {/* Address */}
                  <td className="py-3 px-4 text-slate-600">
                    {prop.address}
                  </td>
                  {/* Type */}
                  <td className="py-3 px-4 text-slate-600">
                    {prop.propertyType}
                  </td>
                  {/* Monthly Rent */}
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                    ZMW {prop.monthlyRent.toLocaleString()}
                  </td>
                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    {prop.status === 'Occupied' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Occupied
                      </span>
                    )}
                    {prop.status === 'Vacant' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        Vacant
                      </span>
                    )}
                    {prop.status === 'Maintenance' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                        Maintenance
                      </span>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(prop)}
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"
                        title="Edit Property"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${prop.name}?`)) {
                            onDeleteProperty(prop.id);
                          }
                        }}
                        className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete Property"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>Showing 1 to {filtered.length} of {properties.length} properties</div>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 text-[11px]">
              &lt;
            </button>
            <button className="px-2.5 py-1 rounded bg-blue-600 text-white font-medium text-[11px]">
              1
            </button>
            <button className="px-2 py-1 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 text-[11px]">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Add Property (Form) matching Screen 4 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingProp ? 'Edit Property' : 'Add Property'}
                </h2>
                <p className="text-xs text-slate-500">
                  Fill in property specifications, rental price, and photos
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Property Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Property Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sunset Apartments"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Plot 123, Lusaka"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Lusaka"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Province */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Province *
                  </label>
                  <input
                    type="text"
                    required
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder="Lusaka"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Property Type *
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Bedsitter">Bedsitter</option>
                  </select>
                </div>

                {/* Monthly Rent */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Monthly Rent (ZMW) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    placeholder="4500"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Occupied">Occupied</option>
                    <option value="Vacant">Vacant</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                {/* Image Upload Source Tabs */}
                <div className="sm:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      House / Property Image *
                    </label>
                    <span className="text-[11px] text-slate-400">Choose image from device or online</span>
                  </div>

                  {/* Mode Selector Tabs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setImageMode('local')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        imageMode === 'local'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>From Local Storage</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('online')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        imageMode === 'online'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Online Image (URL)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('preset')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        imageMode === 'preset'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Curated Presets</span>
                    </button>
                  </div>

                  {/* MODE 1: Local Storage Upload */}
                  {imageMode === 'local' && (
                    <div className="space-y-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/40 rounded-xl p-5 text-center cursor-pointer transition-colors group"
                      >
                        <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-600 mx-auto mb-2 transition-colors" />
                        <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                          Click to Browse & Upload Image from Local Storage
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Supports PNG, JPG, JPEG, WEBP files from your computer or phone
                        </p>
                        {uploadedFileName && (
                          <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200">
                            <Check className="w-3 h-3" />
                            <span>Uploaded: {uploadedFileName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* MODE 2: Online Image URL */}
                  {imageMode === 'online' && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="url"
                            value={onlineUrl}
                            onChange={(e) => setOnlineUrl(e.target.value)}
                            placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleApplyOnlineUrl}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                        >
                          Apply URL
                        </button>
                      </div>

                      {/* Quick Online Image Presets */}
                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                          Or select a high-resolution online architectural style:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {onlinePresets.map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => {
                                setOnlineUrl(preset.url);
                                setPhoto(preset.url);
                              }}
                              className={`p-2 rounded-lg border text-left text-[11px] transition-all cursor-pointer flex items-center justify-between ${
                                photo === preset.url
                                  ? 'border-blue-500 bg-blue-50/60 font-bold text-blue-700 ring-1 ring-blue-500'
                                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <span className="truncate">{preset.label}</span>
                              {photo === preset.url && <Check className="w-3 h-3 text-blue-600 shrink-0 ml-1" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODE 3: Curated Architectural Presets */}
                  {imageMode === 'preset' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: 'sunset', label: 'Sunset Apartments', img: sunsetImg },
                        { id: 'chalala', label: 'Chalala House', img: chalalaImg },
                        { id: 'riverside', label: 'Riverside Flats', img: riversideImg },
                        { id: 'garden', label: 'Garden Villas', img: gardenImg }
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setPhoto(item.img)}
                          className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                            photo === item.img
                              ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <img src={item.img} alt={item.label} className="w-full h-20 object-cover" />
                          <div className="p-1.5 text-[10px] font-semibold text-slate-800 bg-white truncate text-center">
                            {item.label}
                          </div>
                          {photo === item.img && (
                            <div className="absolute top-1 right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-sm">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Real-time Photo Preview Card */}
                  <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <img
                      src={photo}
                      alt="Property Preview"
                      className="w-24 h-20 object-cover rounded-lg border border-slate-200 shadow-sm shrink-0"
                    />
                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Active Property Image Preview</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        Source: {photo.startsWith('data:') ? 'Local file uploaded' : photo.startsWith('http') ? 'Online Web URL' : 'PRMS System Asset'}
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] text-blue-600 hover:underline font-semibold"
                      >
                        Change Image &rarr;
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Modern apartments with 2 bedrooms, close to town."
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-600/30 transition-colors"
                >
                  Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
