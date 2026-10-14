import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createProductRequest, fetchAdminProducts, updateProductRequest } from "../../api/admin";
import { getErrorMessage } from "../../api/client";
import { useToast } from "../../context/toast-context";
import Button from "../../components/Button";
import PageLoader from "../../components/PageLoader";
import TextInput from "../../components/TextInput";

// One form used for both "Add product" (/admin/products/new)
// and "Edit product" (/admin/products/:id/edit)
export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null); // a newly chosen image
  const [currentImageUrl, setCurrentImageUrl] = useState(""); // the image the product already has
  const [previewUrl, setPreviewUrl] = useState(""); // preview of the newly chosen image

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // When editing, load the product and fill the form.
  // (The backend has no "get one admin product" route, so we find it in the admin list.)
  useEffect(() => {
    if (!id) return;

    fetchAdminProducts()
      .then((products) => {
        const product = products.find((item) => item._id === id);
        if (!product) {
          setError("Product not found");
          return;
        }
        setName(product.name);
        setCategory(product.category);
        setPrice(String(product.price));
        setDescription(product.description ?? "");
        setCurrentImageUrl(product.imageUrl ?? "");
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  // Free the temporary preview URL when it changes or the page closes
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    // FormData is how we send text fields and a file together
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("category", category.trim());
    formData.append("price", price);
    formData.append("description", description.trim());
    if (imageFile) formData.append("image", imageFile);

    try {
      if (id) {
        await updateProductRequest(id, formData);
        showToast("Product updated");
      } else {
        await createProductRequest(formData);
        showToast("Product created");
      }
      navigate("/admin/products");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  const imageToShow = previewUrl || currentImageUrl;

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin/products" className="text-sm text-slate-500 hover:text-indigo-600">
        ← Back to products
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">{isEditing ? "Edit product" : "Add product"}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {error && <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>}

        <TextInput id="name" label="Product name" required value={name} onChange={(e) => setName(e.target.value)} />

        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput
            id="category"
            label="Category"
            required
            placeholder="e.g. Electronics"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <TextInput
            id="price"
            label="Price"
            type="number"
            required
            min={0}
            step="any"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="image" className="mb-1 block text-sm font-medium text-gray-700">
            Product image {isEditing && "(leave empty to keep the current one)"}
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {imageToShow && (
            <img src={imageToShow} alt="Product preview" className="mt-4 h-40 w-40 rounded-xl border border-slate-200 object-cover" />
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <Button variant="secondary" onClick={() => navigate("/admin/products")} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {saving ? "Saving..." : isEditing ? "Save changes" : "Create product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
