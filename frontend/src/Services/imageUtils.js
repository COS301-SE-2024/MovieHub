import { supabase } from '../../../backend/src/supabaseClient.js';

export async function uploadImage(file, name, folder) {
  console.log('In Upload Image', file, folder);
  const fileName = `${Date.now()}_${name}`;
  const filePath = `${folder}/${fileName}`;
  console.log('Just before uploading');
  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  console.log('Data:', data);

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  return getImageUrl(data.fullPath);
}

export function getImageUrl(filePath) {
  console.log('In Get Image URL', filePath);
  const { data, error } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);
  console.log('Public URL:', data.publicUrl);

  if (error) {
    console.error('Error getting public URL:', error);
    return null;
  }

  return data.publicUrl;
}
