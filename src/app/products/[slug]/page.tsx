'use client';

/**
-- ==============================================================================
-- PAGE 3: PARAMETER-DRIVEN CONFIGURATOR, DESIGNER & CHECKOUT (/products/[slug])
-- Left Column (Live Visual Stage - 3 Tabs: Designer, Upload Artwork, CSV VDP Merge)
-- Right Column (Sticky Configurator & Debounced Live Pricing Card)
-- ==============================================================================
*/

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

import { useCatalogue } from '../../../hooks/useCatalogue';
import { useDesigner } from '../../../hooks/useDesigner';
import { useOrders } from '../../../hooks/useOrders';
import { useAuth } from '../../../hooks/useAuth';
import { ConstrainedCanvas } from '../../../components/designer/ConstrainedCanvas';
import { DesignerToolbar } from '../../../components/designer/DesignerToolbar';
import { ArtworkUploader } from '../../../components/designer/ArtworkUploader';
import { CsvMergePanel } from '../../../components/designer/CsvMergePanel';
import { ProductConfigurator } from '../../../components/catalogue/ProductConfigurator';
import { PriceSummaryCard } from '../../../components/catalogue/PriceSummaryCard';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { CheckCircle2, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { slug } = resolvedParams;

  const { activeProduct, fetchProductBySlug, quote, calculatePrice, loading: catLoading } = useCatalogue();
  const designer = useDesigner();
  const { checkoutOrder, submitting, lastCreatedOrder, lastInitialProof, resetCheckout } = useOrders();
  const { isAuthenticated } = useAuth();

  // Local state
  const [quantity, setQuantity] = useState(100);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderConfirmedOpen, setOrderConfirmedOpen] = useState(false);
  const [designSavedNotice, setDesignSavedNotice] = useState(false);

  // 1. Fetch Product
  useEffect(() => {
    if (slug) {
      fetchProductBySlug(slug).then((res) => {
        if (res?.product) {
          designer.updateDimensions(
            res.product.min_width_mm || 85,
            res.product.min_height_mm || 55,
            res.product.min_width_mm,
            res.product.max_width_mm,
            res.product.min_height_mm,
            res.product.max_height_mm
          );
          if (res.product.materials_json?.[0]) {
            designer.updateMaterial(res.product.materials_json[0].id);
          }
        }
      });
    }
  }, [slug, fetchProductBySlug]);

  // 2. Debounced (250ms) Live Pricing Calculation
  useEffect(() => {
    if (!activeProduct) return;
    const timer = setTimeout(() => {
      calculatePrice({
        product_id: activeProduct.id,
        width_mm: designer.config.width_mm,
        height_mm: designer.config.height_mm,
        quantity,
        material_id: designer.config.material_id,
        double_sided: designer.config.double_sided,
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [
    activeProduct,
    designer.config.width_mm,
    designer.config.height_mm,
    designer.config.material_id,
    designer.config.double_sided,
    quantity,
    calculatePrice,
  ]);

  // Handle Save Design
  const handleSaveDesign = async () => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
    if (!activeProduct) return;

    await designer.saveCurrentDesign(activeProduct.id, `${activeProduct.name} Custom Artwork`);
    setDesignSavedNotice(true);
    setTimeout(() => setDesignSavedNotice(false), 3000);
  };

  // Handle Checkout Click
  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
    setCheckoutModalOpen(true);
  };

  // Confirm Order Checkout
  const handleConfirmOrder = async () => {
    if (!activeProduct) return;

    await checkoutOrder({
      product_id: activeProduct.id,
      quantity,
      config_json: designer.config,
      design_json: {
        elements: designer.elements,
        bleed_mm: activeProduct.bleed_mm,
      },
      csv_rows_json: designer.csvRows.length > 0 ? designer.csvRows : undefined,
      payment_ref: `TEST_STP_${Date.now().toString(36).toUpperCase()}`,
    });

    setCheckoutModalOpen(false);
    setOrderConfirmedOpen(true);
  };

  return (
    <div className="max-w-[1900px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb / Title */}
      <div className="border-b border-zinc-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {activeProduct?.name || 'Custom Product Configurator'}
        </h1>
        <p className="text-xs font-mono text-zinc-500 mt-1">
          Precision mm trim bounds • 300 DPI Prepress Standard • Instant Monospace Quoting
        </p>
      </div>

      {designSavedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Design successfully saved to your Customer Dashboard.</span>
        </div>
      )}

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Visual Stage (3 Tabs) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Stage Tabs */}
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
            <button
              onClick={() => designer.setTab('designer')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors ${
                designer.activeTab === 'designer'
                  ? 'bg-[#18181B] text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              In-Browser Designer
            </button>
            <button
              onClick={() => designer.setTab('upload')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors ${
                designer.activeTab === 'upload'
                  ? 'bg-[#18181B] text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              Upload Artwork File
            </button>
            <button
              onClick={() => designer.setTab('csv')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors ${
                designer.activeTab === 'csv'
                  ? 'bg-[#18181B] text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              CSV Variable Data ({designer.csvRows.length})
            </button>
          </div>

          {/* Tab 1: Designer */}
          {designer.activeTab === 'designer' && (
            <div className="space-y-3">
              <DesignerToolbar
                selectedElement={designer.selectedElement}
                onAddText={() => designer.addTextElement('Custom Name', 15, 20)}
                onUpdateElement={(id, updates) => designer.updateElementProps(id, updates)}
                onDeleteElement={(id) => designer.deleteElement(id)}
                previewProof={designer.previewProof}
                onTogglePreview={designer.toggleProof}
              />

              <ConstrainedCanvas
                config={designer.config}
                elements={designer.elements}
                selectedElementId={designer.selectedElementId}
                onSelectElement={designer.selectElement}
                onUpdateElementPosition={(id, x, y) => designer.updateElementProps(id, { x, y })}
                previewProof={designer.previewProof}
                activeCsvRow={designer.csvRows[designer.activeCsvRowIndex]}
              />
            </div>
          )}

          {/* Tab 2: Upload Artwork */}
          {designer.activeTab === 'upload' && (
            <ArtworkUploader
              onFileUpload={designer.uploadArtworkFile}
              currentFileUrl={designer.uploadedFileUrl}
              currentFileName={designer.uploadedFileName}
            />
          )}

          {/* Tab 3: CSV Merge */}
          {designer.activeTab === 'csv' && (
            <CsvMergePanel
              onParseCsv={designer.parseCsv}
              csvHeaders={designer.csvHeaders}
              csvRows={designer.csvRows}
              activeCsvRowIndex={designer.activeCsvRowIndex}
              onSelectRowIndex={designer.setActiveCsvIndex}
            />
          )}
        </div>

        {/* Right Column: Sticky Configurator & Live Price Card */}
        <div className="lg:col-span-5 space-y-6">
          {activeProduct && (
            <ProductConfigurator
              product={activeProduct}
              config={designer.config}
              quantity={quantity}
              onConfigChange={(updates) => designer.updateDimensions(updates.width_mm || designer.config.width_mm, updates.height_mm || designer.config.height_mm)}
              onQuantityChange={(qty) => setQuantity(qty)}
            />
          )}

          <PriceSummaryCard
            quote={quote}
            loading={catLoading}
            onSaveDesign={handleSaveDesign}
            onCheckout={handleCheckoutClick}
          />
        </div>
      </div>

      {/* Checkout Payment Modal (Transactional - No Subscriptions) */}
      <Modal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        title="Confirm Order & Checkout"
        maxWidth="md"
      >
        <div className="space-y-5 text-xs font-mono">
          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg space-y-2">
            <div className="flex justify-between text-zinc-500">
              <span>Product:</span>
              <span className="font-bold text-zinc-900">{activeProduct?.name}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Finished Size:</span>
              <span className="text-zinc-900">
                {designer.config.width_mm}×{designer.config.height_mm}mm
              </span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Production Quantity:</span>
              <span className="text-zinc-900 font-bold">{quantity} units</span>
            </div>
            <div className="flex justify-between text-zinc-500 pt-2 border-t border-zinc-200">
              <span className="font-bold text-zinc-900">Amount Due:</span>
              <span className="text-base font-bold text-[#EA580C]">
                £{quote?.total_amount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="p-3 bg-orange-50 border border-orange-200 rounded text-[11px] text-zinc-700 space-y-1">
            <div className="font-bold text-[#EA580C] flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Prepress Assurance
            </div>
            <p>
              Placing this order automatically renders <strong>Proof v1</strong> on your dashboard.
              Manufacturing strictly starts after your official sign-off.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="md" onClick={() => setCheckoutModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" isLoading={submitting} onClick={handleConfirmOrder}>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay £{quote?.total_amount.toFixed(2)} & Start Job
            </Button>
          </div>
        </div>
      </Modal>

      {/* Order Confirmed & Proof v1 Ready Modal (Peak-End Rule) */}
      <Modal
        isOpen={orderConfirmedOpen}
        onClose={() => {
          setOrderConfirmedOpen(false);
          resetCheckout();
          router.push('/dashboard');
        }}
        title="Order Confirmed & Proof v1 Ready!"
        maxWidth="md"
      >
        <div className="space-y-4 text-center py-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold text-zinc-900">Job Queued in Prepress Pipeline</h3>

          <p className="text-xs font-mono text-zinc-600 leading-relaxed max-w-sm mx-auto">
            Your order <strong>{lastCreatedOrder?.order_code}</strong> has been generated with Net-30 invoice{' '}
            <strong>{lastCreatedOrder?.invoice_number}</strong>. Initial <strong>Proof v1</strong> is ready for your
            review.
          </p>

          <div className="pt-4">
            <Button
              variant="primary"
              size="md"
              className="w-full font-bold"
              onClick={() => {
                setOrderConfirmedOpen(false);
                resetCheckout();
                router.push('/dashboard');
              }}
            >
              <span>Go to Customer Dashboard & Review Proof</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
