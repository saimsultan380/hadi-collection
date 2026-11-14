"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Star,
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit2,
  Upload,
  Eye,
  EyeOff,
  Image as ImageIcon,
  MessageSquare,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import type { Testimonial, TestimonialType } from "@/types/testimonial";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formType, setFormType] = React.useState<TestimonialType>("text");
  const [formName, setFormName] = React.useState("");
  const [formCity, setFormCity] = React.useState("");
  const [formRating, setFormRating] = React.useState<number | "">("");
  const [formText, setFormText] = React.useState("");
  const [formScreenshot, setFormScreenshot] = React.useState("");
  const [formProductLink, setFormProductLink] = React.useState("");
  const [formVerified, setFormVerified] = React.useState(false);
  const [formConsent, setFormConsent] = React.useState(false);
  const [formPublished, setFormPublished] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  // Load testimonials
  const fetchTestimonials = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (err) {
      console.error("Failed to load testimonials:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const resetForm = () => {
    setEditingId(null);
    setFormType("text");
    setFormName("");
    setFormCity("");
    setFormRating("");
    setFormText("");
    setFormScreenshot("");
    setFormProductLink("");
    setFormVerified(false);
    setFormConsent(false);
    setFormPublished(false);
    setErrorMsg(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setFormType(t.type);
    setFormName(t.customerName);
    setFormCity(t.city || "");
    setFormRating(t.rating ?? "");
    setFormText(t.text || "");
    setFormScreenshot(t.screenshotImage || "");
    setFormProductLink(t.productLink || "");
    setFormVerified(Boolean(t.isVerifiedBuyer));
    setFormConsent(Boolean(t.consentConfirmed));
    setFormPublished(Boolean(t.isPublished));
    setErrorMsg(null);
    setIsFormOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("screenshot", file);

    try {
      const res = await fetch("/api/testimonials/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const data = await res.json();
      setFormScreenshot(data.url);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Upload error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    if (!formName.trim()) {
      setErrorMsg("Please enter customer name (first name or initials).");
      return;
    }

    if (formType === "text" && !formText.trim()) {
      setErrorMsg("Please enter the review text.");
      return;
    }

    if (formType === "whatsapp_screenshot" && !formScreenshot.trim()) {
      setErrorMsg("Please upload the WhatsApp screenshot image.");
      return;
    }

    // STRICT CONSENT BLOCKING
    if (formPublished && !formConsent) {
      setErrorMsg(
        'Publishing blocked: You must check "The customer agreed to be shown on the website" before publishing.'
      );
      return;
    }

    setIsSaving(true);

    const payload: Partial<Testimonial> = {
      id: editingId || undefined,
      type: formType,
      customerName: formName.trim(),
      city: formCity.trim() || undefined,
      rating: formRating === "" ? undefined : Number(formRating),
      text: formType === "text" ? formText.trim() : undefined,
      screenshotImage: formType === "whatsapp_screenshot" ? formScreenshot.trim() : undefined,
      productLink: formProductLink.trim() || undefined,
      isVerifiedBuyer: formVerified,
      consentConfirmed: formConsent,
      isPublished: formPublished,
      sortOrder: editingId
        ? testimonials.find((t) => t.id === editingId)?.sortOrder ?? testimonials.length + 1
        : testimonials.length + 1,
    };

    try {
      const url = "/api/testimonials";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save testimonial");
      }

      setSuccessMsg(editingId ? "Testimonial updated successfully." : "Testimonial created successfully.");
      setIsFormOpen(false);
      resetForm();
      await fetchTestimonials();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the testimonial from "${name}"?`)) return;

    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setSuccessMsg("Testimonial deleted.");
      await fetchTestimonials();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to delete testimonial.");
    }
  };

  const handleTogglePublish = async (t: Testimonial) => {
    if (!t.isPublished && !t.consentConfirmed) {
      alert(
        'Cannot publish: The customer has not agreed to be shown on the website. Edit this testimonial and check "The customer agreed to be shown on the website" first.'
      );
      return;
    }

    try {
      const res = await fetch("/api/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...t,
          isPublished: !t.isPublished,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to toggle status");
      }

      await fetchTestimonials();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error updating");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= testimonials.length) return;

    const newList = [...testimonials];
    const [moved] = newList.splice(index, 1);
    newList.splice(targetIndex, 0, moved);

    const orderedIds = newList.map((item) => item.id);

    try {
      const res = await fetch("/api/testimonials/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });

      if (res.ok) {
        const updated = await res.json();
        setTestimonials(updated);
      }
    } catch (err) {
      console.error("Reorder error:", err);
    }
  };

  const publishedCount = testimonials.filter((t) => t.isPublished && t.consentConfirmed).length;

  return (
    <div className="min-h-screen bg-white py-12 text-black">
      <Container>
        {/* Breadcrumb & Navigation */}
        <div className="mb-6 flex items-center justify-between border-b border-[#E5E5E5] pb-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6B6B6B]">
              Hadi Collection Admin
            </p>
            <h1 className="font-sans text-2xl font-bold uppercase tracking-[0.04em] text-black sm:text-3xl">
              Customer Testimonials
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 border border-[#E5E5E5] px-3.5 py-2 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-black hover:bg-[#FAF8F5] transition-colors"
            >
              <span>View Store</span>
              <ExternalLink className="h-3.5 w-3.5 stroke-[1.5]" />
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Add Testimonial</span>
            </Button>
          </div>
        </div>

        {/* Status Highlights */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="border border-[#E5E5E5] bg-[#FAF8F5] p-4">
            <p className="font-sans text-xs uppercase tracking-[0.08em] text-[#6B6B6B]">
              Total Stored
            </p>
            <p className="mt-1 font-sans text-2xl font-bold text-black">
              {testimonials.length}
            </p>
            <p className="text-[11px] text-[#888888]">Real customer records</p>
          </div>

          <div className="border border-[#E5E5E5] bg-[#FAF8F5] p-4">
            <p className="font-sans text-xs uppercase tracking-[0.08em] text-[#6B6B6B]">
              Published on Site
            </p>
            <p className="mt-1 font-sans text-2xl font-bold text-black">
              {publishedCount}
            </p>
            <p className="text-[11px] text-[#888888]">
              {publishedCount >= 3 ? (
                <span className="text-[#25D366] font-medium">
                  ✓ Active on homepage (3+ published)
                </span>
              ) : (
                <span className="text-[#A6843D] font-medium">
                  Hidden on homepage (needs {3 - publishedCount} more)
                </span>
              )}
            </p>
          </div>

          <div className="border border-[#E5E5E5] bg-[#FAF8F5] p-4">
            <p className="font-sans text-xs uppercase tracking-[0.08em] text-[#6B6B6B]">
              Customer Consent
            </p>
            <p className="mt-1 font-sans text-2xl font-bold text-black">
              {testimonials.filter((t) => t.consentConfirmed).length} / {testimonials.length}
            </p>
            <p className="text-[11px] text-[#888888]">
              Required before publishing
            </p>
          </div>
        </div>

        {/* Global Notifications */}
        {errorMsg && (
          <div className="mb-6 flex items-center gap-2 border border-[#A6843D]/40 bg-[#FFF5F2] p-4 font-sans text-xs text-[#A6843D]">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 flex items-center gap-2 border border-black bg-[#FAF8F5] p-4 font-sans text-xs text-black">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#25D366]" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ── CREATE / EDIT MODAL ── */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto border border-[#E5E5E5] bg-white p-6 shadow-2xl sm:p-8">
              <div className="mb-6 flex items-center justify-between border-b border-[#E5E5E5] pb-4">
                <h2 className="font-sans text-lg font-bold uppercase tracking-[0.06em] text-black">
                  {editingId ? "Edit Testimonial" : "Add Real Testimonial"}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="font-sans text-sm font-semibold uppercase text-[#6B6B6B] hover:text-black"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* 1. Type Selector */}
                <div>
                  <label className="mb-2 block font-sans text-xs font-semibold uppercase tracking-[0.08em] text-black">
                    Testimonial Format *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormType("text")}
                      className={`flex items-center justify-center gap-2 border p-3 font-sans text-xs font-semibold uppercase tracking-[0.06em] transition-colors ${
                        formType === "text"
                          ? "border-black bg-black text-white"
                          : "border-[#E5E5E5] bg-white text-black hover:border-black"
                      }`}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Text Review</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormType("whatsapp_screenshot")}
                      className={`flex items-center justify-center gap-2 border p-3 font-sans text-xs font-semibold uppercase tracking-[0.06em] transition-colors ${
                        formType === "whatsapp_screenshot"
                          ? "border-black bg-black text-white"
                          : "border-[#E5E5E5] bg-white text-black hover:border-black"
                      }`}
                    >
                      <ImageIcon className="h-4 w-4" />
                      <span>WhatsApp Chat</span>
                    </button>
                  </div>
                </div>

                {/* 2. Customer Name & City */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-sans text-xs font-semibold uppercase tracking-[0.08em] text-black">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fatima or Ayesha K."
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full border border-[#E5E5E5] bg-white p-2.5 font-sans text-sm text-black placeholder:text-[#888888] focus:border-black focus:outline-none"
                    />
                    <p className="mt-1 text-[11px] text-[#888888]">
                      First name or initials only for privacy
                    </p>
                  </div>

                  <div>
                    <label className="mb-1 block font-sans text-xs font-semibold uppercase tracking-[0.08em] text-black">
                      City (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lahore, Karachi, Islamabad"
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      className="w-full border border-[#E5E5E5] bg-white p-2.5 font-sans text-sm text-black placeholder:text-[#888888] focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3. Rating */}
                <div>
                  <label className="mb-1 block font-sans text-xs font-semibold uppercase tracking-[0.08em] text-black">
                    Star Rating (Optional)
                  </label>
                  <select
                    value={formRating}
                    onChange={(e) => setFormRating(e.target.value ? Number(e.target.value) : "")}
                    className="w-full border border-[#E5E5E5] bg-white p-2.5 font-sans text-sm text-black focus:border-black focus:outline-none"
                  >
                    <option value="">No Star Rating (Unrated)</option>
                    <option value="5">★★★★★ (5 Stars)</option>
                    <option value="4">★★★★☆ (4 Stars)</option>
                    <option value="3">★★★☆☆ (3 Stars)</option>
                    <option value="2">★★☆☆☆ (2 Stars)</option>
                    <option value="1">★☆☆☆☆ (1 Star)</option>
                  </select>
                </div>

                {/* 4. Text Type: Review Body */}
                {formType === "text" && (
                  <div>
                    <label className="mb-1 block font-sans text-xs font-semibold uppercase tracking-[0.08em] text-black">
                      Review Content *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Paste real customer feedback here..."
                      value={formText}
                      onChange={(e) => setFormText(e.target.value)}
                      className="w-full border border-[#E5E5E5] bg-white p-2.5 font-sans text-sm text-black placeholder:text-[#888888] focus:border-black focus:outline-none"
                    />
                  </div>
                )}

                {/* 5. Screenshot Type: Image Uploader & Strict Warning */}
                {formType === "whatsapp_screenshot" && (
                  <div className="space-y-3">
                    {/* Mandatory Admin Privacy Notice */}
                    <div className="flex items-start gap-2 border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
                      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                      <div>
                        <p className="font-semibold">Privacy Reminder:</p>
                        <p>Hide phone numbers and profile photos before uploading.</p>
                      </div>
                    </div>

                    <label className="mb-1 block font-sans text-xs font-semibold uppercase tracking-[0.08em] text-black">
                      Upload WhatsApp Screenshot Image *
                    </label>

                    <div className="flex items-center gap-4">
                      <label className="flex cursor-pointer items-center gap-2 border border-black bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-black hover:bg-black hover:text-white transition-colors">
                        <Upload className="h-4 w-4" />
                        <span>{isUploading ? "Uploading..." : "Choose Image"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </label>

                      {formScreenshot && (
                        <span className="font-sans text-xs text-[#25D366] font-medium">
                          ✓ Image uploaded
                        </span>
                      )}
                    </div>

                    {formScreenshot && (
                      <div className="relative mt-2 h-40 w-32 overflow-hidden border border-[#E5E5E5] bg-[#FAF8F5]">
                        <Image
                          src={formScreenshot}
                          alt="Screenshot preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* 6. Product Link (Optional) */}
                <div>
                  <label className="mb-1 block font-sans text-xs font-semibold uppercase tracking-[0.08em] text-black">
                    Associated Product Link (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /category/lawn-prints or /shop/noor-floral-lawn"
                    value={formProductLink}
                    onChange={(e) => setFormProductLink(e.target.value)}
                    className="w-full border border-[#E5E5E5] bg-white p-2.5 font-sans text-sm text-black placeholder:text-[#888888] focus:border-black focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-[#888888]">
                    Shows a &quot;View product&quot; link and attaches Review JSON-LD schema only if linked.
                  </p>
                </div>

                {/* 7. Verified Buyer Checkbox */}
                <div className="border-t border-[#E5E5E5] pt-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formVerified}
                      onChange={(e) => setFormVerified(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded-[4px] accent-black"
                    />
                    <div>
                      <span className="font-sans text-xs font-semibold uppercase tracking-[0.06em] text-black">
                        Verified Buyer
                      </span>
                      <p className="text-[11px] text-[#888888]">
                        Check this manually only if this customer placed a real order.
                      </p>
                    </div>
                  </label>
                </div>

                {/* 8. Mandatory Customer Consent Checkbox */}
                <div className="border border-black/20 bg-[#FAF8F5] p-3.5">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formConsent}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormConsent(checked);
                        if (!checked) {
                          setFormPublished(false); // Auto unpublish if consent unchecked
                        }
                      }}
                      className="mt-1 h-4 w-4 rounded-[4px] accent-black"
                    />
                    <div>
                      <span className="font-sans text-xs font-bold uppercase tracking-[0.06em] text-black">
                        The customer agreed to be shown on the website *
                      </span>
                      <p className="mt-0.5 text-[11px] text-[#6B6B6B]">
                        REQUIRED. Testimonials cannot be published without documented customer agreement.
                      </p>
                    </div>
                  </label>
                </div>

                {/* 9. Publish Status Checkbox */}
                <div>
                  <label
                    className={`flex items-start gap-3 ${
                      !formConsent ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={!formConsent}
                      checked={formPublished}
                      onChange={(e) => {
                        if (!formConsent) {
                          alert("Consent must be checked before publishing.");
                          return;
                        }
                        setFormPublished(e.target.checked);
                      }}
                      className="mt-1 h-4 w-4 rounded-[4px] accent-black"
                    />
                    <div>
                      <span className="font-sans text-xs font-semibold uppercase tracking-[0.06em] text-black">
                        Publish on Website
                      </span>
                      <p className="text-[11px] text-[#888888]">
                        {!formConsent
                          ? "Blocked: Confirm customer consent above to enable publishing."
                          : "Ready to display on the storefront once published."}
                      </p>
                    </div>
                  </label>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 border-t border-[#E5E5E5] pt-5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={isSaving}>
                    {isSaving ? "Saving..." : editingId ? "Update Testimonial" : "Create Testimonial"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── LIST OF STORED TESTIMONIALS ── */}
        <div className="border border-[#E5E5E5]">
          <div className="border-b border-[#E5E5E5] bg-[#FAF8F5] px-6 py-4">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-black">
              Stored Testimonials ({testimonials.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center font-sans text-sm text-[#888888]">
              Loading testimonials...
            </div>
          ) : testimonials.length === 0 ? (
            /* Strict Zero-Placeholder Empty State */
            <div className="p-16 text-center">
              <p className="font-sans text-base font-semibold uppercase tracking-[0.06em] text-black">
                No Testimonials Added Yet
              </p>
              <p className="mx-auto mt-2 max-w-md font-sans text-xs text-[#6B6B6B] leading-relaxed">
                In adherence with our authentic review rule, no demo reviews or placeholders exist.
                Click &quot;Add Testimonial&quot; above to record your first real customer feedback.
              </p>
              <div className="mt-6">
                <Button variant="primary" size="sm" onClick={handleOpenCreate}>
                  <Plus className="mr-1.5 h-4 w-4" />
                  <span>Add First Testimonial</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#E5E5E5]">
              {testimonials.map((t, index) => (
                <div
                  key={t.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-[#FAF8F5]/50 transition-colors"
                >
                  {/* Left: Reorder & Info */}
                  <div className="flex items-start gap-4">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-1 pt-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMove(index, "up")}
                        aria-label="Move Up"
                        className="flex h-7 w-7 items-center justify-center border border-[#E5E5E5] text-[#6B6B6B] hover:border-black hover:text-black disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === testimonials.length - 1}
                        onClick={() => handleMove(index, "down")}
                        aria-label="Move Down"
                        className="flex h-7 w-7 items-center justify-center border border-[#E5E5E5] text-[#6B6B6B] hover:border-black hover:text-black disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Screenshot thumbnail if image */}
                    {t.type === "whatsapp_screenshot" && t.screenshotImage ? (
                      <div className="relative h-16 w-12 shrink-0 overflow-hidden border border-[#E5E5E5] bg-[#E7F3E8]">
                        <Image
                          src={t.screenshotImage}
                          alt={t.customerName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-12 shrink-0 items-center justify-center border border-[#E5E5E5] bg-white text-[#6B6B6B]">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                    )}

                    {/* Details */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-sans text-sm font-bold text-black">
                          {t.customerName}
                        </span>
                        {t.city && (
                          <span className="text-xs text-[#6B6B6B]">· {t.city}</span>
                        )}

                        {t.type === "whatsapp_screenshot" ? (
                          <span className="border border-[#25D366] bg-[#E7F3E8] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#128C7E]">
                            WhatsApp Chat
                          </span>
                        ) : (
                          <span className="border border-[#E5E5E5] bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6B6B6B]">
                            Text Review
                          </span>
                        )}

                        {t.isVerifiedBuyer && (
                          <span className="border border-black bg-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-white">
                            Verified Buyer
                          </span>
                        )}
                      </div>

                      {/* Stars */}
                      {t.rating && (
                        <div className="mt-1 flex items-center gap-0.5 text-black">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`h-3 w-3 ${
                                s <= (t.rating || 0)
                                  ? "fill-black stroke-black"
                                  : "fill-transparent stroke-[#CCCCCC]"
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Excerpt */}
                      {t.text && (
                        <p className="mt-1 line-clamp-2 max-w-lg font-sans text-xs text-[#555555]">
                          &quot;{t.text}&quot;
                        </p>
                      )}

                      {/* Consent & Product link info */}
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-[#888888]">
                        <span className="flex items-center gap-1">
                          {t.consentConfirmed ? (
                            <span className="text-[#25D366] font-medium">✓ Consent Confirmed</span>
                          ) : (
                            <span className="text-[#A6843D] font-medium">⚠ No Consent</span>
                          )}
                        </span>

                        {t.productLink && (
                          <span className="font-sans">
                            Linked: <code className="text-black">{t.productLink}</code>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 sm:self-center">
                    {/* Publish Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(t)}
                      className={`inline-flex items-center gap-1.5 border px-3 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.06em] transition-colors ${
                        t.isPublished
                          ? "border-[#25D366] bg-[#E7F3E8] text-[#128C7E] hover:bg-white"
                          : "border-[#E5E5E5] bg-white text-[#888888] hover:border-black hover:text-black"
                      }`}
                    >
                      {t.isPublished ? (
                        <>
                          <Eye className="h-3.5 w-3.5" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3.5 w-3.5" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(t)}
                      aria-label="Edit"
                      className="flex h-9 w-9 items-center justify-center border border-[#E5E5E5] text-black hover:bg-black hover:text-white transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(t.id, t.customerName)}
                      aria-label="Delete"
                      className="flex h-9 w-9 items-center justify-center border border-[#E5E5E5] text-[#A6843D] hover:border-[#A6843D] hover:bg-[#A6843D] hover:text-white transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
