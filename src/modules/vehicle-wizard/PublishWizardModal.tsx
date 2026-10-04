/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Wizard de Publicación de Vehículos: Validación de Specs, Carga Múltiple de Fotos, Reordenamiento y Video
 */

import React, { useState } from 'react';
import { Vehicle, PlanTier } from '../../types/marketplace';
import { PUBLICATION_PLANS } from '../../data/mockVehicles';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Car,
  Settings,
  ShieldCheck,
  Camera,
  CreditCard,
  Upload,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Star,
  Video,
  FileText,
  AlertCircle,
} from 'lucide-react';
import sedanDefault from '../../assets/images/sedan_luxury_car_1791075158268.jpg';
import suvDefault from '../../assets/images/suv_family_car_1791075168415.jpg';
import pickupDefault from '../../assets/images/pickup_truck_car_1791075178393.jpg';

interface PublishWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishVehicle: (newVehicle: Partial<Vehicle>) => void;
}

interface UploadedPhoto {
  id: string;
  url: string;
  name: string;
  sizeBytes: number;
  isPrimary: boolean;
}

export const PublishWizardModal: React.FC<PublishWizardModalProps> = ({
  isOpen,
  onClose,
  onPublishVehicle,
}) => {
  if (!isOpen) return null;

  const [currentStep, setCurrentStep] = useState(1);

  // Paso 1: Básicos & Clasificación
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('Corolla Cross');
  const [version, setVersion] = useState('2.0 XEI CVT');
  const [year, setYear] = useState(2023);
  const [bodyType, setBodyType] = useState<'SUV' | 'Sedán' | 'Hatchback' | 'Pick-up'>('SUV');
  const [city, setCity] = useState('Santiago');
  const [color, setColor] = useState('Blanco Glaciar');

  // Paso 2: Especificaciones Técnicas
  const [mileageKm, setMileageKm] = useState(24500);
  const [fuelType, setFuelType] = useState<'Gasolina' | 'Diésel' | 'Híbrido' | 'Eléctrico'>('Gasolina');
  const [transmission, setTransmission] = useState<'Automática' | 'Manual' | 'CVT' | 'Doble Embrague'>('CVT');
  const [traction, setTraction] = useState<'4x2' | '4x4' | 'AWD' | 'FWD' | 'RWD'>('FWD');
  const [doors, setDoors] = useState(5);
  const [passengers, setPassengers] = useState(5);
  const [engine, setEngine] = useState('2.0L Dynamic Force 4 Cil.');
  const [horsepower, setHorsepower] = useState(170);
  const [plateSnippet, setPlateSnippet] = useState('ST-19-42');
  const [vinSnippet, setVinSnippet] = useState('9BRB83HE...4419');

  // Paso 3: Equipamiento, Video & Descripción
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=sample');
  const [description, setDescription] = useState(
    'Único dueño, impecable estado de conservación con mantenciones estrictas en concesionario oficial Toyota. Sin siniestros, neumáticos al 90% y documentación al día.'
  );
  const availableFeatures = [
    'Apple CarPlay y Android Auto inalámbrico',
    'Cámara de retroceso y sensores de estacionamiento',
    'Control de crucero adaptativo y frenado autónomo',
    'Climatizador digital automático',
    'Techo solar eléctrico',
    'Llantas de aleación de 18 pulgadas',
    '7 Airbags (frontales, laterales, cortina y rodilla)',
    'Frenos de disco en las 4 ruedas con ABS y EBD',
  ];
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Apple CarPlay y Android Auto inalámbrico',
    'Cámara de retroceso y sensores de estacionamiento',
    '7 Airbags (frontales, laterales, cortina y rodilla)',
  ]);

  // Paso 4: Fotos con Validación y Reordenamiento
  const [photos, setPhotos] = useState<UploadedPhoto[]>([
    { id: 'p-1', url: suvDefault, name: 'frontal_tres_cuartos.webp', sizeBytes: 1840000, isPrimary: true },
    { id: 'p-2', url: sedanDefault, name: 'lateral_derecho.webp', sizeBytes: 2150000, isPrimary: false },
    { id: 'p-3', url: pickupDefault, name: 'habitaculo_interior.webp', sizeBytes: 1980000, isPrimary: false },
  ]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Paso 5: Precio y Plan de Visibilidad
  const [priceUsd, setPriceUsd] = useState(25900);
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('destacado');
  const [isSuccess, setIsSuccess] = useState(false);

  // Manejo de Fotos (Validación, Subida, Reordenamiento y Principal)
  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSizeBytes = 10 * 1024 * 1024; // 10 MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!allowedTypes.includes(file.type)) {
        setUploadError(`Formato no permitido en ${file.name}. Solo se aceptan JPG, PNG o WebP.`);
        return;
      }
      if (file.size > maxSizeBytes) {
        setUploadError(`El archivo ${file.name} excede el tamaño máximo permitido de 10 MB.`);
        return;
      }
    }

    // Agregar simulación de imágenes optimizadas
    const newItems: UploadedPhoto[] = Array.from(files).map((f, idx) => ({
      id: `p-${Date.now()}-${idx}`,
      url: suvDefault,
      name: f.name,
      sizeBytes: f.size,
      isPrimary: photos.length === 0 && idx === 0,
    }));

    setPhotos((prev) => [...prev, ...newItems]);
  };

  const handleSetPrimaryPhoto = (id: string) => {
    setPhotos((prev) =>
      prev.map((p) => ({ ...p, isPrimary: p.id === id }))
    );
  };

  const handleMovePhoto = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    setPhotos((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length > 0 && !filtered.some((p) => p.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const toggleFeature = (feat: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat]
    );
  };

  const handleFinish = () => {
    const primaryPhoto = photos.find((p) => p.isPrimary)?.url || photos[0]?.url || suvDefault;
    const sortedImageUrls = [primaryPhoto, ...photos.filter((p) => p.url !== primaryPhoto).map((p) => p.url)];

    const newVehicleData: Partial<Vehicle> = {
      title: `${make} ${model} ${version}`,
      make,
      model,
      version,
      year,
      priceUsd,
      mileageKm,
      fuelType,
      transmission,
      bodyType,
      doors,
      passengers,
      engine,
      horsepower,
      traction,
      color,
      city,
      region: 'Metropolitana',
      images: sortedImageUrls,
      videos: videoUrl
        ? [{ id: 'vid-new', url: videoUrl, provider: 'youtube', title: `Tour ${make} ${model}` }]
        : [],
      documentation: [
        { id: 'doc-1', name: 'Certificado de Anotaciones Vigentes (CAV)', type: 'padron', status: 'al_dia', verifiedAt: '2026-10-03' },
        { id: 'doc-2', name: 'Revisión Técnica y Gases', type: 'revision_tecnica', status: 'vigente', verifiedAt: '2026-09-20' },
      ],
      historyLogs: [
        { id: 'h-1', date: `${year}-03-15`, title: 'Inscripción y entrega en concesionario', mileageKm: 0, description: 'Vehículo cero kilómetro', verifiedBy: 'Concesionario Oficial' },
        { id: 'h-2', date: '2024-05-10', title: 'Mantención de kilometraje', mileageKm: mileageKm, description: 'Inspección de fluidos y frenos', verifiedBy: 'Taller Homologado' },
      ],
      features: selectedFeatures,
      description,
      status: 'publicado',
      plan: selectedPlan,
      planExpiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      inspectionScore: 95,
      inspectionItems: [
        { id: 'chk-1', category: 'Motor y Transmisión', item: 'Presión de compresión y turbo', status: 'passed' },
        { id: 'chk-2', category: 'Frenos y Suspensión', item: 'Espesor de pastillas y discos (95%)', status: 'passed' },
        { id: 'chk-3', category: 'Carrocería y Pintura', item: 'Pintura original sin repintados', status: 'passed' },
        { id: 'chk-4', category: 'Legal y Documentación', item: 'Libre de prendas, multas y gravámenes', status: 'passed' },
      ],
      viewsCount: 1,
      leadsCount: 0,
      publishedAt: new Date().toISOString().split('T')[0],
      isFeatured: selectedPlan !== 'free',
      vinSnippet,
      plateSnippet,
      seller: {
        name: 'AutoCenter Los Andes',
        type: 'concesionaria',
        rating: 4.9,
        totalReviews: 84,
        isVerified: true,
        phone: '+56 9 8452 1190',
        city,
      },
    };

    onPublishVehicle(newVehicleData);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* CABECERA CON STEPPER */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
              Asistente de Publicación de Vehículo
            </span>
            <h3 className="font-display font-bold text-lg text-slate-900">
              Paso {currentStep} de 5:{' '}
              {currentStep === 1 && 'Identificación y Clasificación'}
              {currentStep === 2 && 'Especificaciones Técnicas'}
              {currentStep === 3 && 'Equipamiento y Video'}
              {currentStep === 4 && 'Galería y Fotos'}
              {currentStep === 5 && 'Precio y Plan'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="bg-amber-500 h-1 transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        {/* CONTENIDO DEL PASO */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {isSuccess ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-display font-bold text-xl text-slate-900">
                ¡Vehículo Registrado Exitosamente!
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Las fotografías han sido optimizadas en formato WebP con relación de aspecto preservada y el vehículo ya se encuentra indexado en el catálogo.
              </p>
            </div>
          ) : (
            <>
              {/* PASO 1: IDENTIFICACIÓN Y CLASIFICACIÓN */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Marca *</label>
                      <input
                        type="text"
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Modelo *</label>
                      <input
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Versión</label>
                      <input
                        type="text"
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Año Modelo *</label>
                      <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Carrocería *</label>
                      <select
                        value={bodyType}
                        onChange={(e) => setBodyType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer"
                      >
                        <option value="SUV">SUV</option>
                        <option value="Sedán">Sedán</option>
                        <option value="Pick-up">Pick-up</option>
                        <option value="Hatchback">Hatchback</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Ciudad de Ubicación *</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Color Exterior *</label>
                      <input
                        type="text"
                        placeholder="Ej: Blanco Glaciar, Gris Grafito"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 2: ESPECIFICACIONES TÉCNICAS REQUERIDAS */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Motor (Cilindrada / Configuración) *</label>
                      <input
                        type="text"
                        placeholder="Ej: 2.0L Turbo 4 Cilindros"
                        value={engine}
                        onChange={(e) => setEngine(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Potencia (HP / CV) *</label>
                      <input
                        type="number"
                        placeholder="Ej: 170"
                        value={horsepower}
                        onChange={(e) => setHorsepower(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Kilometraje Real *</label>
                      <input
                        type="number"
                        value={mileageKm}
                        onChange={(e) => setMileageKm(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Número de Puertas *</label>
                      <select
                        value={doors}
                        onChange={(e) => setDoors(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer"
                      >
                        <option value={2}>2 puertas</option>
                        <option value={3}>3 puertas</option>
                        <option value={4}>4 puertas</option>
                        <option value={5}>5 puertas</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Número de Pasajeros *</label>
                      <select
                        value={passengers}
                        onChange={(e) => setPassengers(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer"
                      >
                        <option value={2}>2 pasajeros</option>
                        <option value={4}>4 pasajeros</option>
                        <option value={5}>5 pasajeros</option>
                        <option value={7}>7 pasajeros</option>
                        <option value={8}>8 pasajeros</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Combustible *</label>
                      <select
                        value={fuelType}
                        onChange={(e) => setFuelType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer"
                      >
                        <option value="Gasolina">Gasolina</option>
                        <option value="Diésel">Diésel</option>
                        <option value="Híbrido">Híbrido</option>
                        <option value="Eléctrico">Eléctrico</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Transmisión *</label>
                      <select
                        value={transmission}
                        onChange={(e) => setTransmission(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer"
                      >
                        <option value="Automática">Automática</option>
                        <option value="Manual">Manual</option>
                        <option value="CVT">CVT</option>
                        <option value="Doble Embrague">Doble Embrague</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Tracción *</label>
                      <select
                        value={traction}
                        onChange={(e) => setTraction(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer"
                      >
                        <option value="4x2">4x2</option>
                        <option value="4x4">4x4</option>
                        <option value="AWD">AWD</option>
                        <option value="FWD">FWD</option>
                        <option value="RWD">RWD</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Patente / Placa</label>
                      <input
                        type="text"
                        value={plateSnippet}
                        onChange={(e) => setPlateSnippet(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Chasis / VIN (17 caracteres)</label>
                      <input
                        type="text"
                        value={vinSnippet}
                        onChange={(e) => setVinSnippet(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 3: EQUIPAMIENTO, VIDEO Y DESCRIPCIÓN */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">
                      Equipamiento y Confort Incluido
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availableFeatures.map((f) => (
                        <label
                          key={f}
                          className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFeatures.includes(f)}
                            onChange={() => toggleFeature(f)}
                            className="w-4 h-4 text-amber-600 rounded border-slate-300"
                          />
                          <span className="text-slate-800">{f}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-amber-600" />
                      Enlace de Video Tour (YouTube o Vimeo)
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Descripción Comercial Detallada *
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs resize-none"
                    />
                  </div>
                </div>
              )}

              {/* PASO 4: FOTOGRAFÍAS CON VALIDACIÓN, PRINCIPAL Y REORDENAMIENTO */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  {/* Zona de Carga Arrastrar y Soltar */}
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50/60 space-y-2 relative">
                    <Upload className="w-8 h-8 text-amber-600 mx-auto" />
                    <h4 className="text-xs font-semibold text-slate-800">
                      Carga Múltiple de Fotografías Vehiculares
                    </h4>
                    <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                      Formatos permitidos: JPG, PNG, WebP. Tamaño máx: 10 MB por foto. Las imágenes se procesan a WebP y se distribuyen vía CDN Cloudflare sin deformar la relación de aspecto.
                    </p>

                    <label className="inline-block mt-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-700 cursor-pointer shadow-xs">
                      Seleccionar Archivos de Imagen
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleSimulatedUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {uploadError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* Lista de Fotos con Controles de Reordenamiento y Foto Principal */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{photos.length} Fotografías cargadas (arrastra o usa flechas para ordenar)</span>
                      <span className="text-amber-700 font-medium">Haz clic en la estrella para definir la foto principal</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {photos.map((photo, index) => (
                        <div
                          key={photo.id}
                          className={`relative rounded-xl border-2 overflow-hidden bg-slate-900 flex flex-col group ${
                            photo.isPrimary ? 'border-amber-500 shadow-sm' : 'border-slate-200'
                          }`}
                        >
                          {/* Contenedor de Imagen sin deformar */}
                          <div className="relative aspect-[4/3] flex items-center justify-center bg-slate-950">
                            <img
                              src={photo.url}
                              alt={photo.name}
                              className="w-full h-full object-contain"
                            />
                            {photo.isPrimary && (
                              <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" /> Principal
                              </span>
                            )}
                          </div>

                          {/* Barra de Controles de la Foto */}
                          <div className="p-2 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryPhoto(photo.id)}
                              className={`p-1 rounded cursor-pointer ${
                                photo.isPrimary ? 'text-amber-500 font-bold' : 'text-slate-400 hover:text-amber-500'
                              }`}
                              title="Establecer como foto principal"
                            >
                              <Star className={`w-4 h-4 ${photo.isPrimary ? 'fill-current' : ''}`} />
                            </button>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleMovePhoto(index, 'left')}
                                disabled={index === 0}
                                className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                                title="Mover hacia la izquierda"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMovePhoto(index, 'right')}
                                disabled={index === photos.length - 1}
                                className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                                title="Mover hacia la derecha"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeletePhoto(photo.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Eliminar imagen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 5: PRECIO Y PLANES */}
              {currentStep === 5 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Precio de Venta Contado (USD) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400">$</span>
                      <input
                        type="number"
                        value={priceUsd}
                        onChange={(e) => setPriceUsd(Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">
                      Selecciona el Plan de Visibilidad para este Vehículo
                    </label>
                    <div className="space-y-3">
                      {PUBLICATION_PLANS.map((plan) => (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan.id)}
                          className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                            selectedPlan === plan.id
                              ? 'border-amber-500 bg-amber-50/40 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 text-xs">{plan.name}</span>
                              {plan.isPopular && (
                                <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.5 rounded">
                                  Recomendado
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500">
                              Vigencia de {plan.durationDays} días · Hasta {plan.photoLimit} fotos · S3 + Cloudflare CDN
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="font-display font-bold text-sm text-slate-900 font-mono">
                              {plan.priceUsd === 0 ? 'Gratis' : `$${plan.priceUsd} USD`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* BOTONES DE NAVEGACIÓN DEL WIZARD */}
        {!isSuccess && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className={`px-4 py-2 text-xs font-medium rounded-lg flex items-center gap-1 cursor-pointer ${
                currentStep === 1 ? 'opacity-40 cursor-not-allowed text-slate-400' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>

            {currentStep < 5 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
              >
                Siguiente <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> Publicar con Todos los Requerimientos
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
