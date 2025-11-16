// File: app/dashboard/seller/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './sellerDashboard.module.css'; 
import CreateProductForm from './products/CreateProductForm';

// --- API & TIPE SETUP ---
const API_PRODUCTS_URL = 'http://localhost:5001/api/products/admin'; 
const BASE_PRODUCTS_URL = 'http://localhost:5001/api/products'; // Untuk DELETE & PATCH

interface Product {
    _id: string;
    name: string;
    price: number;
    stock: number;
    tags?: string[]; 
    images?: string[]; 
    description: string;
}
type ActiveSection = 'dashboard' | 'products' | 'notifications' | 'logout';

const SellerDashboardPage: React.FC = () => {
    const router = useRouter();
    
    // --- STATE UTAMA ---
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
    
    // 🚨 STATE BARU UNTUK EDIT
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Product | null>(null); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Data dummy stats
    const mockStats = {
      totalRevenue: 100000000,
      totalOrders: 50,
      growth: 0.20,
  };
    
    // --- LOGIC FETCH PRODUK (GET) ---
    const fetchProductsForAdmin = async () => {
        // ... (Logika fetch produk tetap sama) ...
        const token = localStorage.getItem('userToken');
        if (!token) return;

        try {
            const response = await fetch(API_PRODUCTS_URL, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const result = await response.json();
            setProducts(result.data || []); 
        } catch (err: any) {
            setError(err.message || 'Gagal memuat data produk.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductsForAdmin();
    }, [router]);
    
    // --- HANDLER DELETE ---
    const handleDelete = async (_id: string) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
        const token = localStorage.getItem('userToken');

        try {
            const response = await fetch(`${BASE_PRODUCTS_URL}/${_id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                alert("Produk berhasil dihapus!");
                // Hapus produk dari state secara lokal
                setProducts(products.filter(p => p._id !== _id)); 
            } else {
                throw new Error("Gagal menghapus produk. Akses ditolak.");
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleAddProduct = async (newProductData: Partial<Product>) => {
      setIsSubmitting(true);
      const token = localStorage.getItem('userToken');
      const requiredFields = ['name', 'price', 'stock', 'description']; // Tambahkan field wajib lainnya
  
      // 🚨 CLIENT-SIDE VALIDATION SEDERHANA (untuk mencegah 400 Bad Request)
      for (const field of requiredFields) {
          if (!newProductData[field as keyof Partial<Product>]) {
              alert(`Field '${field}' wajib diisi.`);
              setIsSubmitting(false);
              return;
          }
      }
      
      try {
          const response = await fetch(`${BASE_PRODUCTS_URL}`, { // POST ke /api/products
              method: 'POST', 
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`, // Token Seller
              },
              body: JSON.stringify(newProductData),
          });
  
          if (response.ok) {
              alert("Produk baru berhasil ditambahkan!");
              setIsCreating(false); // Tutup form
              fetchProductsForAdmin(); // Re-fetch data tabel
          } else {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Gagal menambahkan produk baru.');
          }
      } catch (error: any) {
          setError(error.message);
      } finally {
          setIsSubmitting(false);
      }
  };

    // --- HANDLER UPDATE (SAVE EDIT) ---
    const handleUpdate = async () => {
        if (!formData || !editingProduct) return;
        
        setIsSubmitting(true);
        const token = localStorage.getItem('userToken');
        
        try {
            const response = await fetch(`${BASE_PRODUCTS_URL}/${editingProduct._id}`, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name, 
                    price: Number(formData.price),
                    stock: Number(formData.stock),
                    description: formData.description,
                    // ❌ HAPUS BARIS INI: slug: formData.slug,
                    images: Array.isArray(formData.images) 
                        ? formData.images 
                        : (formData.images ? [formData.images] : ['/images/placeholder.jpg'])
                }),
            });
    
            const data = await response.json();
            
            if (response.ok) {
                alert("Produk berhasil diupdate!");
                setEditingProduct(null); 
                fetchProductsForAdmin(); 
            } else {
                throw new Error(data.message || "Gagal update produk");
            }
        } catch (error: any) {
            console.error("Update error:", error);
            alert(`Error: ${error.message}`);
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- HANDLER EDIT CLICK (Membuka Form) ---
    const handleEditClick = (product: Product) => {
      setEditingProduct(product); 
      setFormData(product); // Inisialisasi form data
    };

    // --- LOGIC LOGOUT ---
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
        router.push('/login');
    };

    // --- LOGIC LOGOUT & RENDER KONTEN ---
    const renderSalesDashboard = () => (
      <div className={styles.mainContentArea}>
          <h1 className={styles.pageTitle}>Sales Dashboard</h1>
          <br></br>

          {/* 🚨 STATS GRID */}
          <div className={styles.statsGrid}>
              {/* Total Penjualan */}
              <div className={styles.statCard}>
                  <p className={styles.statLabel}>Total Penjualan</p>
                  <p className={styles.statValue}>Rp{mockStats.totalRevenue.toLocaleString('id-ID')}</p>
              </div>
              {/* Total Orders */}
              <div className={styles.statCard}>
                  <p className={styles.statLabel}>Total Orders</p>
                  <p className={styles.statValue}>{mockStats.totalOrders}</p>
              </div>
              {/* Jumlah Produk (Data Live) */}
              <div className={styles.statCard}>
                  <p className={styles.statLabel}>Jumlah Produk</p>
                  <p className={styles.statValue}>{products.length}</p> 
              </div>
              {/* Growth */}
              <div className={styles.statCard}>
                  <p className={styles.statLabel}>Growth</p>
                  <p className={styles.statValue}>{mockStats.growth * 100}%</p>
              </div>
          </div>

          <h2 className={styles.sectionTitle}>Top Selling Products</h2>
          <div className={styles.productsContent}>
              {/* Placeholder Chart */}
              <div style={{ height: '300px', width: '100%', backgroundColor: '#f0f0f0', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <p>Placeholder Chart Penjualan Mingguan</p>
              </div>
          </div>
      </div>
  );
    
  const renderEditForm = () => {
    // 🚨 Ambil URL gambar pertama dari formData untuk ditampilkan dan diedit
    const currentImageUrl = formData?.images?.[0] || ''; 
    
    return (
        <div className={styles.mainContentArea}>
            <h1 className={styles.pageTitle}>Edit Produk: {editingProduct?.name}</h1>
            
            {/* Form Input Sederhana */}
            <div className={styles.tableWrapper} style={{ padding: '30px' }}>
                <p className={styles.formLabel}>Nama Produk</p>
                <input 
                    type="text" 
                    value={formData?.name || ''} 
                    className={styles.formInput}
                    onChange={(e) => setFormData(prev => ({...prev!, name: e.target.value}))}
                />
                
                <p className={styles.formLabel} style={{ marginTop: '20px' }}>Harga</p>
                <input 
                    type="number" 
                    value={formData?.price || 0} 
                    className={styles.formInput}
                    onChange={(e) => setFormData(prev => ({...prev!, price: Number(e.target.value)}))}
                />
                
                <p className={styles.formLabel} style={{ marginTop: '20px' }}>Stok</p>
                <input 
                    type="number" 
                    value={formData?.stock || 0} 
                    className={styles.formInput}
                    onChange={(e) => setFormData(prev => ({...prev!, stock: Number(e.target.value)}))}
                />

                {/* --- BAGIAN EDIT GAMBAR (INPUT URL) --- */}
                <p className={styles.formLabel} style={{ marginTop: '30px' }}>URL Gambar Saat Ini</p>
                
                {/* Pratinjau Gambar Saat Ini */}
                {currentImageUrl && (
                    <img 
                        src={currentImageUrl} 
                        alt="Current Product Image" 
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} 
                    />
                )}
                
                {/* Input untuk URL Gambar Baru */}
                <input 
                    type="text" 
                    value={currentImageUrl} 
                    className={styles.formInput}
                    placeholder="Paste URL gambar baru di sini"
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev!, 
                      images: [e.target.value] 
                  }))}
                />
                
                {/* --- Tombol Aksi --- */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                    <button 
                        className={styles.submitButton} 
                        onClick={handleUpdate} 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Updating...' : 'Save Changes'}
                    </button>
                    <button 
                        className={styles.cancelButton} 
                        onClick={() => setEditingProduct(null)} 
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

    const renderMyProducts = () => (
        <div className={styles.mainContentArea}>
            <h1 className={styles.pageTitle}>My Products</h1>
            {/* ... (Tabel Produk) ... */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                <thead>
                      <tr>
                          <th className={styles.tableTh}>IMAGE</th>
                          <th className={styles.tableTh}>PRODUCT NAME</th>
                          <th className={styles.tableTh}>CATEGORY</th>
                          <th className={styles.tableTh}>PRICE</th>
                          <th className={styles.tableTh}>STOCK</th>
                          <th className={styles.tableTh}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td> {/* Placeholder Gambar */} </td>
                                <td>{product.name}</td>
                                <td>Rp{product.price.toLocaleString('id-ID')}</td>
                                <td>{product.stock}</td>
                                <td className={styles.actionButtons}>
                                    <button 
                                        className={styles.editBtn}
                                        onClick={() => handleEditClick(product)} // 🚨 Pasang handler Edit
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className={styles.deleteBtn} 
                                        onClick={() => handleDelete(product._id)} // 🚨 Pasang handler Delete
                                    >
                                      Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className={styles.addProductBtn} onClick={() => setIsCreating(true)} 
            >
              + Add New Product
            </button>
        </div>
    );
    
    // --- PENANGANAN LOADING UTAMA ---
    if (loading) return <div className="text-center p-20">Memuat Dashboard...</div>;
    if (error) return <div className="text-center p-20 text-red-500">{error}</div>;

    const renderContent = () => {
        // 🚨 KONDISI PERTAMA: Tampilkan Form Edit jika ada produk yang dipilih
        if (editingProduct) {
            return renderEditForm(); 
        }

        if (isCreating) {
          return (
              <CreateProductForm 
                  onSave={handleAddProduct} 
                  onClose={() => setIsCreating(false)} 
                  isSubmitting={isSubmitting}
              />
          );
      }

        switch (activeSection) {
            case 'dashboard':
                return renderSalesDashboard();
            case 'products':
                return renderMyProducts();
            case 'notifications':
                 return <div className={styles.mainContentArea}>Notifications Content</div>; 
            default:
                return renderSalesDashboard();
        }
    };
    
    // Array untuk sidebar menu
    const menuItems = [
      { label: 'Dashboard', key: 'dashboard' },
      { label: 'My Products', key: 'products' },
      { label: 'Notification', key: 'notifications' },
      { label: 'Log Out', key: 'logout' },
    ];

    return (
        <div className={styles.container}> 
            {/* --- Left Sidebar / Navigation --- */}
            <aside className={styles.sidebar}>
                <div className={styles.profile}>
                    <div className={styles.avatar}>TJ</div> {/* Inisial Statis "TJ" */}
                </div>
                
                <nav className={styles.nav}>
                    {menuItems.map(item => (
                        <button
                            key={item.key}
                            onClick={() => {
                                if (item.key === 'logout') {
                                    handleLogout(); 
                                } else {
                                    setActiveSection(item.key as ActiveSection);
                                }
                            }}
                            // 🚨 Terapkan class navItem dan navItemActive
                            className={`${styles.navItem} ${activeSection === item.key ? styles.navItemActive : ''}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>
            <main className={styles.main}>
                {renderContent()}
            </main>
        </div>
    );
};

export default SellerDashboardPage;