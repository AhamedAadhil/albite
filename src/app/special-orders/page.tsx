"use client";

import React, { useState } from "react";
import { components } from "@/components";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const SpecialOrderPage: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    address: "",
    guests: "",
    note: "",
    mealType: "",
    eventType: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submit behavior (page reload)
    setError(null);

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.date.trim() ||
      !form.note.trim() ||
      !form.guests.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("/api/special-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          date: form.date,
          time: form.time || undefined,
          address: form.address || undefined,
          guests: Number(form.guests),
          note: form.note,
          mealType: form.mealType || undefined,
          eventType: form.eventType || undefined,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitted(true); // Show thank you message and hide form
        toast.success(data.message);
      } else {
        setError(data.error || "Submission failed");
        toast.error(data.error || "Submission failed");
      }
    } catch (err: any) {
      setError("Server error: " + err.message);
    }
  };

  return (
    <components.Screen>
      <main
        className="scrollable container"
        style={{ maxWidth: 500, margin: "0 auto", padding: 24 }}
      >
        <section
          style={{
            background: "linear-gradient(135deg, #ED1A25 0%, #F9A826 100%)",
            color: "#fff",
            borderRadius: 14,
            padding: 24,
            boxShadow: "0 4px 24px rgba(237,26,37, .13)",
            marginBottom: 36,
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12 }}>
            Special Orders at Albite
          </h1>
          <p style={{ fontSize: 16, marginBottom: 10, lineHeight: 1.5 }}>
            Hosting an event or craving something extraordinary? Albite’s
            Special Orders are perfect for bulk catering, celebrations, custom
            recipes, and one-of-a-kind requests! <br />
            Share your vision and our team will craft a unique culinary
            experience just for you.
          </p>
        </section>

        {submitted ? (
          <section
            style={{
              backgroundColor: "var(--white-color)",
              borderRadius: 10,
              padding: 28,
              boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#ED1A25", marginBottom: 12 }}>Thank you!</h2>
            <p style={{ fontSize: 16, marginBottom: 16 }}>
              Your special order request has been received. Our team will
              contact you soon to discuss your requirements.
            </p>
            <p style={{ color: "#ED1A25", fontWeight: 600 }}>
              Don’t forget: If your special order is completed, you’ll earn
              Albite Loyalty Points!
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 24,
              }}
            >
              <button
                onClick={() => router.push("/tab-navigator")}
                style={{
                  width: 160,
                  height: 40,
                  backgroundColor: "#ED1A25",
                  border: "none",
                  borderRadius: 6,
                  color: "white",
                  fontWeight: "600",
                  fontSize: 15,
                  cursor: "pointer",
                  textAlign: "center",
                  justifyItems: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                Go Home
              </button>
            </div>
          </section>
        ) : (
          <form
            onSubmit={handleSubmit}
            method="post"
            style={{
              borderRadius: 10,
              backgroundColor: "var(--white-color)",
              padding: 28,
              boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
            }}
            autoComplete="off"
          >
            <h2 style={{ marginBottom: 14 }}>Tell us what you need</h2>
            {error && (
              <p style={{ color: "red", marginBottom: 16, fontWeight: "600" }}>
                {error}
              </p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* input fields */}
              <input
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="order-input"
                style={{
                  padding: 12,
                  borderRadius: 6,
                  border: "1px solid #eee",
                }}
              />
              <input
                name="phone"
                placeholder="Contact Number"
                value={form.phone}
                onChange={handleChange}
                required
                className="order-input"
                style={{
                  padding: 12,
                  borderRadius: 6,
                  border: "1px solid #eee",
                }}
              />
              <input
                type="date"
                name="date"
                placeholder="Date Needed"
                value={form.date}
                onChange={handleChange}
                required
                className="order-input"
                style={{
                  padding: 12,
                  borderRadius: 6,
                  border: "1px solid #eee",
                }}
              />
              <input
                type="time"
                name="time"
                placeholder="Preferred Time (optional)"
                value={form.time}
                onChange={handleChange}
                className="order-input"
                style={{
                  padding: 12,
                  borderRadius: 6,
                  border: "1px solid #eee",
                }}
              />
              <input
                name="address"
                placeholder="Address (optional)"
                value={form.address}
                onChange={handleChange}
                className="order-input"
                style={{
                  padding: 12,
                  borderRadius: 6,
                  border: "1px solid #eee",
                }}
              />
              <input
                type="number"
                name="guests"
                placeholder="No. of People / Servings Needed"
                value={form.guests}
                onChange={handleChange}
                required
                min={1}
                className="order-input"
                style={{
                  padding: 12,
                  borderRadius: 6,
                  border: "1px solid #eee",
                }}
              />
              <select
                name="mealType"
                value={form.mealType}
                onChange={handleChange}
                className="order-input"
                style={{
                  padding: 12,
                  borderRadius: 6,
                  border: "1px solid #eee",
                  backgroundColor: "white",
                }}
              >
                <option value="">Select Meal Type (optional)</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="other">Other</option>
              </select>
              <select
                name="eventType"
                value={form.eventType}
                onChange={handleChange}
                className="order-input"
                style={{
                  padding: 12,
                  borderRadius: 6,
                  border: "1px solid #eee",
                  backgroundColor: "white",
                }}
              >
                <option value="">Select Event Type (optional)</option>
                <option value="wedding">Wedding</option>
                <option value="birthday">Birthday</option>
                <option value="funeral">Funeral</option>
                <option value="party">Party</option>
                <option value="other">Other</option>
              </select>
              <textarea
                name="note"
                placeholder="Describe your event, special dish, or any specifics..."
                value={form.note}
                onChange={handleChange}
                rows={4}
                required
                className="order-input"
                style={{
                  padding: 12,
                  borderRadius: 6,
                  border: "1px solid #eee",
                  resize: "vertical",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: 30,
                width: "100%",
                minWidth: 180,
                height: 44,
                backgroundColor: "#ED1A25",
                border: "none",
                borderRadius: 6,
                color: "white",
                fontWeight: "600",
                fontSize: 16,
                textAlign: "center",
                cursor: "pointer",
                justifyItems: "center",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              Submit Special Order
            </button>

            <p style={{ fontSize: 13, color: "#777", marginTop: 18 }}>
              When your order is fulfilled, you’ll earn Albite Loyalty Points as
              our thanks!
            </p>
          </form>
        )}
      </main>
    </components.Screen>
  );
};

export default SpecialOrderPage;
