import React, { useState } from "react";

const ImageUploadWithPreview = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);

      setPreviewUrl(imageUrl);
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  return (
    <div className="image-upload">
      <h3>Upload Image</h3>
      {previewUrl ? (
        <div className="image-preview">
          <img
            alt="Preview"
            src={previewUrl}
            style={{ width: "300px", height: "auto", marginBottom: "10px" }}
          />
          <button onClick={handleRemoveImage}>Remove Image</button>
        </div>
      ) : (
        <div>
          <input accept="image/*" type="file" onChange={handleImageChange} />
        </div>
      )}
    </div>
  );
};

export default ImageUploadWithPreview;
