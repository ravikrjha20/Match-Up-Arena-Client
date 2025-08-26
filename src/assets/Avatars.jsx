// Avatars.jsx
const Avatars = import.meta.glob("./avatars/*.png", { eager: true });

// Convert objects into arrays of image paths
export const avatars = Object.values(Avatars).map((img) => img.default);
