// Helper for converting File to Cloudinary URL via backend
// Shared utilities
export function optimizeCloudinaryUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.includes('cloudinary.com') && !url.includes('f_auto') && !url.includes('q_auto')) {
    return url.replace('/upload/', '/upload/f_auto,q_auto/');
  }
  return url;
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to upload to Cloudinary");
    }
    return data.url;
  } catch (error) {
    console.error("Upload error:", error);
    console.error("Image upload failed. Please check Cloudinary configuration.");
    throw error;
  }
}


// Backend operations
export const api = {
  // Site Settings
  async getSiteSettings() {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Fetch failed');
      return await res.json();
    } catch (e) {
      return JSON.parse(localStorage.getItem('site_settings_v2') || '{}');
    }
  },
  async updateSiteSettings(settings: { logoUrl?: string, ceoImageUrl?: string }) {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('Fetch failed');
    } catch (e) {
      // fallback
    }
    const current = JSON.parse(localStorage.getItem('site_settings_v2') || '{}');
    localStorage.setItem('site_settings_v2', JSON.stringify({ ...current, ...settings }));
  },

  // Key-Value Store
  async getData(key: string, defaultValue: any = null) {
    if (key === 'active_customer') {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue));
    }
    try {
      const res = await fetch(`/api/store/${key}`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      return data.value;
    } catch (e) {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue));
    }
  },
  async setData(key: string, value: any) {
    if (key === 'active_customer') {
      localStorage.setItem(key, JSON.stringify(value));
      return;
    }
    try {
      await fetch(`/api/store/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });
    } catch (e) {
      // ignore
    }
    localStorage.setItem(key, JSON.stringify(value));
  },

  // Products
  async getProducts() {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Fetch failed');
      return await res.json();
    } catch (e) {
      // Fallback for when DB is down
      return JSON.parse(localStorage.getItem('products_data') || '[]');
    }
  },
  async addProduct(product: Omit<any, 'id'>) {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (!res.ok) throw new Error('Fetch failed');
      return await res.json();
    } catch (e) {
      // Fallback
      let products = JSON.parse(localStorage.getItem('products_data') || '[]');
      const newP = { ...product, id: Date.now().toString() };
      products.push(newP);
      localStorage.setItem('products_data', JSON.stringify(products));
      return newP;
    }
  },
  async updateProduct(id: string, updates: any) {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Fetch failed');
    } catch (e) {
      let products = JSON.parse(localStorage.getItem('products_data') || '[]');
      products = products.map((p: any) => p.id === id ? { ...p, ...updates } : p);
      localStorage.setItem('products_data', JSON.stringify(products));
    }
  },
  async deleteProduct(id: string) {
    try {
      console.log(`Deleting product via API: ${id}`);
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errText = await res.text();
        console.error("Delete failed:", errText);
        throw new Error('Fetch failed');
      }
      console.log("Delete successful");
    } catch (e) {
      console.error("Error in deleteProduct:", e);
      // Remove localStorage fallback to avoid silently hiding API errors
      throw e;
    }
  }
};
