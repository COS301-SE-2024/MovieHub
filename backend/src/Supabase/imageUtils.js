import { supabase } from './supabaseClient.js';

export async function uploadImage(file) {
  const fileName = `${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, file);

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  return data.Key;
}

export function getImageUrl(filePath) {
  const { publicURL, error } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  if (error) {
    console.error('Error getting public URL:', error);
    return null;
  }

  return publicURL;
}
